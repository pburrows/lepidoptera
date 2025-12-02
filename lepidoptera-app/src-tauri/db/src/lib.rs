use rusqlite::Connection;
use anyhow::Result;

pub trait DatabaseConnection: Send + Sync {
    fn get_connection(&self) -> Result<Connection>;
}