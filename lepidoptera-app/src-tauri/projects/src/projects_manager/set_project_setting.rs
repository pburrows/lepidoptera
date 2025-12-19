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

