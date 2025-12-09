use std::sync::Arc;
use crate::entities::Project;
use crate::projects_sqlite_repository::ProjectsRepository;
use anyhow::Result;

pub fn get_project_by_id(repository: &Arc<dyn ProjectsRepository>, id: String) -> Result<Option<Project>> {
    repository.find_by_id(id.as_str())
}
