use serde::{Deserialize, Serialize};
use shared::models::person_display::PersonDisplay;
use crate::schemas::team_schemas::TeamDisplaySettings;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TeamResult {
    pub id: Option<String>,
    pub created_at: String,
    pub created_by: PersonDisplay,
    pub updated_at: Option<String>,
    pub updated_by: Option<PersonDisplay>,
    pub name: String,
    pub description: String,
    pub is_active: bool,
    pub display_settings: TeamDisplaySettings,
    pub members: Option<Vec<PersonDisplay>>
}
