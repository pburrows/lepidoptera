use std::sync::Arc;
use crate::entities::WorkItem;
use crate::repository::WorkItemsRepository;
use anyhow::Result;
pub fn get_work_item(repository: &Arc<dyn WorkItemsRepository>, id: &str) -> Result<Option<WorkItem>> {
    repository.find_by_id(id)
}

