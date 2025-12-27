use shared::models::person_display::PersonDisplay;

pub struct ConversationResult {
    pub id: Option<String>,
    pub created_at: String,
    pub updated_at: Option<String>,
    pub created_by: PersonDisplay, // User who created this setting
    pub updated_by: Option<PersonDisplay>, // User who last updated this setting
    pub is_archived: bool,
    pub is_public: bool,
    pub name: String,
    pub description: Option<String>,
    pub conversation_scope: String, // document, work_item, team, project, workspace, direct_message
    pub direct_message_participants: Option<Vec<PersonDisplay>>,
}