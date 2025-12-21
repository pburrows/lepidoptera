use std::sync::Arc;
use crate::entities::Attachment;
use crate::attachments_repository::AttachmentsRepository;
use anyhow::Result;

pub fn get_attachment_by_id(
    repository: &Arc<dyn AttachmentsRepository>,
    id: &str,
) -> Result<Option<Attachment>> {
    repository.find_by_id(id)
}

