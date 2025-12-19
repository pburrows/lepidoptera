use std::sync::Arc;
use crate::models::WorkItemTypeModel;
use crate::work_item_types_repository::WorkItemTypesRepository;
use anyhow::Result;

pub fn get_work_item_type(
    repository: &Arc<dyn WorkItemTypesRepository>,
    id: &str,
) -> Result<Option<WorkItemTypeModel>> {
    repository.find_by_id(id)
        .and_then(|opt| {
            opt.map(|entity| WorkItemTypeModel::from_entity(entity))
                .transpose()
        })
}

