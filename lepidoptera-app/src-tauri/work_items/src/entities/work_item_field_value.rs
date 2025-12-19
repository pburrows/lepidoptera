use db::repository_base::Entity;
use rusqlite::{Row, ToSql};
use serde::{Deserialize, Serialize};
use db::to_sql_vec;

/// Entity representing a custom field value for a work item.
/// 
/// This stores user-entered values for custom fields defined in the associated
/// WorkItemType. The field_id can reference either a WorkItemField or an
/// AssignmentFieldDefinition, distinguished by the is_assignment_field flag.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkItemFieldValue {
    pub id: Option<String>,
    pub project_id: String,
    pub work_item_id: String, // Foreign key to work_item
    pub field_id: String, // References WorkItemField.id or AssignmentFieldDefinition.id
    pub is_assignment_field: bool, // true if field_id refers to AssignmentFieldDefinition, false for WorkItemField
    pub value: String, // The user-entered value (stored as TEXT, can be JSON for complex types)
    pub created_at: String,
    pub updated_at: Option<String>,
    pub created_by: String, // User who created this field value
    pub updated_by: Option<String>, // User who last updated this field value
    pub is_active: bool,
}

impl Entity for WorkItemFieldValue {
    fn table_name() -> &'static str {
        "work_item_field_values"
    }

    fn columns() -> &'static [&'static str] {
        // Columns that are inserted (must match insert_values length)
        &[
            "project_id",
            "work_item_id",
            "field_id",
            "is_assignment_field",
            "value",
            "created_at",
            "created_by",
            "is_active",
        ]
    }

    fn from_row(row: &Row) -> rusqlite::Result<Self> {
        // from_row reads all columns including id (row 0) and all table columns
        Ok(Self {
            id: row.get(0)?,
            project_id: row.get(1)?,
            work_item_id: row.get(2)?,
            field_id: row.get(3)?,
            is_assignment_field: row.get(4)?,
            value: row.get(5)?,
            created_at: row.get(6)?,
            updated_at: row.get(7)?, // nullable column
            created_by: row.get(8)?,
            updated_by: row.get(9)?, // nullable column
            is_active: row.get(10)?,
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
            self.project_id.clone(),
            self.work_item_id.clone(),
            self.field_id.clone(),
            self.is_assignment_field,
            self.value.clone(),
            self.created_at.clone(),
            self.created_by.clone(),
            self.is_active,
        ]
    }

    fn update_values(&self) -> Vec<Box<dyn ToSql>> {
        to_sql_vec![
            self.project_id.clone(),
            self.work_item_id.clone(),
            self.field_id.clone(),
            self.is_assignment_field,
            self.value.clone(),
            self.updated_at.clone(),
            self.updated_by.clone(),
            self.is_active,
        ]
    }

}

