use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProjectMember {
    pub id: Option<String>,
    pub created_at: String,
    pub updated_at: Option<String>,
    pub created_by: String, 
    pub updated_by: Option<String>, 
    pub project_id: String, 
    pub person_id: Option<String>,
    pub team_id: Option<String>,
    pub role: String,
}
