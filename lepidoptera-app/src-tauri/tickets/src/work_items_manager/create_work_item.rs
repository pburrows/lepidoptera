use crate::entities::WorkItem;
use crate::repository::WorkItemsRepository;
use std::sync::{Arc};

pub fn create_work_item(repository: &Arc<dyn WorkItemsRepository>, work_item: WorkItem) -> (WorkItem) {
    // todo: validate work_item
    // todo: create ULID id
    
    match repository.create(work_item) {
        Ok((work_item_with_id)) => {
            (work_item_with_id)
        }
        Err(e) => panic!("Failed to create work_item, {}", e),
    }
}

