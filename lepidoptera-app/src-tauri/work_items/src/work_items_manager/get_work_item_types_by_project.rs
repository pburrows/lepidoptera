use std::sync::Arc;
use crate::models::WorkItemTypeModel;
use crate::work_item_types_repository::WorkItemTypesRepository;
use anyhow::Result;

pub fn get_work_item_types_by_project(
    repository: &Arc<dyn WorkItemTypesRepository>,
    project_id: &str,
) -> Result<Vec<WorkItemTypeModel>> {
    let entities = repository.find_by_project_id(project_id)?;
    entities.into_iter()
        .map(|entity| WorkItemTypeModel::from_entity(entity))
        .collect()
}

