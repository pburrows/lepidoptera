use crate::entities::Project;
use anyhow::Result;
use serde_json::Value;

pub trait ProjectsManager: Send + Sync {
    fn get_project_by_id(&self, id: String) -> Result<Option<Project>>;
    fn get_projects(&self) -> Result<Vec<Project>>;
    fn create_project(&self, project: Project) -> Result<Project>;
    fn update_project(&self, project: Project) -> Result<Project>;
    fn get_project_setting(&self, project_id: String, setting_key: String) -> Result<Option<Value>>;
    fn set_project_setting(&self, project_id: String, setting_key: String, setting_value: Value, updated_by: String) -> Result<Value>;
}