use crate::entities::Document;
use anyhow::Result;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NavigationDocument {
    pub id: Option<String>,
    pub project_id: String,
    pub parent_id: Option<String>,
    pub slug: String,
    pub title: String,
    pub summary: Option<String>,
}

pub trait DocumentsManager: Send + Sync {
    fn get_document_tree(&self, project_id: &str) -> Result<Vec<NavigationDocument>>;
}