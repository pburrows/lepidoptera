use crate::entities::Project;
use crate::projects_sqlite_repository::ProjectsRepository;
use anyhow::Result;
use std::sync::Arc;

pub fn get_all_projects(
    repository: &Arc<dyn ProjectsRepository>,
) -> Result<Vec<Project>> {
    repository.find_all()
}
