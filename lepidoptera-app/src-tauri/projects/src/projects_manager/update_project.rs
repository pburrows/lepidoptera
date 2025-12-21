use std::sync::Arc;
use chrono::Utc;
use crate::entities::Project;
use crate::projects_sqlite_repository::ProjectsRepository;
use anyhow::Result;

pub fn update_project(repository: &Arc<dyn ProjectsRepository>, mut project: Project) -> Result<Project> {
    // Set updated_at timestamp
    project.updated_at = Some(Utc::now().to_rfc3339());
    
    repository.update(project)
}

