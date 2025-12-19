use db::repository_base::Entity;
use rusqlite::{Row, ToSql};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use db::to_sql_vec;

/// Entity representing a project setting stored as a key/value pair.
/// 
/// This stores project-specific settings where each setting is a row
/// with a key (setting_key) and value (stored as JSON in setting_value).
/// The project_id is a foreign key to the projects table.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProjectSettings {
    pub id: Option<String>,
    pub project_id: String, // Foreign key to projects
    pub setting_key: String, // The setting key/name
    pub setting_value: Value, // The setting value stored as JSON
    pub created_at: String,
    pub updated_at: Option<String>,
    pub created_by: String, // User who created this setting
    pub updated_by: Option<String>, // User who last updated this setting
}

impl Entity for ProjectSettings {
    fn table_name() -> &'static str {
        "project_settings"
    }

    fn columns() -> &'static [&'static str] {
        &[
            "id",
            "project_id",
            "setting_key",
            "setting_value",
            "created_at",
            "updated_at",
            "created_by",
            "updated_by",
        ]
    }

    fn from_row(row: &Row) -> rusqlite::Result<Self> {
        Ok(Self {
            id: row.get(0)?,
            project_id: row.get(1)?,
            setting_key: row.get(2)?,
            setting_value: {
                let json_str: String = row.get(3)?;
                serde_json::from_str(&json_str).unwrap_or(Value::Null)
            },
            created_at: row.get(4)?,
            updated_at: row.get(5)?,
            created_by: row.get(6)?,
            updated_by: row.get(7)?,
        })
    }

    fn id(&self) -> Option<String> {
        self.id.clone()
    }

    fn set_id(&mut self, id: String) {
        self.id = Some(id);
    }

    fn insert_values(&self) -> Vec<Box<dyn ToSql>> {
        to_sql_vec![
            self.id.clone().unwrap_or_default(),
            self.project_id.clone(),
            self.setting_key.clone(),
            serde_json::to_string(&self.setting_value).unwrap_or_else(|_| "null".to_string()),
            self.created_at.clone(),
            self.updated_at.clone(),
            self.created_by.clone(),
            self.updated_by.clone(),
        ]
    }

    fn update_values(&self) -> Vec<Box<dyn ToSql>> {
        // Note: This is not used in the custom upsert implementation
        // Only setting_value, updated_at, and updated_by are updated
        to_sql_vec![
            serde_json::to_string(&self.setting_value).unwrap_or_else(|_| "null".to_string()),
            self.updated_at.clone(),
            self.updated_by.clone(),
        ]
    }
}

