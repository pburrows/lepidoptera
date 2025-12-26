use rusqlite::{Row, ToSql};
use serde::{Deserialize, Serialize};
use db::repository_base::Entity;
use db::to_sql_vec;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Person {
    pub id: Option<String>,
    pub created_at: String,
    pub updated_at: Option<String>,
    pub display_name: String,
    pub is_active: bool,
    // todo: add created_by and updated_by
    // todo: add avatar attachment_id
}

impl Entity for Person {
    fn table_name() -> &'static str {
        "persons"
    }

    fn columns() -> &'static [&'static str] {
        &["id", "created_at", "updated_at", "display_name", "is_active"]
    }

    fn from_row(row: &Row) -> rusqlite::Result<Self> {
        Ok(Self {
            id: row.get(0)?,
            created_at: row.get(1)?,
            updated_at: row.get(2)?,
            display_name: row.get(3)?,
            is_active: row.get(4)?,
        })
    }

    fn id(&self) -> Option<String> {
        self.id.clone()
    }

    fn set_id(&mut self, id: String) {
        self.id = Some(id);
    }

    fn insert_values(&self) -> Vec<Box<dyn ToSql>> {
        to_sql_vec![
            self.id.clone().unwrap_or_default(),
            self.created_at.clone(),
            self.updated_at.clone(),
            self.display_name.clone(),
            self.is_active,
        ]
    }

    fn update_values(&self) -> Vec<Box<dyn ToSql>> {
        to_sql_vec![
            self.id.clone().unwrap_or_default(), // id (won't actually be updated, but required for SQL generation)
            self.created_at.clone(), // created_at (won't actually be updated, but required for SQL generation)
            self.updated_at.clone(),
            self.display_name.clone(),
            self.is_active,
        ]
    }

}
