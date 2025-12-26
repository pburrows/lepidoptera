use serde::{Deserialize, Serialize};

/// Schema for `mentions` field
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Mentions {
    pub mentioned_person_ids: Option<Vec<String>>,
    pub mentioned_team_ids: Option<Vec<String>>,
    pub mentioned_project_ids: Option<Vec<String>>,
    pub mentioned_work_item_ids: Option<Vec<String>>,
    pub mentioned_document_ids: Option<Vec<String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Reactions {
    pub reactions: Option<Vec<Reaction>>,
}


#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Reaction {
    pub emoji: String,
    pub count: i32,
    pub reacting_person_ids: Vec<String>,
}


