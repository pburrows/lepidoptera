use db::repository_base::Entity;
use rusqlite::{Row, ToSql};
use serde::{Deserialize, Serialize};
use db::to_sql_vec;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Attachment {
    pub id: Option<String>,
    pub project_id: String,
    pub created_at: String,
    pub created_by: String,
    pub updated_at: Option<String>,
    pub updated_by: Option<String>,
    pub deleted_at: Option<String>,
    pub deleted_by: Option<String>,
    pub file_name: String,
    pub file_type: String,
    pub file_size: u64,
    pub file_content: Vec<u8>,
}

impl Entity for Attachment {
    fn table_name() -> &'static str {
        "attachments"
    }

    fn columns() -> &'static [&'static str] {
        &[
            "project_id",
            "created_at",
            "created_by",
            "updated_at",
            "updated_by",
            "deleted_at",
            "deleted_by",
            "file_name",
            "file_type",
            "file_size",
            "file_content",
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
            deleted_at: row.get(6)?,
            deleted_by: row.get(7)?,
            file_name: row.get(8)?,
            file_type: row.get(9)?,
            file_size: row.get(10)?,
            file_content: row.get(11)?,
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
            self.project_id.clone(),
            self.created_at.clone(),
            self.created_by.clone(),
            self.file_name.clone(),
            self.file_type.clone(),
            self.file_size,
            self.file_content.clone(),
        ]
    }

    fn update_values(&self) -> Vec<Box<dyn ToSql>> {
        to_sql_vec![
            self.project_id.clone(),
            self.updated_at.clone(),
            self.updated_by.clone(),
            self.deleted_at.clone(),
            self.deleted_by.clone(),
            self.file_name.clone(),
            self.file_type.clone(),
            self.file_size,
            self.file_content.clone(),
        ]
    }
}
