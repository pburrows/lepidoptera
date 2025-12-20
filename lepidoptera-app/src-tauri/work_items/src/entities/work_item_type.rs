use db::repository_base::Entity;
use rusqlite::{Row, ToSql};
use serde::{Deserialize, Serialize};
use db::to_sql_vec;
use crate::schemas::{
    AllowedChildrenTypeIds,
    AllowedStatuses,
    AllowedPriorities,
    AssignmentFieldDefinitions,
    WorkItemDetails,
    WorkItemFields,
};
use anyhow::Result;
use serde_json;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkItemType {
    pub id: Option<String>,
    pub project_id: String,
    pub created_at: String,
    pub updated_at: Option<String>,
    pub is_active: bool,
    pub allowed_children_type_ids: String, // JSON field
    pub allowed_statuses: String, // JSON field
    pub allowed_priorities: String, // JSON field
    pub assignment_field_definitions: String, // JSON field
    pub work_item_details: String, // JSON field
    pub work_item_fields: String, // JSON field
}

impl Entity for WorkItemType {
    fn table_name() -> &'static str {
        "work_item_types"
    }

    fn columns() -> &'static [&'static str] {
        &[
            "id",
            "project_id",
            "created_at",
            "updated_at",
            "is_active",
            "allowed_children_type_ids",
            "allowed_statuses",
            "allowed_priorities",
            "assignment_field_definitions",
            "work_item_details",
            "work_item_fields",
        ]
    }

    fn from_row(row: &Row) -> rusqlite::Result<Self> {
        Ok(Self {
            id: row.get(0)?,
            project_id: row.get(1)?,
            created_at: row.get(2)?,
            updated_at: row.get(3)?,
            is_active: row.get(4)?,
            allowed_children_type_ids: row.get(5)?,
            allowed_statuses: row.get(6)?,
            allowed_priorities: row.get(7)?,
            assignment_field_definitions: row.get(8)?,
            work_item_details: row.get(9)?,
            work_item_fields: row.get(10)?,
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
            self.created_at.clone(),
            self.updated_at.clone(),
            self.is_active,
            self.allowed_children_type_ids.clone(),
            self.allowed_statuses.clone(),
            self.allowed_priorities.clone(),
            self.assignment_field_definitions.clone(),
            self.work_item_details.clone(),
            self.work_item_fields.clone(),
        ]
    }

    fn update_values(&self) -> Vec<Box<dyn ToSql>> {
        to_sql_vec![
            self.project_id.clone(),
            self.updated_at.clone(),
            self.is_active,
            self.allowed_children_type_ids.clone(),
            self.allowed_statuses.clone(),
            self.allowed_priorities.clone(),
            self.assignment_field_definitions.clone(),
            self.work_item_details.clone(),
            self.work_item_fields.clone(),
        ]
    }

}

impl WorkItemType {
    /// Parse allowed_children_type_ids JSON string into typed struct
    pub fn parse_allowed_children_type_ids(&self) -> Result<AllowedChildrenTypeIds> {
        serde_json::from_str(&self.allowed_children_type_ids)
            .map_err(|e| anyhow::anyhow!("Failed to parse allowed_children_type_ids: {}", e))
    }

    /// Parse allowed_statuses JSON string into typed struct
    pub fn parse_allowed_statuses(&self) -> Result<AllowedStatuses> {
        serde_json::from_str(&self.allowed_statuses)
            .map_err(|e| anyhow::anyhow!("Failed to parse allowed_statuses: {}", e))
    }

    /// Parse allowed_priorities JSON string into typed struct
    pub fn parse_allowed_priorities(&self) -> Result<AllowedPriorities> {
        serde_json::from_str(&self.allowed_priorities)
            .map_err(|e| anyhow::anyhow!("Failed to parse allowed_priorities: {}", e))
    }

    /// Parse assignment_field_definitions JSON string into typed struct
    pub fn parse_assignment_field_definitions(&self) -> Result<AssignmentFieldDefinitions> {
        serde_json::from_str(&self.assignment_field_definitions)
            .map_err(|e| anyhow::anyhow!("Failed to parse assignment_field_definitions: {}", e))
    }

    /// Parse work_item_details JSON string into typed struct
    pub fn parse_work_item_details(&self) -> Result<WorkItemDetails> {
        serde_json::from_str(&self.work_item_details)
            .map_err(|e| anyhow::anyhow!("Failed to parse work_item_details: {}", e))
    }

    /// Parse work_item_fields JSON string into typed struct
    pub fn parse_work_item_fields(&self) -> Result<WorkItemFields> {
        serde_json::from_str(&self.work_item_fields)
            .map_err(|e| anyhow::anyhow!("Failed to parse work_item_fields: {}", e))
    }
}

