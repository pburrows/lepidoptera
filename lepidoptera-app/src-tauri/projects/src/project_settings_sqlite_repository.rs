use std::sync::Arc;
use db::connection_pool::ConnectionPool;
use db::repository_base::{Entity, GenericRepository};
use crate::entities::ProjectSettings;
use anyhow::Result;
use rusqlite::ToSql;

pub trait ProjectSettingsRepository: Send + Sync {
    fn find_by_project_and_key(&self, project_id: &str, setting_key: &str) -> Result<Option<ProjectSettings>>;
    fn upsert(&self, setting: ProjectSettings) -> Result<ProjectSettings>;
}

pub struct ProjectSettingsSqliteRepository {
    inner: GenericRepository<ProjectSettings>,
    pool: Arc<ConnectionPool>,
}

impl ProjectSettingsSqliteRepository {
    pub fn new(pool: Arc<ConnectionPool>) -> Self {
        Self {
            inner: GenericRepository::new(pool.clone()),
            pool,
        }
    }
}

impl ProjectSettingsRepository for ProjectSettingsSqliteRepository {
    fn find_by_project_and_key(&self, project_id: &str, setting_key: &str) -> Result<Option<ProjectSettings>> {
         let pooled_conn = self.pool.get()?;
        let conn = pooled_conn.get();
        
        let params: &[&dyn ToSql] = &[&project_id, &setting_key];
        let mut results = conn.query(
            "SELECT * FROM project_settings WHERE project_id = ?1 AND setting_key = ?2",
            params,
            |row| ProjectSettings::from_row(row),
        )?;
        
        Ok(results.pop())
    }

    fn upsert(&self, mut setting: ProjectSettings) -> Result<ProjectSettings> {
        self.inner.with_connection(|conn| {
            // Check if setting already exists
            let existing = conn.query(
                "SELECT id FROM project_settings WHERE project_id = ?1 AND setting_key = ?2",
                &[&setting.project_id, &setting.setting_key],
                |row| -> rusqlite::Result<String> { row.get(0) },
            )?;
            
            if let Some(existing_id) = existing.first() {
                // Update existing setting - only update setting_value, updated_at, and updated_by
                let existing_id_clone = existing_id.clone();
                setting.id = Some(existing_id_clone.clone());
                
                let sql = "UPDATE project_settings SET setting_value = ?1, updated_at = ?2, updated_by = ?3 WHERE id = ?4";
                
                let values: Vec<Box<dyn ToSql>> = vec![
                    Box::new(serde_json::to_string(&setting.setting_value).unwrap_or_else(|_| "null".to_string())),
                    Box::new(setting.updated_at.clone()),
                    Box::new(setting.updated_by.clone()),
                    Box::new(existing_id_clone.clone()),
                ];
                
                conn.execute(
                    sql,
                    rusqlite::params_from_iter(values.iter().map(|v| v.as_ref())),
                )?;
            } else {
                // Insert new setting - generate id if not set
                if setting.id.is_none() {
                    setting.id = Some(ulid::Ulid::new().to_string());
                }
                
                // Use create with the existing connection to reuse the insert logic
                setting = self.inner.create(setting, Some(conn))?;
            }
            
            Ok(setting)
        })
    }
}

