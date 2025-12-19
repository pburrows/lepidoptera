use std::sync::{Arc, Mutex};
use db::Connection;
use crate::models::{WorkItemModel, WorkItemTypeModel, WorkItemListRequest, WorkItemListResponse};
use crate::repository::WorkItemsRepository;
use crate::work_items_manager::{
    create_work_item, get_work_item, list_work_items,
    get_work_item_types_by_project, get_work_item_type,
    create_work_item_type, update_work_item_type, mark_work_item_type_inactive,
};
use crate::work_items_port::WorkItemsManager;
use crate::work_items_sqlite_repository::SqliteWorkItemsRepository;
use crate::work_item_types_sqlite_repository::SqliteWorkItemTypesRepository;
use crate::work_item_types_repository::WorkItemTypesRepository;
use crate::work_item_number_ranges_repository::{WorkItemNumberRangesRepository, SqliteWorkItemNumberRangesRepository};

pub struct SqliteWorkItemManager {
    repository: Arc<dyn WorkItemsRepository>,
    work_item_types_repository: Arc<dyn WorkItemTypesRepository>,
    number_ranges_repository: Arc<dyn WorkItemNumberRangesRepository>,
    connection: Arc<Mutex<Connection>>,
}

impl SqliteWorkItemManager {
    pub fn new(connection: Arc<Mutex<Connection>>) -> Self {
        let repository: Arc<dyn WorkItemsRepository> =
            Arc::new(SqliteWorkItemsRepository::new(connection.clone()));
        let work_item_types_repository: Arc<dyn WorkItemTypesRepository> =
            Arc::new(SqliteWorkItemTypesRepository::new(connection.clone()));
        let number_ranges_repository: Arc<dyn WorkItemNumberRangesRepository> =
            Arc::new(SqliteWorkItemNumberRangesRepository::new(connection.clone()));
        Self { 
            repository,
            work_item_types_repository,
            number_ranges_repository,
            connection,
        }
    }
}

impl WorkItemsManager for SqliteWorkItemManager {

    fn get_work_item(&self, id: &str) -> anyhow::Result<Option<WorkItemModel>> {
        get_work_item::get_work_item(
            &self.repository,
            &self.work_item_types_repository,
            &self.connection,
            id,
        )
    }

    fn create_work_item(&self, work_item: WorkItemModel, sequence_prefix: &str, machine_id: &str) -> anyhow::Result<WorkItemModel> {
        create_work_item::create_work_item(
            &self.repository,
            &self.work_item_types_repository,
            &self.number_ranges_repository,
            &self.connection,
            work_item,
            sequence_prefix,
            machine_id,
        )
    }

    fn list_work_items(&self, request: WorkItemListRequest) -> anyhow::Result<WorkItemListResponse> {
        list_work_items::list_work_items(
            &self.repository,
            &self.work_item_types_repository,
            &self.connection,
            request,
        )
    }

    fn get_work_item_types_by_project(&self, project_id: &str) -> anyhow::Result<Vec<WorkItemTypeModel>> {
        get_work_item_types_by_project::get_work_item_types_by_project(&self.work_item_types_repository, project_id)
    }

    fn get_work_item_type(&self, id: &str) -> anyhow::Result<Option<WorkItemTypeModel>> {
        get_work_item_type::get_work_item_type(&self.work_item_types_repository, id)
    }

    fn create_work_item_type(&self, work_item_type: WorkItemTypeModel) -> anyhow::Result<WorkItemTypeModel> {
        create_work_item_type::create_work_item_type(&self.work_item_types_repository, work_item_type)
    }

    fn update_work_item_type(&self, work_item_type: WorkItemTypeModel) -> anyhow::Result<WorkItemTypeModel> {
        update_work_item_type::update_work_item_type(&self.work_item_types_repository, work_item_type)
    }

    fn mark_work_item_type_inactive(&self, id: &str) -> anyhow::Result<()> {
        mark_work_item_type_inactive::mark_work_item_type_inactive(&self.work_item_types_repository, id)
    }
}

