use std::sync::Arc;
use crate::project_settings_sqlite_repository::ProjectSettingsRepository;
use anyhow::Result;
use serde_json::Value;

pub fn get_project_setting(
    repository: &Arc<dyn ProjectSettingsRepository>,
    project_id: String,
    setting_key: String,
) -> Result<Option<Value>> {
    let setting = repository.find_by_project_and_key(&project_id, &setting_key)?;
    Ok(setting.map(|s| s.setting_value))
}

