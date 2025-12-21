use crate::entities::WorkItem;
use db::repository_base::GenericRepository;
use std::sync::Arc;
use db::connection_pool::ConnectionPool;
use crate::repository::WorkItemsRepository;

pub struct SqliteWorkItemsRepository {
    inner: GenericRepository<WorkItem>,
}

impl SqliteWorkItemsRepository {
    pub fn new(pool: Arc<ConnectionPool>) -> Self {
        Self {
            inner: GenericRepository::new(pool),
        }
    }
}

impl WorkItemsRepository for SqliteWorkItemsRepository {
    fn find_by_id(&self, id: &str) -> anyhow::Result<Option<WorkItem>> {
        self.inner.find_by_id(id, None)
    }

    fn create(&self, work_item: WorkItem) -> anyhow::Result<WorkItem> {
       self.inner.create(work_item, None) 
    }
}

