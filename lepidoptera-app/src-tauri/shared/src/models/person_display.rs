use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PersonDisplay {
    pub id: Option<String>,
    pub display_name: String,
    pub is_active: bool,
    pub avatar_attachment_id: Option<String>,
    pub last_seen_at: Option<String>,
}
