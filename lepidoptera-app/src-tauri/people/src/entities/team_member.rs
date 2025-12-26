use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TeamMember {
    pub id: Option<String>,
    pub created_at: String,
    pub created_by: String,
    pub updated_at: Option<String>,
    pub updated_by: Option<String>,
    pub team_id: String,
    pub person_id: String,
    pub role: String, // manager, developer, tester, etc.
}
