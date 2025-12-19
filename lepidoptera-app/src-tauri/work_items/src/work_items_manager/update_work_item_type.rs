use std::sync::Arc;
use crate::models::WorkItemTypeModel;
use crate::work_item_types_repository::WorkItemTypesRepository;
use anyhow::Result;
use chrono::Utc;

pub fn update_work_item_type(
    repository: &Arc<dyn WorkItemTypesRepository>,
    mut work_item_type: WorkItemTypeModel,
) -> Result<WorkItemTypeModel> {
    // Ensure id is present
    work_item_type.id.as_ref()
        .ok_or_else(|| anyhow::anyhow!("WorkItemType must have an id to update"))?;
    
    // Set updated_at
    work_item_type.updated_at = Some(Utc::now().to_rfc3339());
    
    // Convert model to entity (this validates JSON fields during serialization)
    let entity = work_item_type.to_entity()?;
    
    // Update in repository
    let updated_entity = repository.update(entity)?;
    
    // Convert back to model
    WorkItemTypeModel::from_entity(updated_entity)
}

