use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReadRecord {
    pub id: Option<String>,
    pub created_at: String,
    pub person_id: String,
    pub conversation_id: String,
    pub last_read_message_id: Option<String>,
    pub last_read_at: Option<String>,
}
