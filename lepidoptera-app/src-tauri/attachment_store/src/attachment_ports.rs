use crate::entities::Attachment;
use anyhow::Result;

pub trait AttachmentsManager: Send + Sync {
    fn create_attachment(&self, attachment: Attachment) -> Result<Attachment>;
    fn get_attachment_by_id(&self, id: &str) -> Result<Option<Attachment>>;
}

