use crate::Connection;
use anyhow::Result;
use rusqlite::{Row, ToSql};
use std::sync::{Arc, Mutex, MutexGuard};

pub trait Entity: Send + Sync + Clone {
    fn table_name() -> &'static str;
    fn primary_key() -> &'static str {
        "id"
    }
    fn columns() -> &'static [&'static str];
    fn from_row(row: &Row) -> rusqlite::Result<Self>;
    fn id(&self) -> Option<String>;
    fn set_id(&mut self, id: String);
    fn insert_values(&self) -> Vec<&dyn ToSql>;
    fn update_values(&self) -> Vec<&dyn ToSql>;
}

pub struct GenericRepository<E: Entity> {
    connection: Arc<Mutex<Connection>>,
    _phantom: std::marker::PhantomData<E>,
}

impl<E: Entity> GenericRepository<E> {
    pub fn new(connection: Arc<Mutex<Connection>>) -> Self {
        Self {
            connection,
            _phantom: std::marker::PhantomData,
        }
    }

    pub fn with_connection<F, T>(&self, f: F) -> Result<T>
    where
        F: FnOnce(&mut Connection) -> Result<T>,
    {
        let mut conn = self
            .connection
            .lock()
            .map_err(|e| anyhow::anyhow!("Failed to lock connection, {}", e))?;
        f(&mut conn)
    }

    pub fn connection(&self) -> Result<MutexGuard<'_, Connection>> {
        self.connection
            .lock()
            .map_err(|e| anyhow::anyhow!("Failed to lock connection, {}", e))
    }

    pub fn find_by_id(&self, id: &str) -> Result<Option<E>> {
        let conn = self
            .connection
            .lock()
            .map_err(|e| anyhow::anyhow!("Failed to lock connection, {}", e))?;

        let mut results = conn.query(
            &format!(
                "SELECT * FROM {} WHERE {} = ?1",
                E::table_name(),
                E::primary_key()
            ),
            &[&id],
            |row| E::from_row(row),
        )?;
        Ok(results.pop())
    }

    pub fn create(&self, mut entity: E) -> Result<(E)> {
        let conn = self
            .connection
            .lock()
            .map_err(|e| anyhow::anyhow!("Failed to lock connection, {}", e))?;

        let columns = E::columns();
        let placeholders: Vec<String> = (1..=columns.len()).map(|i| format!("?{}", i)).collect();

        let sql = format!(
            "INSERT INTO {} ({}) VALUES ({})",
            E::table_name(),
            columns.join(","),
            placeholders.join(",")
        );

        let values = entity.insert_values();
        conn.execute(&sql, &values.iter().map(|v| *v).collect::<Vec<_>>())
            .map_err(|e| anyhow::anyhow!("Failed to create entity: {}", e))?;

        // let id = conn
        //     .query("SELECT last_insert_rowid()", &[], |row| row.get(0))?
        //     .pop()
        //     .ok_or_else(|| anyhow::anyhow!("Failed to get last inserted id"))?;
        //
        // entity.set_id(id);

        Ok((entity))
    }

    pub fn update(&self, entity: &E) -> Result<usize> {
        let id = entity
            .id()
            .ok_or_else(|| anyhow::anyhow!("Entity must have an ID to update"))?;

        let conn = self
            .connection
            .lock()
            .map_err(|e| anyhow::anyhow!("Failed to lock connection, {}", e))?;

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

        let mut values = entity.update_values();
        values.push(&id);

        conn.execute(&sql, &values.iter().map(|v| *v).collect::<Vec<_>>())
            .map_err(|e| anyhow::anyhow!("Failed to update entity: {}", e))
    }
    pub fn delete(&self, id: &str) -> Result<usize> {
        let conn = self
            .connection
            .lock()
            .map_err(|e| anyhow::anyhow!("Failed to lock connection: {}", e))?;

        conn.execute(
            &format!(
                "DELETE FROM {} WHERE {} = ?1",
                E::table_name(),
                E::primary_key()
            ),
            &[&id],
        )
        .map_err(|e| anyhow::anyhow!("Failed to delete entity: {}", e))
    }
}
