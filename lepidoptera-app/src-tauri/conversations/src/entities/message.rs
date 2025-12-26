use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Message {
    pub id: Option<String>,
    pub conversation_id: String,
    pub reply_to_message_id: Option<String>,
    pub created_at: String,
    pub updated_at: Option<String>,
    pub created_by: String, // User who created this setting
    pub updated_by: Option<String>, // User who last updated this setting
    pub is_archived: bool,
    pub title: Option<String>,
    pub body: String,
    pub attachment_ids: Vec<String>,
    pub mentions: Option<String>,
    pub reactions: Option<String>,
}
