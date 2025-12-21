mod migrations;
pub mod repository_base;
pub mod connection_pool;

// pub use to_sql_vec;

use anyhow::Result;
use std::iter::Map;
use std::slice::Iter;
use log::{debug, error, info};

pub struct Connection {
    inner: rusqlite::Connection,
}

impl Connection {
    pub fn new(path: &str) -> Result<Self> {
        debug!("[DB] Opening database connection: {}", path);
        let start = std::time::Instant::now();
        
        let mut conn = rusqlite::Connection::open(path)
            .map_err(|e| {
                error!("[DB] Failed to open database at {}: {}", path, e);
                e
            })?;
        
        // Enable WAL mode for better concurrency
        conn.pragma_update(None, "journal_mode", "WAL")
            .map_err(|e| {
                error!("[DB] Failed to enable WAL mode: {}", e);
                anyhow::anyhow!("Failed to enable WAL mode: {}", e)
            })?;
        
        // Set busy timeout to 5 seconds (5000ms) - SQLite will wait instead of failing immediately
        conn.busy_timeout(std::time::Duration::from_millis(5000))
            .map_err(|e| {
                error!("[DB] Failed to set busy timeout: {}", e);
                anyhow::anyhow!("Failed to set busy timeout: {}", e)
            })?;
        
        // Enable foreign keys
        conn.pragma_update(None, "foreign_keys", "ON")
            .map_err(|e| {
                error!("[DB] Failed to enable foreign keys: {}", e);
                anyhow::anyhow!("Failed to enable foreign keys: {}", e)
            })?;
        
        info!("[DB] Connected to database: {} (WAL mode enabled) in {:?}", path, start.elapsed());
        
        migrations::run_migrations(&mut conn)
            .map_err(|e| {
                error!("[DB] Failed to run migrations: {}", e);
                e
            })?;
        
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
        debug!("[DB] execute: {}", sql);
        let start = std::time::Instant::now();
        
        match self.inner.execute(sql, params) {
            Ok(rows_affected) => {
                let duration = start.elapsed();
                debug!("[DB] execute: affected {} rows in {:?}", rows_affected, duration);
                Ok(rows_affected)
            }
            Err(e) => {
                let duration = start.elapsed();
                error!("[DB] execute failed after {:?}: {} - SQL: {}", duration, e, sql);
                Err(anyhow::anyhow!("Execute error, {}", e))
            }
        }
    }

    pub fn query<T, F>(&self, sql: &str, params: &[&dyn ToSql], mapper: F) -> Result<Vec<T>>
    where
        F: FnMut(&rusqlite::Row) -> rusqlite::Result<T>,
    {
        debug!("[DB] query: {}", sql);
        let start = std::time::Instant::now();
        
        let mut stmt = self
            .inner
            .prepare(sql)
            .map_err(|e| {
                error!("[DB] Failed to prepare statement: {} - SQL: {}", e, sql);
                anyhow::anyhow!("Prepare error, {}", e)
            })?;
        
        let rows = stmt
            .query_map(params, mapper)
            .map_err(|e| {
                error!("[DB] Query map error: {} - SQL: {}", e, sql);
                anyhow::anyhow!("Statement error, {}", e)
            })?;
        
        match rows.collect::<rusqlite::Result<Vec<T>>>() {
            Ok(results) => {
                let duration = start.elapsed();
                debug!("[DB] query: returned {} rows in {:?}", results.len(), duration);
                Ok(results)
            }
            Err(e) => {
                let duration = start.elapsed();
                error!("[DB] query failed after {:?}: {} - SQL: {}", duration, e, sql);
                Err(anyhow::anyhow!("Query error, {}", e))
            }
        }
    }
}

pub use rusqlite::params;
use rusqlite::ParamsFromIter;
pub use rusqlite::ToSql;
