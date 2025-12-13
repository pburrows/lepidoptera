use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Document {

    pub id: Option<String>,
    pub created_at: String,
    pub updated_at: Option<String>,
    pub title: String,
    pub body: Option<String>,
    pub is_active: bool,
}
