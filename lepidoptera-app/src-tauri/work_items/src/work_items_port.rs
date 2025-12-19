use anyhow::Result;
use crate::models::{WorkItemModel, WorkItemTypeModel, WorkItemListRequest, WorkItemListResponse};

pub trait WorkItemsManager: Send + Sync {
    fn get_work_item(&self, id: &str) -> Result<Option<WorkItemModel>>;
    /// Create a work item with sequential numbering.
    /// 
    /// # Arguments
    /// * `work_item` - The work item to create
    /// * `sequence_prefix` - The prefix for sequential numbers (e.g., "HOME", "P")
    /// * `machine_id` - The machine ID claiming the number range
    fn create_work_item(&self, work_item: WorkItemModel, sequence_prefix: &str, machine_id: &str) -> Result<WorkItemModel>;
    fn list_work_items(&self, request: WorkItemListRequest) -> Result<WorkItemListResponse>;
    
    // WorkItemType methods
    fn get_work_item_types_by_project(&self, project_id: &str) -> Result<Vec<WorkItemTypeModel>>;
    fn get_work_item_type(&self, id: &str) -> Result<Option<WorkItemTypeModel>>;
    fn create_work_item_type(&self, work_item_type: WorkItemTypeModel) -> Result<WorkItemTypeModel>;
    fn update_work_item_type(&self, work_item_type: WorkItemTypeModel) -> Result<WorkItemTypeModel>;
    fn mark_work_item_type_inactive(&self, id: &str) -> Result<()>;
}

