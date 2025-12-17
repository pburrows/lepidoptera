use std::sync::{Arc, Mutex};
use db::Connection;
use crate::docuent_ports::DocumentsManager;
use crate::documents_sqlite_repository::{DocumentsRepository, SqliteDocumentsRepository};
use anyhow::Result;
use crate::documents_manager::get_document_tree;

pub struct SqliteDocumentsManager {
    repository: Arc<dyn DocumentsRepository>,
}

impl SqliteDocumentsManager {
    pub fn new(connection: Arc<Mutex<Connection>>) -> Self {
        let repository: Arc<dyn DocumentsRepository> =
            Arc::new(SqliteDocumentsRepository::new(connection));
        Self { repository }
    }
}

impl DocumentsManager for SqliteDocumentsManager {
    fn get_document_tree(&self, project_id: &str) -> Result<Vec<crate::docuent_ports::NavigationDocument>> {
        get_document_tree::get_document_tree(&self.repository, project_id)
    }
}
