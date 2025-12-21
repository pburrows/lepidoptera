use std::sync::Arc;
use db::connection_pool::ConnectionPool;
use db::repository_base::{Entity, GenericRepository};
use crate::entities::LocalMachine;
use anyhow::Result;

pub trait LocalMachineRepository: Send + Sync {
    fn find_first(&self) -> Result<Option<LocalMachine>>;
    fn create(&self, local_machine: LocalMachine) -> Result<LocalMachine>;
}

pub struct LocalMachineSqliteRepository {
    inner: GenericRepository<LocalMachine>,
    pool: Arc<ConnectionPool>,
}

impl LocalMachineSqliteRepository {
   pub fn new(pool: Arc<ConnectionPool>) -> Self {
        Self {
            inner: GenericRepository::new(pool.clone()),
            pool,
        }
    }
}

impl LocalMachineRepository for LocalMachineSqliteRepository {
    fn find_first(&self) -> Result<Option<LocalMachine>> {
        let pooled_conn = self.pool.get()?;
        let conn = pooled_conn.get();
        let results = conn.query(
            &format!("SELECT * FROM {} LIMIT 1", LocalMachine::table_name()),
            &[],
            |row| LocalMachine::from_row(row),
        )?;
        Ok(results.into_iter().next())
    }

    fn create(&self, local_machine: LocalMachine) -> Result<LocalMachine> {
        self.inner.create(local_machine, None)
    }
}

