use db::repository_base::Entity;
use rusqlite::{Row, ToSql};
use serde::{Deserialize, Serialize};
use db::to_sql_vec;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Document {
    pub id: Option<String>,
    pub project_id: String,
    pub created_at: String,
    pub created_by: String,
    pub updated_at: Option<String>,
    pub updated_by: Option<String>,
    pub parent_id: Option<String>,
    pub slug: String,
    pub is_active: bool,
}

impl Entity for Document {
    fn table_name() -> &'static str {
        "documents"
    }

    fn columns() -> &'static [&'static str] {
        &[
            "project_id",
            "created_at",
            "created_by",
            "updated_at",
            "updated_by",
            "parent_id",
            "slug",
            "is_active",
        ]
    }

    fn from_row(row: &Row) -> rusqlite::Result<Self> {
        Ok(Self {
            id: row.get(0)?,
            project_id: row.get(1)?,
            created_at: row.get(2)?,
            created_by: row.get(3)?,
            updated_at: row.get(4)?,
            updated_by: row.get(5)?,
            parent_id: row.get(6)?,
            slug: row.get(7)?,
            is_active: row.get(8)?,
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
            (self.project_id.clone()),
            (self.created_at.clone()),
            (self.created_by.clone()),
            (self.slug.clone()),
            (self.is_active),
        ]
    }

    fn update_values(&self) -> Vec<Box<dyn ToSql>> {
        to_sql_vec![
            (self.project_id.clone()),
            (self.updated_at.clone()),
            (self.updated_by.clone()),
            (self.slug.clone()),
            (self.is_active),
        ]
    }

}
