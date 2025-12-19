use std::sync::{Arc, Mutex};
use db::Connection;
use db::repository_base::{Entity, GenericRepository};
use crate::entities::LocalMachine;
use anyhow::Result;

pub trait LocalMachineRepository: Send + Sync {
    fn find_first(&self) -> Result<Option<LocalMachine>>;
    fn create(&self, local_machine: LocalMachine) -> Result<LocalMachine>;
}

pub struct LocalMachineSqliteRepository {
    inner: GenericRepository<LocalMachine>,
}

impl LocalMachineSqliteRepository {
    pub fn new(connection: Arc<Mutex<Connection>>) -> Self {
        Self {
            inner: GenericRepository::new(connection),
        }
    }
}

impl LocalMachineRepository for LocalMachineSqliteRepository {
    fn find_first(&self) -> Result<Option<LocalMachine>> {
        let results = self.inner.connection()?.query(
            &format!("SELECT * FROM {} LIMIT 1", LocalMachine::table_name()),
            &[],
            |row| LocalMachine::from_row(row),
        )?;
        Ok(results.into_iter().next())
    }

    fn create(&self, local_machine: LocalMachine) -> Result<LocalMachine> {
        self.inner.create(local_machine)
    }
}

