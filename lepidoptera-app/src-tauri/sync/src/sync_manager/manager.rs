use std::sync::Arc;
use db::connection_pool::ConnectionPool;
use crate::sync_ports::SyncManager;
use crate::sync_manager::get_local_machine;
use crate::local_machine_sqlite_repository::{LocalMachineRepository, LocalMachineSqliteRepository};

pub struct SqliteSyncManager {
    repository: Arc<dyn LocalMachineRepository>,
}

impl SqliteSyncManager {
    pub fn new(pool: Arc<ConnectionPool>) -> Self {
        let repository: Arc<dyn LocalMachineRepository> =
            Arc::new(LocalMachineSqliteRepository::new(pool));
        Self {
            repository,
        }
    }
}

impl SyncManager for SqliteSyncManager {
    fn get_local_machine(&self) -> anyhow::Result<crate::entities::LocalMachine> {
        get_local_machine::get_local_machine(&self.repository)
    }
}

