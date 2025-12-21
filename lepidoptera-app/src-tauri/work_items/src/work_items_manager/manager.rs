use std::sync::Arc;
use db::connection_pool::ConnectionPool;
use crate::models::{WorkItemModel, WorkItemTypeModel, WorkItemListRequest, WorkItemListResponse, WorkItemRelationshipModel, RelationshipType};
use crate::repository::WorkItemsRepository;
use crate::work_items_manager::{
    create_work_item, get_work_item, list_work_items,
    get_work_item_types_by_project, get_work_item_type,
    create_work_item_type, update_work_item_type, mark_work_item_type_inactive,
    apply_template,
    create_work_item_relationship, get_work_item_relationships,
    delete_work_item_relationship,
};
use crate::models::WorkItemTypeTemplate;
use crate::work_items_port::WorkItemsManager;
use crate::work_items_sqlite_repository::SqliteWorkItemsRepository;
use crate::work_item_types_sqlite_repository::SqliteWorkItemTypesRepository;
use crate::work_item_types_repository::WorkItemTypesRepository;
use crate::work_item_number_ranges_repository::{WorkItemNumberRangesRepository, SqliteWorkItemNumberRangesRepository};
use crate::work_item_relationships_repository::WorkItemRelationshipsRepository;
use crate::work_item_relationships_sqlite_repository::SqliteWorkItemRelationshipsRepository;

pub struct SqliteWorkItemManager {
    repository: Arc<dyn WorkItemsRepository>,
    work_item_types_repository: Arc<dyn WorkItemTypesRepository>,
    number_ranges_repository: Arc<dyn WorkItemNumberRangesRepository>,
    relationships_repository: Arc<dyn WorkItemRelationshipsRepository>,
    pool: Arc<ConnectionPool>,
}

impl SqliteWorkItemManager {
    pub fn new(pool: Arc<ConnectionPool>) -> Self {
        let repository: Arc<dyn WorkItemsRepository> =
            Arc::new(SqliteWorkItemsRepository::new(pool.clone()));
        let work_item_types_repository: Arc<dyn WorkItemTypesRepository> =
            Arc::new(SqliteWorkItemTypesRepository::new(pool.clone()));
        let number_ranges_repository: Arc<dyn WorkItemNumberRangesRepository> =
            Arc::new(SqliteWorkItemNumberRangesRepository::new(pool.clone()));
        let relationships_repository: Arc<dyn WorkItemRelationshipsRepository> =
            Arc::new(SqliteWorkItemRelationshipsRepository::new(pool.clone()));
        Self { 
            repository,
            work_item_types_repository,
            number_ranges_repository,
            relationships_repository,
            pool,
        }
    }
}

impl WorkItemsManager for SqliteWorkItemManager {

    fn get_work_item(&self, id: &str) -> anyhow::Result<Option<WorkItemModel>> {
        get_work_item::get_work_item(
            &self.repository,
            &self.work_item_types_repository,
            &self.pool,
            id,
        )
    }

    fn create_work_item(&self, work_item: WorkItemModel, sequence_prefix: &str, machine_id: &str) -> anyhow::Result<WorkItemModel> {
        create_work_item::create_work_item(
            &self.repository,
            &self.work_item_types_repository,
            &self.number_ranges_repository,
            &self.pool,
            work_item,
            sequence_prefix,
            machine_id,
        )
    }

    fn list_work_items(&self, request: WorkItemListRequest) -> anyhow::Result<WorkItemListResponse> {
        list_work_items::list_work_items(
            &self.repository,
            &self.work_item_types_repository,
            &self.pool,
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

    fn apply_template(&self, project_id: String, work_item_types: Vec<WorkItemTypeTemplate>) -> anyhow::Result<Vec<WorkItemTypeModel>> {
        apply_template::apply_template(&self.work_item_types_repository, project_id, work_item_types)
    }

    fn create_work_item_relationship(&self, relationship: WorkItemRelationshipModel, created_by: &str) -> anyhow::Result<WorkItemRelationshipModel> {
        create_work_item_relationship::create_work_item_relationship(&self.relationships_repository, relationship, created_by)
    }

    fn get_work_item_relationships(&self, work_item_id: &str) -> anyhow::Result<Vec<WorkItemRelationshipModel>> {
        get_work_item_relationships::get_work_item_relationships(&self.relationships_repository, work_item_id)
    }

    fn get_work_item_source_relationships(&self, work_item_id: &str) -> anyhow::Result<Vec<WorkItemRelationshipModel>> {
        get_work_item_relationships::get_work_item_source_relationships(&self.relationships_repository, work_item_id)
    }

    fn get_work_item_target_relationships(&self, work_item_id: &str) -> anyhow::Result<Vec<WorkItemRelationshipModel>> {
        get_work_item_relationships::get_work_item_target_relationships(&self.relationships_repository, work_item_id)
    }

    fn get_work_item_source_relationships_by_type(&self, work_item_id: &str, relationship_type: RelationshipType) -> anyhow::Result<Vec<WorkItemRelationshipModel>> {
        get_work_item_relationships::get_work_item_source_relationships_by_type(&self.relationships_repository, work_item_id, relationship_type.as_str())
    }

    fn get_work_item_target_relationships_by_type(&self, work_item_id: &str, relationship_type: RelationshipType) -> anyhow::Result<Vec<WorkItemRelationshipModel>> {
        get_work_item_relationships::get_work_item_target_relationships_by_type(&self.relationships_repository, work_item_id, relationship_type.as_str())
    }

    fn delete_work_item_relationship(&self, relationship_id: &str) -> anyhow::Result<()> {
        delete_work_item_relationship::delete_work_item_relationship(&self.relationships_repository, relationship_id)
    }
}

