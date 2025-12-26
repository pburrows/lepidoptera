use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Tag {
    pub id: Option<String>,
    pub tag_id: String,
    pub created_at: String,
    pub updated_at: Option<String>,
    pub created_by: String,
    pub updated_by: Option<String>,
    pub reference_type: String, // 'work_item' or 'document' or 'conversation'
    pub reference_id: String, // the thing being tagged
}
