use crate::entities::WorkItemRelationship;
use anyhow::Result;

pub trait WorkItemRelationshipsRepository: Send + Sync {
    /// Find a relationship by ID
    fn find_by_id(&self, id: &str) -> Result<Option<WorkItemRelationship>>;
    
    /// Find all relationships where the given work item is the source
    fn find_by_source_work_item_id(&self, source_work_item_id: &str) -> Result<Vec<WorkItemRelationship>>;
    
    /// Find all relationships where the given work item is the target
    fn find_by_target_work_item_id(&self, target_work_item_id: &str) -> Result<Vec<WorkItemRelationship>>;
    
    /// Find relationships by source work item and relationship type
    fn find_by_source_and_type(&self, source_work_item_id: &str, relationship_type: &str) -> Result<Vec<WorkItemRelationship>>;
    
    /// Find relationships by target work item and relationship type
    fn find_by_target_and_type(&self, target_work_item_id: &str, relationship_type: &str) -> Result<Vec<WorkItemRelationship>>;
    
    /// Find all relationships for a work item (both as source and target)
    fn find_by_work_item_id(&self, work_item_id: &str) -> Result<Vec<WorkItemRelationship>>;
    
    /// Find relationships by project
    fn find_by_project_id(&self, project_id: &str) -> Result<Vec<WorkItemRelationship>>;
    
    /// Create a new relationship
    fn create(&self, relationship: WorkItemRelationship) -> Result<WorkItemRelationship>;
    
    /// Update an existing relationship
    fn update(&self, relationship: WorkItemRelationship) -> Result<WorkItemRelationship>;
    
    /// Mark a relationship as inactive (soft delete)
    fn mark_inactive(&self, id: &str) -> Result<()>;
    
    /// Delete a relationship (hard delete)
    fn delete(&self, id: &str) -> Result<()>;
}

