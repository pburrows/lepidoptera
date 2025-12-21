use crate::Connection;
use crate::connection_pool::{ConnectionPool, PooledConnection};
use anyhow::Result;
use rusqlite::{Row, ToSql};
use std::sync::Arc;
use log::{debug, error};

#[macro_export]
macro_rules! to_sql_vec {
    ($($val:expr),* $(,)?) => {
        vec![$(Box::new($val) as Box<dyn ToSql>),*]
    };
}

pub trait Entity: Send + Sync + Clone {
    fn table_name() -> &'static str;
    fn primary_key() -> &'static str {
        "id"
    }
    fn columns() -> &'static [&'static str];
    fn from_row(row: &Row) -> rusqlite::Result<Self>;
    fn id(&self) -> Option<String>;
    fn set_id(&mut self, id: String);
    fn insert_values(&self) -> Vec<Box<dyn ToSql>>;
    fn update_values(&self) -> Vec<Box<dyn ToSql>>;
}

pub struct GenericRepository<E: Entity> {
    pool: Arc<ConnectionPool>,
    _phantom: std::marker::PhantomData<E>,
}

impl<E: Entity> GenericRepository<E> {
    pub fn new(pool: Arc<ConnectionPool>) -> Self {
        Self {
            pool,
            _phantom: std::marker::PhantomData,
        }
    }

    pub fn with_connection<F, T>(&self, f: F) -> Result<T>
    where
        F: FnOnce(&mut Connection) -> Result<T>,
    {
        let mut pooled_conn = self.pool.get()?;
        f(pooled_conn.get_mut())
    }

    pub fn connection(&self) -> Result<PooledConnection> {
        self.pool.get()
    }

    pub fn find_by_id(&self, id: &str, conn: Option<&mut Connection>) -> Result<Option<E>> {
        let sql = format!(
            "SELECT * FROM {} WHERE {} = ?1",
            E::table_name(),
            E::primary_key()
        );

        debug!("[DB] find_by_id: table={}, id={}", E::table_name(), id);
        let start = std::time::Instant::now();

        let result = {
            let results = if let Some(conn_ref) = conn {
                // Use provided connection
                conn_ref.query(
                    &sql,
                    &[&id],
                    |row| E::from_row(row),
                )
            } else {
                // Get connection from pool if no connection provided
                let pooled_conn = self.pool.get().map_err(|e| {
                    error!("[DB] Failed to get connection from pool: {}", e);
                    e
                })?;
                pooled_conn.get().query(
                    &sql,
                    &[&id],
                    |row| E::from_row(row),
                )
            };

            match results {
                Ok(mut rows) => {
                    let entity = rows.pop();
                    let duration = start.elapsed();
                    if entity.is_some() {
                        debug!("[DB] find_by_id: found entity in {:?}", duration);
                    } else {
                        debug!("[DB] find_by_id: entity not found in {:?}", duration);
                    }
                    Ok(entity)
                }
                Err(e) => {
                    let duration = start.elapsed();
                    error!("[DB] find_by_id failed after {:?}: {}", duration, e);
                    Err(anyhow::anyhow!("Database query error: {}", e))
                }
            }
        };

        result
    }

    pub fn create(&self, entity: E, conn: Option<&mut Connection>) -> Result<E> {
        let columns = E::columns();
        let placeholders: Vec<String> = (1..=columns.len()).map(|i| format!("?{}", i)).collect();

        let sql = format!(
            "INSERT INTO {} ({}) VALUES ({})",
            E::table_name(),
            columns.join(","),
            placeholders.join(",")
        );

        let entity_id = entity.id().unwrap_or_else(|| "new".to_string());
        debug!("[DB] create: table={}, id={}", E::table_name(), entity_id);
        let start = std::time::Instant::now();

        let values = entity.insert_values();
        
        let result = if let Some(conn_ref) = conn {
            // Use provided connection
            conn_ref.execute(
                &sql,
                rusqlite::params_from_iter(values.iter().map(|v| v.as_ref())),
            )
        } else {
            // Get connection from pool if no connection provided
            let mut pooled_conn = self.pool.get().map_err(|e| {
                error!("[DB] Failed to get connection from pool: {}", e);
                e
            })?;
            pooled_conn.get_mut().execute(
                &sql,
                rusqlite::params_from_iter(values.iter().map(|v| v.as_ref())),
            )
        };

        match result {
            Ok(rows_affected) => {
                let duration = start.elapsed();
                debug!("[DB] create: inserted {} row(s) in {:?}", rows_affected, duration);
                Ok(entity)
            }
            Err(e) => {
                let duration = start.elapsed();
                error!("[DB] create failed after {:?}: {}", duration, e);
                Err(anyhow::anyhow!("Failed to create entity: {}", e))
            }
        }
    }

