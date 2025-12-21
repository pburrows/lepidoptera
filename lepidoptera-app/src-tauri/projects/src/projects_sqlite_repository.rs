use std::sync::Arc;
use db::connection_pool::ConnectionPool;
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
    pool: Arc<ConnectionPool>
}

impl ProjectsSqliteRepository {
    pub fn new(pool: Arc<ConnectionPool>) -> Self {
        Self {
            inner: GenericRepository::new(pool.clone()),
            pool,
        }
    }
}

impl ProjectsRepository for ProjectsSqliteRepository {
    fn find_by_id(&self, id: &str) -> Result<Option<Project>> {
        self.inner.find_by_id(id, None)
    }

    fn find_all(&self) -> Result<Vec<Project>> {
        let pooled_conn = self.pool.get()?;
        let conn = pooled_conn.get();
        let results = conn.query(
            &format!("SELECT * FROM {} WHERE is_active = 1", Project::table_name()),
            &[],
            |row| Project::from_row(row),
        )?;
        Ok(results)
    }

    fn create(&self, project: Project) -> Result<Project> {
       self.inner.create(project, None)
    }
}