use db::repository_base::Entity;
use rusqlite::{Row, ToSql};
use serde::{Deserialize, Serialize};
use db::to_sql_vec;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkItem {
    pub id: Option<String>,
    pub title: String,
    pub description: Option<String>,
    pub status: String,
    pub created_at: String,
    pub updated_at: Option<String>,
    pub priority: i32,
    pub created_by: String,
    pub assigned_to: Option<String>,
    pub project_id: String,
    pub type_id: String, // Foreign key to WorkItemType
    pub sequential_number: Option<String>, // Sequential number for display (e.g., M-0003, M-1045, etc.)
}

impl Entity for WorkItem {
    fn table_name() -> &'static str {
        "work_items"
    }

    fn columns() -> &'static [&'static str] {
        &[
            "title",
            "description",
            "status",
            "created_at",
            "updated_at",
            "priority",
            "created_by",
            "assigned_to",
            "project_id",
            "type_id",
            "sequential_number",
        ]
    }

    fn from_row(row: &Row) -> rusqlite::Result<Self> {
        Ok(Self {
            id: row.get(0)?,
            title: row.get(1)?,
            description: row.get(2)?,
            status: row.get(3)?,
            created_at: row.get(4)?,
            updated_at: row.get(5)?,
            priority: row.get(6)?,
            created_by: row.get(7)?,
            assigned_to: row.get(8)?,
            project_id: row.get(9)?,
            type_id: row.get(10)?,
            sequential_number: row.get(11)?,
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
            self.title.clone(),
            self.description.clone(),
            self.status.clone(),
            self.created_at.clone(),
            self.updated_at.clone(),
            self.priority,
            self.created_by.clone(),
            self.assigned_to.clone(),
            self.project_id.clone(),
            self.type_id.clone(),
            self.sequential_number.clone(),
        ]
    }

    fn update_values(&self) -> Vec<Box<dyn ToSql>> {
        to_sql_vec![
            self.title.clone(),
            self.description.clone(),
            self.status.clone(),
            self.created_at.clone(),
            self.updated_at.clone(),
            self.priority,
            self.created_by.clone(),
            self.assigned_to.clone(),
            self.project_id.clone(),
            self.type_id.clone(),
            self.sequential_number.clone(),
        ]
    }

}

