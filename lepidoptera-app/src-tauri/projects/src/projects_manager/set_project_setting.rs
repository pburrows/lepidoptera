use std::sync::Arc;
use crate::entities::ProjectSettings;
use crate::project_settings_sqlite_repository::ProjectSettingsRepository;
use anyhow::Result;
use serde_json::Value;
use chrono::Utc;

pub fn set_project_setting(
    repository: &Arc<dyn ProjectSettingsRepository>,
    project_id: String,
    setting_key: String,
    setting_value: Value,
    updated_by: String,
) -> Result<Value> {
    // If this is SEQUENCE_PREFIX, check for uniqueness
    if setting_key == "SEQUENCE_PREFIX" {
        if let Value::String(prefix_value) = &setting_value {
            // Serialize the value to JSON string for comparison (as stored in DB)
            let serialized_value = serde_json::to_string(&setting_value)
                .map_err(|e| anyhow::anyhow!("Failed to serialize setting value: {}", e))?;
            
            // Check if another project already has this SEQUENCE_PREFIX
            if let Some(existing_setting) = repository.find_by_key_and_value("SEQUENCE_PREFIX", &serialized_value)? {
                // If it's the same project, allow the update
                if existing_setting.project_id != project_id {
                    return Err(anyhow::anyhow!(
                        "A project with SEQUENCE_PREFIX '{}' already exists. Please choose a different prefix.",
                        prefix_value
                    ));
                }
            }
        }
    }
    
    // Check if setting already exists to preserve created_at and created_by
    let existing = repository.find_by_project_and_key(&project_id, &setting_key)?;
    
    let setting = ProjectSettings {
        id: existing.as_ref().and_then(|s| s.id.clone()),
        project_id,
        setting_key,
        setting_value: setting_value.clone(),
        created_at: existing
            .as_ref()
            .map(|s| s.created_at.clone())
            .unwrap_or_else(|| Utc::now().to_rfc3339()),
        updated_at: Some(Utc::now().to_rfc3339()),
        created_by: existing
            .as_ref()
            .map(|s| s.created_by.clone())
            .unwrap_or_else(|| updated_by.clone()),
        updated_by: Some(updated_by),
    };
    
    let result = repository.upsert(setting)?;
    Ok(result.setting_value)
}

