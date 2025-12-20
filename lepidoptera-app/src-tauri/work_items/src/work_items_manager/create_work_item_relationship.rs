use std::sync::Arc;
use crate::models::WorkItemRelationshipModel;
use crate::work_item_relationships_repository::WorkItemRelationshipsRepository;
use anyhow::Result;
use chrono::Utc;
use ulid::Ulid;

/// Create a new work item relationship
pub fn create_work_item_relationship(
    repository: &Arc<dyn WorkItemRelationshipsRepository>,
    relationship: WorkItemRelationshipModel,
    created_by: &str,
) -> Result<WorkItemRelationshipModel> {
    let mut entity = relationship.to_entity();
    
    // Generate ID if not provided
    if entity.id.is_none() {
        entity.id = Some(Ulid::new().to_string()); 
    }
    
    // Set timestamps
    let now = Utc::now().to_rfc3339();
    entity.created_at = now;
    entity.created_by = created_by.to_string();
    entity.updated_by = None; // New relationships don't have an updated_by
    entity.is_active = true;
    
    let created = repository.create(entity)?;
    WorkItemRelationshipModel::from_entity(created)
}

