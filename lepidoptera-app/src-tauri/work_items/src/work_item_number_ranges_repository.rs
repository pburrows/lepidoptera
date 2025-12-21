use std::sync::Arc;
use db::to_sql_vec;
use db::connection_pool::ConnectionPool;
use db::repository_base::{Entity, GenericRepository};
use crate::entities::WorkItemNumberRange;
use anyhow::Result;
use rusqlite::ToSql;

pub trait WorkItemNumberRangesRepository: Send + Sync {
    /// Find the active range for a machine and project
    fn find_active_range(&self, project_id: &str, machine_id: &str) -> Result<Option<WorkItemNumberRange>>;
    
    /// Find all ranges for a project (for conflict detection)
    fn find_ranges_by_project(&self, project_id: &str) -> Result<Vec<WorkItemNumberRange>>;
    
    /// Create a new range
    fn create_range(&self, range: WorkItemNumberRange) -> Result<WorkItemNumberRange>;
    
    /// Update the current_number in a range
    fn update_current_number(&self, range_id: &str, current_number: i64) -> Result<()>;
}

pub struct SqliteWorkItemNumberRangesRepository {
    inner: GenericRepository<WorkItemNumberRange>,
    pool: Arc<ConnectionPool>,
}

impl SqliteWorkItemNumberRangesRepository {
    pub fn new(pool: Arc<ConnectionPool>) -> Self {
        Self {
            inner: GenericRepository::new(pool.clone()),
            pool,
        }
    }
}

impl WorkItemNumberRangesRepository for SqliteWorkItemNumberRangesRepository {
    fn find_active_range(&self, project_id: &str, machine_id: &str) -> Result<Option<WorkItemNumberRange>> {
       let pooled_conn = self.pool.get()?;
        let conn = pooled_conn.get();
        
        let params: &[&dyn ToSql] = &[&project_id, &machine_id];
        let mut results = conn.query(
            "SELECT * FROM work_item_number_ranges 
             WHERE project_id = ?1 AND machine_id = ?2 
             AND current_number < range_end 
             ORDER BY range_start DESC 
             LIMIT 1",
            params,
            |row| WorkItemNumberRange::from_row(row),
        )?;
        
        Ok(results.pop())
    }

    fn find_ranges_by_project(&self, project_id: &str) -> Result<Vec<WorkItemNumberRange>> {
        // let conn = self.inner.connection()?;
        let pooled_conn = self.pool.get()?;
        let conn = pooled_conn.get();
        
        let params: &[&dyn ToSql] = &[&project_id];
        let results = conn.query(
            "SELECT * FROM work_item_number_ranges 
             WHERE project_id = ?1 
             ORDER BY range_start ASC",
            params,
            |row| WorkItemNumberRange::from_row(row),
        )?;
        
        Ok(results)
    }

    fn create_range(&self, range: WorkItemNumberRange) -> Result<WorkItemNumberRange> {
        Ok(self.inner.create(range, None)?)
    }

    fn update_current_number(&self, range_id: &str, current_number: i64) -> Result<()> {
        let pooled_conn = self.pool.get()?;
        let conn = pooled_conn.get();
        
        let values = to_sql_vec![
            current_number,
            chrono::Utc::now().to_rfc3339(),
            range_id.to_string(),
        ];
        
        conn.execute(
            "UPDATE work_item_number_ranges 
             SET current_number = ?1, updated_at = ?2 
             WHERE id = ?3",
            rusqlite::params_from_iter(values.iter().map(|v| v.as_ref())),
        )?;
        
        Ok(())
    }
}

