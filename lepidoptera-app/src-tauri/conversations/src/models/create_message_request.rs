use serde::{Deserialize, Serialize};
use crate::schemas::message_schemas::{Mentions, Reactions};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateMessageRequest {
    pub id: Option<String>,
    pub conversation_id: String,
    pub reply_to_message_id: Option<String>,
    pub person_id: String, 
    pub title: Option<String>,
    pub body: String,
    pub attachment_ids: Vec<String>,
    pub mentions: Option<Mentions>,
    pub reactions: Option<Reactions>,
}