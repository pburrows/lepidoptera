use std::sync::{Arc, Mutex};
use db::Connection;
use db::repository_base::{Entity, GenericRepository};
use crate::entities::Project;
use anyhow::Result;

pub trait ProjectsRepository: Send + Sync {
    fn find_by_id(&self, id: &str) -> Result<Option<Project>>;
    fn find_all(&self) -> Result<Vec<Project>>;
    fn create(&self, project: Project) -> Result<Project>;
}

pub struct ProjectsSqliteRepository {
    inner: GenericRepository<Project>,
}

impl ProjectsSqliteRepository {
    pub fn new(connection: Arc<Mutex<Connection>>) -> Self {
        Self {
            inner: GenericRepository::new(connection),
        }
    }
}

impl ProjectsRepository for ProjectsSqliteRepository {
    fn find_by_id(&self, id: &str) -> Result<Option<Project>> {
        self.inner.find_by_id(id)
    }

    fn find_all(&self) -> Result<Vec<Project>> {
        let results = self.inner.connection()?.query(
            &format!("SELECT * FROM {} WHERE is_active = 1", Project::table_name()),
            &[],
            |row| Project::from_row(row),
        )?;
        Ok(results)
    }

    fn create(&self, project: Project) -> Result<Project> {
       self.inner.create(project)
    }
}