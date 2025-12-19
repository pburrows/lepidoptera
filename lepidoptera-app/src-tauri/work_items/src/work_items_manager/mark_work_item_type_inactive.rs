use std::sync::Arc;
use crate::work_item_types_repository::WorkItemTypesRepository;
use anyhow::Result;

pub fn mark_work_item_type_inactive(
    repository: &Arc<dyn WorkItemTypesRepository>,
    id: &str,
) -> Result<()> {
    repository.mark_inactive(id)
}

