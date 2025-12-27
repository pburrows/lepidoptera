use db::repository_base::Entity;
use rusqlite::{Row, ToSql};
use serde::{Deserialize, Serialize};
use db::to_sql_vec;

/// Entity representing a number range allocated to a machine for a project.
/// 
/// Each machine can claim a range of sequential numbers for a project.
/// When a machine exhausts its range, it claims the next available range.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkItemNumberRange {
    pub id: Option<String>,
    pub project_id: String, // Foreign key to projects
    pub machine_id: String, // Machine that owns this range
    pub range_start: i64,   // Start of the range (inclusive)
    pub range_end: i64,     // End of the range (inclusive)
    pub current_number: i64, // Current number being used (increments as numbers are assigned)
    pub created_at: String,
    pub updated_at: Option<String>,
}

impl Entity for WorkItemNumberRange {
    fn table_name() -> &'static str {
        "work_item_number_ranges"
    }

    fn columns() -> &'static [&'static str] {
        &[
            "id",
            "project_id",
            "machine_id",
            "range_start",
            "range_end",
            "current_number",
            "created_at",
            "updated_at",
        ]
    }

    fn from_row(row: &Row) -> rusqlite::Result<Self> {
        Ok(Self {
            id: row.get(0)?,
            project_id: row.get(1)?,
            machine_id: row.get(2)?,
            range_start: row.get(3)?,
            range_end: row.get(4)?,
            current_number: row.get(5)?,
            created_at: row.get(6)?,
            updated_at: row.get(7)?,
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
            self.machine_id.clone(),
            self.range_start,
            self.range_end,
            self.current_number,
            self.created_at.clone(),
            self.updated_at.clone(),
        ]
    }

    fn update_values(&self) -> Vec<Box<dyn ToSql>> {
        to_sql_vec![
            self.id.clone().unwrap_or_default(), // id (won't actually be updated, but required for SQL generation)
            self.project_id.clone(), // project_id (won't actually be updated, but required for SQL generation)
            self.machine_id.clone(), // machine_id (won't actually be updated, but required for SQL generation)
            self.range_start,
            self.range_end,
            self.current_number,
            self.created_at.clone(), // created_at (won't actually be updated, but required for SQL generation)
            self.updated_at.clone(),
        ]
    }
}

