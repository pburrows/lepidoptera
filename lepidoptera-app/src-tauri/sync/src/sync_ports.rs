use anyhow::Result;
use crate::entities::LocalMachine;

pub trait SyncManager: Send + Sync {
    fn get_local_machine(&self) -> Result<LocalMachine>;
}

