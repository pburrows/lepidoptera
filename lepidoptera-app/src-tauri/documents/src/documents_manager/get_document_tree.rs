use crate::docuent_ports::NavigationDocument;
use crate::documents_sqlite_repository::DocumentsRepository;
use std::sync::Arc;

pub fn get_document_tree(
    repository: &Arc<dyn DocumentsRepository>,
    project_id: &str,
) -> anyhow::Result<Vec<NavigationDocument>> {
    repository.get_latest_documents(project_id)
}

