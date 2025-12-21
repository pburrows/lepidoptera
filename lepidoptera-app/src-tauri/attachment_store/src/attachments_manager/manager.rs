use std::sync::Arc;
use db::connection_pool::ConnectionPool;
use crate::entities::Attachment;
use crate::attachment_ports::AttachmentsManager;
use crate::attachments_repository::{AttachmentsRepository, SqliteAttachmentsRepository};
use crate::attachments_manager::{create_attachment, get_attachment_by_id};

pub struct SqliteAttachmentsManager {
    repository: Arc<dyn AttachmentsRepository>,
}

impl SqliteAttachmentsManager {
    pub fn new(pool: Arc<ConnectionPool>) -> Self {
        let repository: Arc<dyn AttachmentsRepository> =
            Arc::new(SqliteAttachmentsRepository::new(pool));
        Self { 
            repository,
        }
    }
}

impl AttachmentsManager for SqliteAttachmentsManager {
    fn create_attachment(&self, attachment: Attachment) -> anyhow::Result<Attachment> {
        create_attachment::create_attachment(&self.repository, attachment)
    }

    fn get_attachment_by_id(&self, id: &str) -> anyhow::Result<Option<Attachment>> {
        get_attachment_by_id::get_attachment_by_id(&self.repository, id)
    }
}

