use std::sync::Arc;
use crate::models::WorkItemTypeModel;
use crate::work_item_types_repository::WorkItemTypesRepository;
use anyhow::Result;
use ulid::Ulid;
use chrono::Utc;

pub fn create_work_item_type(
    repository: &Arc<dyn WorkItemTypesRepository>,
    mut work_item_type: WorkItemTypeModel,
) -> Result<WorkItemTypeModel> {
    // Generate ULID if not provided
    if work_item_type.id.is_none() {
        work_item_type.id = Some(Ulid::new().to_string());
    }
    
    // Set created_at if not provided
    if work_item_type.created_at.is_empty() {
        work_item_type.created_at = Utc::now().to_rfc3339();
    }
    
    // Convert model to entity (this validates JSON fields during serialization)
    let entity = work_item_type.to_entity()?;
    
    // Create in repository
    let created_entity = repository.create(entity)?;
    
    // Convert back to model
    WorkItemTypeModel::from_entity(created_entity)
}

