use std::sync::Arc;
use crate::work_item_relationships_repository::WorkItemRelationshipsRepository;
use anyhow::Result;

/// Delete a work item relationship (soft delete - marks as inactive)
pub fn delete_work_item_relationship(
    repository: &Arc<dyn WorkItemRelationshipsRepository>,
    relationship_id: &str,
) -> Result<()> {
    repository.mark_inactive(relationship_id)
}

/// Hard delete a work item relationship
pub fn hard_delete_work_item_relationship(
    repository: &Arc<dyn WorkItemRelationshipsRepository>,
    relationship_id: &str,
) -> Result<()> {
    repository.delete(relationship_id)
}

