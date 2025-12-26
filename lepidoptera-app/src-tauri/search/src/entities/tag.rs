use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Tag {
    pub id: Option<String>,
    pub created_at: String,
    pub updated_at: Option<String>,
    pub created_by: String,
    pub updated_by: Option<String>,
    pub project_id: Option<String>, // tags can be scoped to projects or be workspace-wide
    pub name: String,
    pub hash_tag: String, // must be unique
    // pub reference_type: String, // 'work_item' or 'document' or 'conversation'
    // pub reference_id: String,
}
