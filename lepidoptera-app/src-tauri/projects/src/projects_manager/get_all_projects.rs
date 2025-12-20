use crate::entities::Project;
use crate::projects_sqlite_repository::ProjectsRepository;
use crate::project_settings_sqlite_repository::ProjectSettingsRepository;
use crate::projects_manager::set_project_setting;
use anyhow::Result;
use std::sync::Arc;
use chrono::Utc;
use ulid::Ulid;
use serde_json::Value;

pub fn get_all_projects(
    repository: &Arc<dyn ProjectsRepository>,
    settings_repository: &Arc<dyn ProjectSettingsRepository>,
) -> Result<Vec<Project>> {
    let projects = repository.find_all()?;
    
    if projects.is_empty() {
        let default_project = Project {
            id: Some(Ulid::new().to_string()),
            created_at: Utc::now().to_rfc3339(),
            updated_at: None,
            name: "Main".to_string(),
            description: Some("Default Lepidoptera project.".to_string()),
            is_active: true,
        };
        
        let created_project = repository.create(default_project)?;
        let project_id = created_project.id.ok_or_else(|| anyhow::anyhow!("Created project should have an ID"))?;
        
        // Set the default SEQUENCE_PREFIX setting to "MAIN"
        set_project_setting::set_project_setting(
            settings_repository,
            project_id,
            "SEQUENCE_PREFIX".to_string(),
            Value::String("M".to_string()),
            "system".to_string(),
        )?;
        
        // Re-query the database to get all projects including the newly created one
        return repository.find_all();
    }
    
    Ok(projects)
}
