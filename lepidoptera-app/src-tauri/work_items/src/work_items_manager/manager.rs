use std::sync::{Arc, Mutex};
use db::Connection;
use crate::entities::WorkItem;
use crate::repository::WorkItemsRepository;
use crate::work_items_manager::{create_work_item, get_work_item};
use crate::work_items_port::WorkItemsManager;
use crate::work_items_sqlite_repository::SqliteWorkItemsRepository;

pub struct SqliteWorkItemManager {
    repository: Arc<dyn WorkItemsRepository>,
}

impl SqliteWorkItemManager {
    pub fn new(connection: Arc<Mutex<Connection>>) -> Self {
        let repository: Arc<dyn WorkItemsRepository> =
            Arc::new(SqliteWorkItemsRepository::new(connection));
        Self { repository }
    }
}

impl WorkItemsManager for SqliteWorkItemManager {

    fn get_work_item(&self, id: &str) -> anyhow::Result<Option<WorkItem>> {
        get_work_item::get_work_item(&self.repository, id)
    }

    fn create_work_item(&self, work_item: WorkItem) -> (WorkItem) {
        create_work_item::create_work_item(&self.repository, work_item)
    }
}

