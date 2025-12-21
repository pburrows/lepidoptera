mod migrations;
pub mod repository_base;
pub mod connection_pool;

// pub use to_sql_vec;

use anyhow::Result;
use std::iter::Map;
use std::slice::Iter;

pub struct Connection {
    inner: rusqlite::Connection,
}

impl Connection {
    pub fn new(path: &str) -> Result<Self> {
        let mut conn = rusqlite::Connection::open(path)?;
        
        // Enable WAL mode for better concurrency
        conn.pragma_update(None, "journal_mode", "WAL")
            .map_err(|e| anyhow::anyhow!("Failed to enable WAL mode: {}", e))?;
        
        // Set busy timeout to 5 seconds (5000ms) - SQLite will wait instead of failing immediately
        conn.busy_timeout(std::time::Duration::from_millis(5000))
            .map_err(|e| anyhow::anyhow!("Failed to set busy timeout: {}", e))?;
        
        // Enable foreign keys
        conn.pragma_update(None, "foreign_keys", "ON")
            .map_err(|e| anyhow::anyhow!("Failed to enable foreign keys: {}", e))?;
        
        println!("Connected to database: {} (WAL mode enabled)", path);
        migrations::run_migrations(&mut conn)?;
        Ok(Self { inner: conn })
    }
    
    /// Begin a transaction - use inner connection directly
    pub fn inner(&mut self) -> &mut rusqlite::Connection {
        &mut self.inner
    }

    pub fn execute(
        &self,
        sql: &str,
        params: ParamsFromIter<Map<Iter<Box<dyn ToSql>>, fn(&Box<dyn ToSql>) -> &dyn ToSql>>,
    ) -> Result<usize> {
        self.inner
            .execute(sql, params)
            .map_err(|e| anyhow::anyhow!("Execute error, {}", e))
    }

    pub fn query<T, F>(&self, sql: &str, params: &[&dyn ToSql], mapper: F) -> Result<Vec<T>>
    where
        F: FnMut(&rusqlite::Row) -> rusqlite::Result<T>,
    {
        let mut stmt = self
            .inner
            .prepare(sql)
            .map_err(|e| anyhow::anyhow!("Prepare error, {}", e))?;
        let rows = stmt
            .query_map(params, mapper)
            .map_err(|e| anyhow::anyhow!("Statement error, {}", e))?;
        rows.collect::<rusqlite::Result<Vec<T>>>()
            .map_err(|e| anyhow::anyhow!("Query error, {}", e))
    }
}

pub use rusqlite::params;
use rusqlite::ParamsFromIter;
pub use rusqlite::ToSql;
