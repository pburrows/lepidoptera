use std::sync::{Arc, Mutex};
use db::Connection;
use crate::entities::Project;
use crate::project_ports::ProjectsManager;
use crate::projects_manager::{create_project, get_all_projects, get_project_by_id};
use crate::projects_sqlite_repository::{ProjectsRepository, ProjectsSqliteRepository};

pub struct SqliteProjectsManager {
    repository: Arc<dyn ProjectsRepository>,
}

impl SqliteProjectsManager {

    pub fn new(connection: Arc<Mutex<Connection>>) -> Self {
        let repository: Arc<dyn ProjectsRepository> =
            Arc::new(ProjectsSqliteRepository::new(connection));
        Self { repository }
    }
}

impl ProjectsManager for SqliteProjectsManager {
    fn get_project_by_id(&self, id: String) -> anyhow::Result<Option<Project>> {
        get_project_by_id::get_project_by_id(&self.repository, id)
    }

    fn get_projects(&self) -> anyhow::Result<Vec<Project>> {
        get_all_projects::get_all_projects(&self.repository)
    }

    fn create_project(&self, project: Project) -> anyhow::Result<Project> {
        create_project::create_project(&self.repository, project)
    }
}