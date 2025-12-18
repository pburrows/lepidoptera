use anyhow::Result;
use crate::entities::WorkItem;

pub trait WorkItemsManager: Send + Sync {
    fn get_work_item(&self, id: &str) -> Result<Option<WorkItem>>;
    fn create_work_item(&self, work_item: WorkItem) -> (WorkItem);
}

