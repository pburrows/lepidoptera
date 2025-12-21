use crate::entities::WorkItemRelationship;
use db::repository_base::{Entity, GenericRepository};
use db::{to_sql_vec, ToSql};
use std::sync::Arc;
use db::connection_pool::ConnectionPool;
use crate::work_item_relationships_repository::WorkItemRelationshipsRepository;

pub struct SqliteWorkItemRelationshipsRepository {
    inner: GenericRepository<WorkItemRelationship>,
    pool: Arc<ConnectionPool>,
}

impl SqliteWorkItemRelationshipsRepository {
    pub fn new(pool: Arc<ConnectionPool>) -> Self {
        Self {
            inner: GenericRepository::new(pool.clone()),
            pool,
        }
    }
}

impl WorkItemRelationshipsRepository for SqliteWorkItemRelationshipsRepository {
    fn find_by_id(&self, id: &str) -> anyhow::Result<Option<WorkItemRelationship>> {
        self.inner.find_by_id(id, None)
    }

    fn find_by_source_work_item_id(&self, source_work_item_id: &str) -> anyhow::Result<Vec<WorkItemRelationship>> {
        let pooled_conn = self.pool.get()?;
        let conn = pooled_conn.get();
        
        let param: &dyn db::ToSql = &source_work_item_id;
        let params = &[param];
        
        let relationships = conn.query(
            "SELECT id, project_id, source_work_item_id, target_work_item_id, 
                    relationship_type, created_at, updated_at, created_by, updated_by, is_active
             FROM work_item_relationships 
             WHERE source_work_item_id = ?1 AND is_active = 1
             ORDER BY created_at",
            params,
            |row| WorkItemRelationship::from_row(row),
        )?;
        
        Ok(relationships)
    }

    fn find_by_target_work_item_id(&self, target_work_item_id: &str) -> anyhow::Result<Vec<WorkItemRelationship>> {
        let pooled_conn = self.pool.get()?;
        let conn = pooled_conn.get();
        
        let param: &dyn db::ToSql = &target_work_item_id;
        let params = &[param];
        
        let relationships = conn.query(
            "SELECT id, project_id, source_work_item_id, target_work_item_id, 
                    relationship_type, created_at, updated_at, created_by, updated_by, is_active
             FROM work_item_relationships 
             WHERE target_work_item_id = ?1 AND is_active = 1
             ORDER BY created_at",
            params,
            |row| WorkItemRelationship::from_row(row),
        )?;
        
        Ok(relationships)
    }

    fn find_by_source_and_type(&self, source_work_item_id: &str, relationship_type: &str) -> anyhow::Result<Vec<WorkItemRelationship>> {
        let pooled_conn = self.pool.get()?;
        let conn = pooled_conn.get();
        
        let params: &[&dyn db::ToSql] = &[&source_work_item_id, &relationship_type];
        
        let relationships = conn.query(
            "SELECT id, project_id, source_work_item_id, target_work_item_id, 
                    relationship_type, created_at, updated_at, created_by, updated_by, is_active
             FROM work_item_relationships 
             WHERE source_work_item_id = ?1 AND relationship_type = ?2 AND is_active = 1
             ORDER BY created_at",
            params,
            |row| WorkItemRelationship::from_row(row),
        )?;
        
        Ok(relationships)
    }

    fn find_by_target_and_type(&self, target_work_item_id: &str, relationship_type: &str) -> anyhow::Result<Vec<WorkItemRelationship>> {
        let pooled_conn = self.pool.get()?;
        let conn = pooled_conn.get();
        
        let params: &[&dyn db::ToSql] = &[&target_work_item_id, &relationship_type];
        
        let relationships = conn.query(
            "SELECT id, project_id, source_work_item_id, target_work_item_id, 
                    relationship_type, created_at, updated_at, created_by, updated_by, is_active
             FROM work_item_relationships 
             WHERE target_work_item_id = ?1 AND relationship_type = ?2 AND is_active = 1
             ORDER BY created_at",
            params,
            |row| WorkItemRelationship::from_row(row),
        )?;
        
        Ok(relationships)
    }

