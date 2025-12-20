use db::repository_base::Entity;
use rusqlite::{Row, ToSql};
use serde::{Deserialize, Serialize};
use db::to_sql_vec;

/// Entity representing a relationship between two work items.
/// 
/// Relationships are directional: source_work_item_id → target_work_item_id
/// For example, if Epic-123 blocks Task-456, then:
/// - source_work_item_id = "Epic-123"
/// - target_work_item_id = "Task-456"
/// - relationship_type = "blocks"
/// 
/// Common relationship types:
/// - "parent" / "child" - hierarchical relationships
/// - "blocks" / "blocked_by" - dependency relationships
/// - "duplicates" / "duplicated_by" - duplicate tracking
/// - "related" - general related items
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkItemRelationship {
    pub id: Option<String>,
    pub project_id: String,
    pub source_work_item_id: String, // The "from" work item
    pub target_work_item_id: String,  // The "to" work item
    pub relationship_type: String,    // e.g., "parent", "child", "blocks", "blocked_by", "duplicates", "related"
    pub created_at: String,
    pub updated_at: Option<String>,
    pub created_by: String,
    pub updated_by: Option<String>, // User who last updated this relationship
    pub is_active: bool,
}

impl Entity for WorkItemRelationship {
    fn table_name() -> &'static str {
        "work_item_relationships"
    }

    fn columns() -> &'static [&'static str] {
        &[
            "id",
            "project_id",
            "source_work_item_id",
            "target_work_item_id",
            "relationship_type",
            "created_at",
            "created_by",
            "is_active",
        ]
    }

    fn from_row(row: &Row) -> rusqlite::Result<Self> {
        Ok(Self {
            id: row.get(0)?,
            project_id: row.get(1)?,
            source_work_item_id: row.get(2)?,
            target_work_item_id: row.get(3)?,
            relationship_type: row.get(4)?,
            created_at: row.get(5)?,
            updated_at: row.get(6)?, // nullable column
            created_by: row.get(7)?,
            updated_by: row.get(8)?, // nullable column
            is_active: row.get(9)?,
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
            self.id.clone(),
            self.project_id.clone(),
            self.source_work_item_id.clone(),
            self.target_work_item_id.clone(),
            self.relationship_type.clone(),
            self.created_at.clone(),
            self.created_by.clone(),
            self.is_active,
        ]
    }

    fn update_values(&self) -> Vec<Box<dyn ToSql>> {
        to_sql_vec![
            self.project_id.clone(),
            self.source_work_item_id.clone(),
            self.target_work_item_id.clone(),
            self.relationship_type.clone(),
            self.updated_at.clone(),
            self.updated_by.clone(),
            self.is_active,
        ]
    }
}

