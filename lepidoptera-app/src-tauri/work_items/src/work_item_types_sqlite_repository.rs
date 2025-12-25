use crate::entities::WorkItemType;
use db::repository_base::{Entity, GenericRepository};
use db::{ToSql, to_sql_vec};
use std::sync::Arc;
use db::connection_pool::ConnectionPool;
use crate::work_item_types_repository::WorkItemTypesRepository;

pub struct SqliteWorkItemTypesRepository {
    inner: GenericRepository<WorkItemType>,
    pool: Arc<ConnectionPool>,
}

impl SqliteWorkItemTypesRepository {
    pub fn new(pool: Arc<ConnectionPool>) -> Self {
        Self {
            inner: GenericRepository::new(pool.clone()),
            pool,
        }
    }
}

impl WorkItemTypesRepository for SqliteWorkItemTypesRepository {
    fn find_by_id(&self, id: &str) -> anyhow::Result<Option<WorkItemType>> {
        self.inner.find_by_id(id, None)
    }

    fn find_by_project_id(&self, project_id: &str) -> anyhow::Result<Vec<WorkItemType>> {
        let pooled_conn = self.pool.get()?;
        let conn = pooled_conn.get();
        
        let param: &dyn db::ToSql = &project_id;
        let params = &[param];
        
        let work_item_types = conn.query(
            "SELECT id, project_id, created_at, updated_at, is_active, 
                    allowed_children_type_ids, allowed_statuses, allowed_priorities,
                    assignment_field_definitions, work_item_details, work_item_fields,
                    name, display_name
             FROM work_item_types 
             WHERE project_id = ?1 AND is_active = 1
             ORDER BY created_at",
            params,
            |row| WorkItemType::from_row(row),
        )?;
        
        Ok(work_item_types)
    }

    fn create(&self, work_item_type: WorkItemType) -> anyhow::Result<WorkItemType> {
        self.inner.create(work_item_type, None)
    }

    fn update(&self, work_item_type: WorkItemType) -> anyhow::Result<WorkItemType> {
        let pooled_conn = self.pool.get()?;
        let conn = pooled_conn.get();
        let id = work_item_type.id.as_ref().ok_or_else(|| anyhow::anyhow!("WorkItemType must have an id to update"))?;
        
        let values = to_sql_vec![
            work_item_type.project_id.clone(),
            work_item_type.updated_at.clone(),
            work_item_type.is_active,
            work_item_type.allowed_children_type_ids.clone(),
            work_item_type.allowed_statuses.clone(),
            work_item_type.allowed_priorities.clone(),
            work_item_type.assignment_field_definitions.clone(),
            work_item_type.work_item_details.clone(),
            work_item_type.work_item_fields.clone(),
            work_item_type.name.clone(),
            work_item_type.display_name.clone(),
            id.clone(),
        ];
        
        conn.execute(
            &format!(
                "UPDATE {} SET project_id = ?1, updated_at = ?2, is_active = ?3, 
                        allowed_children_type_ids = ?4, allowed_statuses = ?5, allowed_priorities = ?6,
                        assignment_field_definitions = ?7, work_item_details = ?8, work_item_fields = ?9,
                        name = ?10, display_name = ?11
                 WHERE id = ?12",
                WorkItemType::table_name()
            ),
            rusqlite::params_from_iter(values.iter().map(|v| v.as_ref())),
        )?;
        
        self.find_by_id(id)
            .and_then(|opt| opt.ok_or_else(|| anyhow::anyhow!("WorkItemType not found after update")))
    }

    fn mark_inactive(&self, id: &str) -> anyhow::Result<()> {
        let pooled_conn = self.pool.get()?;
        let conn = pooled_conn.get();
        let now = chrono::Utc::now().to_rfc3339();
        
        let values = to_sql_vec![
            now,
            id.to_string(),
        ];
        
        conn.execute(
            &format!(
                "UPDATE {} SET is_active = 0, updated_at = ?1 WHERE id = ?2",
                WorkItemType::table_name()
            ),
            rusqlite::params_from_iter(values.iter().map(|v| v.as_ref())),
        )?;
        
        Ok(())
    }
}