    fn find_by_work_item_id(&self, work_item_id: &str) -> anyhow::Result<Vec<WorkItemRelationship>> {
        let pooled_conn = self.pool.get()?;
        let conn = pooled_conn.get();
        
        let param: &dyn db::ToSql = &work_item_id;
        let params = &[param, param];
        
        let relationships = conn.query(
            "SELECT id, project_id, source_work_item_id, target_work_item_id, 
                    relationship_type, created_at, updated_at, created_by, updated_by, is_active
             FROM work_item_relationships 
             WHERE (source_work_item_id = ?1 OR target_work_item_id = ?2) AND is_active = 1
             ORDER BY created_at",
            params,
            |row| WorkItemRelationship::from_row(row),
        )?;
        
        Ok(relationships)
    }

    fn find_by_project_id(&self, project_id: &str) -> anyhow::Result<Vec<WorkItemRelationship>> {
        let pooled_conn = self.pool.get()?;
        let conn = pooled_conn.get();
        
        let param: &dyn db::ToSql = &project_id;
        let params = &[param];
        
        let relationships = conn.query(
            "SELECT id, project_id, source_work_item_id, target_work_item_id, 
                    relationship_type, created_at, updated_at, created_by, updated_by, is_active
             FROM work_item_relationships 
             WHERE project_id = ?1 AND is_active = 1
             ORDER BY created_at",
            params,
            |row| WorkItemRelationship::from_row(row),
        )?;
        
        Ok(relationships)
    }

    fn create(&self, relationship: WorkItemRelationship) -> anyhow::Result<WorkItemRelationship> {
        self.inner.create(relationship, None)
    }

    fn update(&self, relationship: WorkItemRelationship) -> anyhow::Result<WorkItemRelationship> {
        let pooled_conn = self.pool.get()?;
        let conn = pooled_conn.get();
        let id = relationship.id.as_ref().ok_or_else(|| anyhow::anyhow!("WorkItemRelationship must have an id to update"))?;
        
        let now = chrono::Utc::now().to_rfc3339();
        let values: Vec<Box<dyn ToSql>> = vec![
            Box::new(relationship.project_id.clone()),
            Box::new(relationship.source_work_item_id.clone()),
            Box::new(relationship.target_work_item_id.clone()),
            Box::new(relationship.relationship_type.clone()),
            Box::new(now.clone()),
            Box::new(relationship.updated_by.clone()),
            Box::new(relationship.is_active),
            Box::new(id.clone()),
        ];
        
        conn.execute(
            &format!(
                "UPDATE {} SET project_id = ?1, source_work_item_id = ?2, target_work_item_id = ?3, 
                        relationship_type = ?4, updated_at = ?5, updated_by = ?6, is_active = ?7
                 WHERE id = ?8",
                WorkItemRelationship::table_name()
            ),
            rusqlite::params_from_iter(values.iter().map(|v| v.as_ref())),
        )?;
        
        self.find_by_id(id)
            .and_then(|opt| opt.ok_or_else(|| anyhow::anyhow!("WorkItemRelationship not found after update")))
    }

    fn mark_inactive(&self, id: &str) -> anyhow::Result<()> {
        let pooled_conn = self.pool.get()?;
        let conn = pooled_conn.get();
        let now = chrono::Utc::now().to_rfc3339();
        
        let values: Vec<Box<dyn ToSql>> = vec![
            Box::new(now),
            Box::new(id.to_string()),
        ];
        
        conn.execute(
            &format!(
                "UPDATE {} SET is_active = 0, updated_at = ?1 WHERE id = ?2",
                WorkItemRelationship::table_name()
            ),
            rusqlite::params_from_iter(values.iter().map(|v| v.as_ref())),
        )?;
        
        Ok(())
    }

    fn delete(&self, id: &str) -> anyhow::Result<()> {
        let pooled_conn = self.pool.get()?;
        let conn = pooled_conn.get();
        
        let values = to_sql_vec![
            id.to_string(),
        ];
        
        conn.execute(
            &format!("DELETE FROM {} WHERE id = ?1", WorkItemRelationship::table_name()),
            rusqlite::params_from_iter(values.iter().map(|v| v.as_ref())),
        )?;
        
        Ok(())
    }
}

