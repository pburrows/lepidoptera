use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Conversation {
    pub id: Option<String>,
    pub created_at: String,
    pub updated_at: Option<String>,
    pub created_by: String, // User who created this setting
    pub updated_by: Option<String>, // User who last updated this setting
    pub is_archived: bool,
    pub name: String,
    pub description: Option<String>,
    pub conversation_scope: String, // document, work_item, team, project, workspace, direct_message
    pub conversation_scope_id: String,
    pub direct_message_participants: Option<Vec<String>>,
}
