pub mod repository_base;
pub mod repository;

use anyhow::Result;

pub struct Connection {
    inner: rusqlite::Connection,
}

impl Connection {
    pub fn new(path: &str) -> Result<Self> {
        Ok(Self {
            inner: rusqlite::Connection::open(path)?
        })
    }

    pub fn execute(&self, sql: &str, params: &[&dyn ToSql]) -> Result<usize> {
        self.inner.execute(sql, params)
            .map_err(|e| anyhow::anyhow!("Execute error, {}", e))
    }

    pub fn query<T,F>(&self, sql: &str, params: &[&dyn ToSql], mapper: F) -> Result<Vec<T>>
    where F: FnMut(&rusqlite::Row) -> rusqlite::Result<T>
    {
        let mut stmt = self.inner.prepare(sql)
            .map_err(|e| anyhow::anyhow!("Prepare error, {}", e))?;
        let rows = stmt.query_map(params, mapper)
            .map_err(|e| anyhow::anyhow!("Statement error, {}", e))?;
        rows.collect::<rusqlite::Result<Vec<T>>>()
            .map_err(|e| anyhow::anyhow!("Query error, {}", e))
    }
}

pub use rusqlite::params;
pub use rusqlite::ToSql;
