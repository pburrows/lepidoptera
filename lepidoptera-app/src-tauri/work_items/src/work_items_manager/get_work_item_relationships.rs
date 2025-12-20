use std::sync::Arc;
use crate::models::WorkItemRelationshipModel;
use crate::work_item_relationships_repository::WorkItemRelationshipsRepository;
use anyhow::Result;

/// Get all relationships for a work item (both as source and target)
pub fn get_work_item_relationships(
    repository: &Arc<dyn WorkItemRelationshipsRepository>,
    work_item_id: &str,
) -> Result<Vec<WorkItemRelationshipModel>> {
    let entities = repository.find_by_work_item_id(work_item_id)?;
    entities.into_iter()
        .map(|entity| WorkItemRelationshipModel::from_entity(entity))
        .collect()
}

/// Get relationships where the work item is the source
pub fn get_work_item_source_relationships(
    repository: &Arc<dyn WorkItemRelationshipsRepository>,
    work_item_id: &str,
) -> Result<Vec<WorkItemRelationshipModel>> {
    let entities = repository.find_by_source_work_item_id(work_item_id)?;
    entities.into_iter()
        .map(|entity| WorkItemRelationshipModel::from_entity(entity))
        .collect()
}

/// Get relationships where the work item is the target
pub fn get_work_item_target_relationships(
    repository: &Arc<dyn WorkItemRelationshipsRepository>,
    work_item_id: &str,
) -> Result<Vec<WorkItemRelationshipModel>> {
    let entities = repository.find_by_target_work_item_id(work_item_id)?;
    entities.into_iter()
        .map(|entity| WorkItemRelationshipModel::from_entity(entity))
        .collect()
}

/// Get relationships by type where the work item is the source
pub fn get_work_item_source_relationships_by_type(
    repository: &Arc<dyn WorkItemRelationshipsRepository>,
    work_item_id: &str,
    relationship_type: &str,
) -> Result<Vec<WorkItemRelationshipModel>> {
    let entities = repository.find_by_source_and_type(work_item_id, relationship_type)?;
    entities.into_iter()
        .map(|entity| WorkItemRelationshipModel::from_entity(entity))
        .collect()
}

/// Get relationships by type where the work item is the target
pub fn get_work_item_target_relationships_by_type(
    repository: &Arc<dyn WorkItemRelationshipsRepository>,
    work_item_id: &str,
    relationship_type: &str,
) -> Result<Vec<WorkItemRelationshipModel>> {
    let entities = repository.find_by_target_and_type(work_item_id, relationship_type)?;
    entities.into_iter()
        .map(|entity| WorkItemRelationshipModel::from_entity(entity))
        .collect()
}

