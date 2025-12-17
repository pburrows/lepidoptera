use crate::entities::Project;
use crate::projects_sqlite_repository::ProjectsRepository;
use anyhow::Result;
use std::sync::Arc;
use chrono::Utc;
use ulid::Ulid;

pub fn get_all_projects(repository: &Arc<dyn ProjectsRepository>) -> Result<Vec<Project>> {
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
        
        repository.create(default_project)?;
        
        // Re-query the database to get all projects including the newly created one
        return repository.find_all();
    }
    
    Ok(projects)
}
