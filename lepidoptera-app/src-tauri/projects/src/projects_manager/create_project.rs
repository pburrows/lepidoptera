use std::sync::Arc;
use crate::entities::Project;
use crate::projects_sqlite_repository::ProjectsRepository;

pub fn create_project(repository: &Arc<dyn ProjectsRepository>, project: Project) -> anyhow::Result<Project> {
    repository.create(project)
}
