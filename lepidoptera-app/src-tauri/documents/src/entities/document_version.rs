use db::repository_base::Entity;
use rusqlite::{Row, ToSql};
use serde::{Deserialize, Serialize};
use db::to_sql_vec;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DocumentVersion {
    pub id: Option<String>,
    pub document_id: String,
    pub version: i32,
    pub created_at: String,
    pub created_by: String,
    pub title: String,
    pub body: Option<String>,
    pub summary: Option<String>,
    pub attachment_ids: Vec<String>,
    pub published_at: Option<String>,
    pub published_by: Option<String>,
}

impl Entity for DocumentVersion {
    fn table_name() -> &'static str {
        "document_versions"
    }

    fn columns() -> &'static [&'static str] {
        &[
            "document_id",
            "version",
            "created_at",
            "created_by",
            "title",
            "body",
            "summary",
            "attachment_ids",
            "published_at",
            "published_by",
        ]
    }

    fn from_row(row: &Row) -> rusqlite::Result<Self> {
        let attached_ids_json: String = row.get(8)?;
        let attachment_ids: Vec<String> =
            serde_json::from_str(&attached_ids_json).unwrap_or_else(|_| vec![]);
        Ok(Self {
            id: row.get(0)?,
            document_id: row.get(1)?,
            version: row.get(2)?,
            created_at: row.get(3)?,
            created_by: row.get(4)?,
            title: row.get(5)?,
            body: row.get(6)?,
            summary: row.get(7)?,
            attachment_ids,
            published_at: row.get(9)?,
            published_by: row.get(10)?,
        })
    }

    fn id(&self) -> Option<String> {
        self.id.clone()
    }

    fn set_id(&mut self, id: String) {
        self.id = Some(id);
    }

    fn insert_values(&self) -> Vec<Box<dyn ToSql>> {
        let attachment_ids_json =
            serde_json::to_string(&self.attachment_ids).unwrap_or_else(|_| "[]".to_string());

        to_sql_vec![
            self.document_id.clone(),
            self.version,
            self.created_at.clone(),
            self.created_by.clone(),
            self.title.clone(),
            self.body.clone(),
            self.summary.clone(),
            attachment_ids_json,
            self.published_at.clone(),
            self.published_by.clone(),
        ]
    }

    fn update_values(&self) -> Vec<Box<dyn ToSql>> {
        let attachment_ids_json =
            serde_json::to_string(&self.attachment_ids).unwrap_or_else(|_| "[]".to_string());

        to_sql_vec![
            self.document_id.clone(),
            self.version,
            self.created_at.clone(),
            self.created_by.clone(),
            self.title.clone(),
            self.body.clone(),
            self.summary.clone(),
            attachment_ids_json,
            self.published_at.clone(),
            self.published_by.clone(),
        ]
    }
}