    pub fn update(&self, entity: &E, conn: Option<&mut Connection>) -> Result<usize> {
        let id = entity
            .id()
            .ok_or_else(|| {
                let err = anyhow::anyhow!("Entity must have an ID to update");
                error!("[DB] update: {}", err);
                err
            })?;

        let columns = E::columns();
        let set_clauses: Vec<String> = columns
            .iter()
            .enumerate()
            .map(|(c, col)| format!("{} = ?{}", col, c + 1))
            .collect();

        let sql = format!(
            "UPDATE {} SET {} WHERE {} = ?{}",
            E::table_name(),
            set_clauses.join(", "),
            E::primary_key(),
            columns.len() + 1
        );

        debug!("[DB] update: table={}, id={}", E::table_name(), id);
        let start = std::time::Instant::now();

        let mut values = entity.update_values();
        values.push(Box::new(id.clone()));

        let result = if let Some(conn_ref) = conn {
            // Use provided connection
            conn_ref.execute(
                &sql,
                rusqlite::params_from_iter(values.iter().map(|v| v.as_ref())),
            )
        } else {
            // Get connection from pool if no connection provided
            let mut pooled_conn = self.pool.get().map_err(|e| {
                error!("[DB] Failed to get connection from pool: {}", e);
                e
            })?;
            pooled_conn.get_mut().execute(
                &sql,
                rusqlite::params_from_iter(values.iter().map(|v| v.as_ref())),
            )
        };

        match result {
            Ok(rows_affected) => {
                let duration = start.elapsed();
                debug!("[DB] update: updated {} row(s) in {:?}", rows_affected, duration);
                Ok(rows_affected)
            }
            Err(e) => {
                let duration = start.elapsed();
                error!("[DB] update failed after {:?}: {}", duration, e);
                Err(anyhow::anyhow!("Failed to update entity: {}", e))
            }
        }
    }
    pub fn delete(&self, id: &str, conn: Option<&mut Connection>) -> Result<usize> {
        let sql = format!(
            "DELETE FROM {} WHERE {} = ?1",
            E::table_name(),
            E::primary_key()
        );

        debug!("[DB] delete: table={}, id={}", E::table_name(), id);
        let start = std::time::Instant::now();

        let params = vec![Box::new(id.to_string()) as Box<dyn ToSql>];

        let result = if let Some(conn_ref) = conn {
            // Use provided connection
            conn_ref.execute(
                &sql,
                rusqlite::params_from_iter(params.iter().map(|v| v.as_ref())),
            )
        } else {
            // Get connection from pool if no connection provided
            let mut pooled_conn = self.pool.get().map_err(|e| {
                error!("[DB] Failed to get connection from pool: {}", e);
                e
            })?;
            pooled_conn.get_mut().execute(
                &sql,
                rusqlite::params_from_iter(params.iter().map(|v| v.as_ref())),
            )
        };

        match result {
            Ok(rows_affected) => {
                let duration = start.elapsed();
                debug!("[DB] delete: deleted {} row(s) in {:?}", rows_affected, duration);
                Ok(rows_affected)
            }
            Err(e) => {
                let duration = start.elapsed();
                error!("[DB] delete failed after {:?}: {}", duration, e);
                Err(anyhow::anyhow!("Failed to delete entity: {}", e))
            }
        }
    }
}
