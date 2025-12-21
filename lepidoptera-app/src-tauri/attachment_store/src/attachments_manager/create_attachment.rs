use std::sync::Arc;
use crate::entities::Attachment;
use crate::attachments_repository::AttachmentsRepository;
use anyhow::Result;

pub fn create_attachment(
    repository: &Arc<dyn AttachmentsRepository>,
    attachment: Attachment,
) -> Result<Attachment> {
    repository.create(attachment)
}

