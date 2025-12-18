use crate::entities::WorkItem;
use anyhow::Result;

pub trait WorkItemsRepository: Send + Sync {
    fn find_by_id(&self, id: &str) -> Result<Option<WorkItem>>;

    fn create(&self, work_item: WorkItem) -> Result<(WorkItem)>;
}