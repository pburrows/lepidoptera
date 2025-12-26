use serde::{Deserialize, Serialize};
use shared::models::person_display::PersonDisplay;
use crate::schemas::message_schemas::{Mentions, Reactions};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MessageResult {
    pub id: Option<String>,
    pub conversation_id: String,
    pub reply_to_message_id: Option<String>,
    pub created_at: String,
    pub updated_at: Option<String>,
    pub created_by: PersonDisplay, 
    pub updated_by: Option<PersonDisplay>, 
    pub is_archived: bool,
    pub title: Option<String>,
    pub body: String,
    pub attachment_ids: Vec<String>,
    pub mentions: Option<Mentions>,
    pub reactions: Option<Reactions>,
}
