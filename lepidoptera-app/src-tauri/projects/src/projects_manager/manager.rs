use std::sync::Arc;
use db::connection_pool::ConnectionPool;
use crate::project_ports::ProjectsManager;
use crate::projects_manager::{create_project, get_all_projects, get_project_by_id, get_project_setting, set_project_setting};
use crate::projects_sqlite_repository::{ProjectsRepository, ProjectsSqliteRepository};
use crate::project_settings_sqlite_repository::{ProjectSettingsRepository, ProjectSettingsSqliteRepository};
use serde_json::Value;

pub struct SqliteProjectsManager {
    repository: Arc<dyn ProjectsRepository>,
    settings_repository: Arc<dyn ProjectSettingsRepository>,
}

impl SqliteProjectsManager {

    pub fn new(pool: Arc<ConnectionPool>) -> Self {
        let repository: Arc<dyn ProjectsRepository> =
            Arc::new(ProjectsSqliteRepository::new(pool.clone()));
        let settings_repository: Arc<dyn ProjectSettingsRepository> =
            Arc::new(ProjectSettingsSqliteRepository::new(pool));
        Self { 
            repository,
            settings_repository,
        }
    }
}

impl ProjectsManager for SqliteProjectsManager {
    fn get_project_by_id(&self, id: String) -> anyhow::Result<Option<crate::entities::Project>> {
        get_project_by_id::get_project_by_id(&self.repository, id)
    }

    fn get_projects(&self) -> anyhow::Result<Vec<crate::entities::Project>> {
        get_all_projects::get_all_projects(&self.repository, &self.settings_repository)
    }

    fn create_project(&self, project: crate::entities::Project) -> anyhow::Result<crate::entities::Project> {
        create_project::create_project(&self.repository, project)
    }

    fn get_project_setting(&self, project_id: String, setting_key: String) -> anyhow::Result<Option<Value>> {
        get_project_setting::get_project_setting(&self.settings_repository, project_id, setting_key)
    }

    fn set_project_setting(&self, project_id: String, setting_key: String, setting_value: Value, updated_by: String) -> anyhow::Result<Value> {
        set_project_setting::set_project_setting(&self.settings_repository, project_id, setting_key, setting_value, updated_by)
    }
}