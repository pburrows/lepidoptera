use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TeamDisplaySettings {
    pub background_color: Option<String>,
    pub avatar_attachment_id: Option<String>,
    pub cover_image_attachment_id: Option<String>,
}
