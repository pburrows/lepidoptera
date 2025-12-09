use crate::entities::Project;
use anyhow::Result;

pub trait ProjectsManager: Send + Sync {
    fn get_project_by_id(&self, id: String) -> Result<Option<Project>>;
    fn get_projects(&self) -> Result<Vec<Project>>;
    fn create_project(&self, project: Project) -> Result<Project>;
}