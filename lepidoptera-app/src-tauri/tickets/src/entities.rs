use rusqlite::{Row, ToSql};
use serde::{Deserialize, Serialize};
use db::repository_base::Entity;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Ticket {
    pub id: Option<i64>,
    pub title: String,
    pub description: Option<String>,
}

impl Entity for Ticket {
    fn table_name() -> &'static str {
        "tickets"
    }

    fn columns() -> &'static [&'static str] {
        &["title", "description"]
    }

    fn from_row(row: &Row) -> rusqlite::Result<Self> {
        Ok(Self {
            id: row.get(0)?,
            title: row.get(1)?,
            description: row.get(2)?,
        })
    }

    fn id(&self) -> Option<i64> {
        self.id
    }

    fn set_id(&mut self, id: i64) {
        self.id = Some(id);
    }

    fn insert_values(&self) -> Vec<&dyn ToSql> {
        vec![&self.title as &dyn ToSql, &self.description]
    }

    fn update_values(&self) -> Vec<&dyn ToSql> {
        vec![&self.title as &dyn ToSql, &self.description]
    }
}