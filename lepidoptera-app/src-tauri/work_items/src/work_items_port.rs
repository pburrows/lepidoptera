use crate::models::{
    RelationshipType, WorkItemListRequest, WorkItemListResponse, WorkItemModel,
    WorkItemRelationshipModel, WorkItemTypeModel, WorkItemTypeTemplate,
};
use anyhow::Result;

pub trait WorkItemsManager: Send + Sync {
    fn get_work_item(&self, id: &str) -> Result<Option<WorkItemModel>>;
    /// Create a work item with sequential numbering.
    ///
    /// # Arguments
    /// * `work_item` - The work item to create
    /// * `sequence_prefix` - The prefix for sequential numbers (e.g., "HOME", "P")
    /// * `machine_id` - The machine ID claiming the number range
    fn create_work_item(
        &self,
        work_item: WorkItemModel,
        sequence_prefix: &str,
        machine_id: &str,
    ) -> Result<WorkItemModel>;
    fn list_work_items(&self, request: WorkItemListRequest) -> Result<WorkItemListResponse>;

    // WorkItemType methods
    fn get_work_item_types_by_project(&self, project_id: &str) -> Result<Vec<WorkItemTypeModel>>;
    fn get_work_item_type(&self, id: &str) -> Result<Option<WorkItemTypeModel>>;
    fn create_work_item_type(&self, work_item_type: WorkItemTypeModel)
        -> Result<WorkItemTypeModel>;
    fn update_work_item_type(&self, work_item_type: WorkItemTypeModel)
        -> Result<WorkItemTypeModel>;
    fn mark_work_item_type_inactive(&self, id: &str) -> Result<()>;

    /// Apply a template to create work item types for a project
    fn apply_template(
        &self,
        project_id: String,
        work_item_types: Vec<WorkItemTypeTemplate>,
    ) -> Result<Vec<WorkItemTypeModel>>;

    // WorkItemRelationship methods
    /// Create a relationship between two work items
    fn create_work_item_relationship(
        &self,
        relationship: WorkItemRelationshipModel,
        created_by: &str,
    ) -> Result<WorkItemRelationshipModel>;

    /// Get all relationships for a work item (both as source and target)
    fn get_work_item_relationships(
        &self,
        work_item_id: &str,
    ) -> Result<Vec<WorkItemRelationshipModel>>;

    /// Get relationships where the work item is the source
    fn get_work_item_source_relationships(
        &self,
        work_item_id: &str,
    ) -> Result<Vec<WorkItemRelationshipModel>>;

    /// Get relationships where the work item is the target
    fn get_work_item_target_relationships(
        &self,
        work_item_id: &str,
    ) -> Result<Vec<WorkItemRelationshipModel>>;

    /// Get relationships by type where the work item is the source
    fn get_work_item_source_relationships_by_type(
        &self,
        work_item_id: &str,
        relationship_type: RelationshipType,
    ) -> Result<Vec<WorkItemRelationshipModel>>;

    /// Get relationships by type where the work item is the target
    fn get_work_item_target_relationships_by_type(
        &self,
        work_item_id: &str,
        relationship_type: RelationshipType,
    ) -> Result<Vec<WorkItemRelationshipModel>>;

    /// Delete a work item relationship (soft delete)
    fn delete_work_item_relationship(&self, relationship_id: &str) -> Result<()>;
}
