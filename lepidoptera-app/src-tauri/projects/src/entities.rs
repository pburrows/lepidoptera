use rusqlite::{Row, ToSql};
use serde::{Deserialize, Serialize};
use db::repository_base::Entity;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Project {

    pub id: Option<String>,
    pub created_at: String,
    pub updated_at: Option<String>,
    pub name: String,
    pub description: Option<String>,
    pub is_active: bool,
}

impl Entity for Project {
    fn table_name() -> &'static str {
        "projects"
    }

    fn columns() -> &'static [&'static str] {
        &["created_at", "updated_at", "name", "description", "is_active"]
    }

    fn from_row(row: &Row) -> rusqlite::Result<Self> {
        Ok(Self {
            id: row.get(0)?,
            created_at: row.get(1)?,
            updated_at: row.get(2)?,
            name: row.get(3)?,
            description: row.get(4)?,
            is_active: row.get(5)?,
        })
    }

    fn id(&self) -> Option<String> {
        self.id.clone()
    }

    fn set_id(&mut self, id: String) {
        self.id = Some(id);
    }

    fn insert_values(&self) -> Vec<&dyn ToSql> {
        vec![&self.name, &self.description, &self.is_active, &self.created_at]
    }

    fn update_values(&self) -> Vec<&dyn ToSql> {
        vec![&self.name, &self.description, &self.is_active, &self.updated_at]
    }
}