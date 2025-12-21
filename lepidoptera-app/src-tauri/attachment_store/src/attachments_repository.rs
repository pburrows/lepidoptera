use std::sync::Arc;
use db::connection_pool::ConnectionPool;
use db::repository_base::{Entity, GenericRepository};
use crate::entities::Attachment;
use anyhow::Result;

pub trait AttachmentsRepository: Send + Sync {
    fn find_by_id(&self, id: &str) -> Result<Option<Attachment>>;
    fn create(&self, attachment: Attachment) -> Result<Attachment>;
}

pub struct SqliteAttachmentsRepository {
    inner: GenericRepository<Attachment>,
    pool: Arc<ConnectionPool>,
}

impl SqliteAttachmentsRepository {
    pub fn new(pool: Arc<ConnectionPool>) -> Self {
        Self {
            inner: GenericRepository::new(pool.clone()),
            pool,
        }
    }
}

impl AttachmentsRepository for SqliteAttachmentsRepository {
    fn find_by_id(&self, id: &str) -> Result<Option<Attachment>> {
        self.inner.find_by_id(id, None)
    }

    fn create(&self, attachment: Attachment) -> Result<Attachment> {
        self.inner.create(attachment, None)
    }
}

