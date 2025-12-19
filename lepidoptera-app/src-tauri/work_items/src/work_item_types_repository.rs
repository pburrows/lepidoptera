use crate::entities::WorkItemType;
use anyhow::Result;

pub trait WorkItemTypesRepository: Send + Sync {
    fn find_by_id(&self, id: &str) -> Result<Option<WorkItemType>>;
    fn find_by_project_id(&self, project_id: &str) -> Result<Vec<WorkItemType>>;
    fn create(&self, work_item_type: WorkItemType) -> Result<WorkItemType>;
    fn update(&self, work_item_type: WorkItemType) -> Result<WorkItemType>;
    fn mark_inactive(&self, id: &str) -> Result<()>;
}

