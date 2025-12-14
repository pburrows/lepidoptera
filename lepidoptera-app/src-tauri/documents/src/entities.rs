use serde::{Deserialize, Serialize};

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
}
