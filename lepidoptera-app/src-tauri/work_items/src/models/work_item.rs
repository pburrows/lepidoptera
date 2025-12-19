use serde::{Deserialize, Serialize};
use crate::entities::WorkItem as WorkItemEntity;
use crate::models::WorkItemFieldValueModel;

/// Domain model for WorkItem with associated field values
/// 
/// This represents a work item with its custom field values hydrated.
/// The field_values are loaded separately and attached to the work item.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkItemModel {
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
    pub type_id: String,
    /// Sequential number for display (e.g., 1000, 1001, etc.)
    pub sequential_number: Option<i64>,
    /// Custom field values for this work item
    pub field_values: Vec<WorkItemFieldValueModel>,
}

impl WorkItemModel {
    /// Convert from entity to model (without field values)
    pub fn from_entity(entity: WorkItemEntity) -> Self {
        Self {
            id: entity.id,
            title: entity.title,
            description: entity.description,
            status: entity.status,
            created_at: entity.created_at,
            updated_at: entity.updated_at,
            priority: entity.priority,
            created_by: entity.created_by,
            assigned_to: entity.assigned_to,
            project_id: entity.project_id,
            type_id: entity.type_id,
            sequential_number: entity.sequential_number,
            field_values: Vec::new(), // Field values must be loaded separately
        }
    }

    /// Convert from model to entity (field values are stored separately)
    pub fn to_entity(&self) -> WorkItemEntity {
        WorkItemEntity {
            id: self.id.clone(),
            title: self.title.clone(),
            description: self.description.clone(),
            status: self.status.clone(),
            created_at: self.created_at.clone(),
            updated_at: self.updated_at.clone(),
            priority: self.priority,
            created_by: self.created_by.clone(),
            assigned_to: self.assigned_to.clone(),
            project_id: self.project_id.clone(),
            type_id: self.type_id.clone(),
            sequential_number: self.sequential_number,
        }
    }

    /// Create a model from entity with field values
    pub fn from_entity_with_field_values(
        entity: WorkItemEntity,
        field_values: Vec<WorkItemFieldValueModel>,
    ) -> Self {
        Self {
            id: entity.id,
            title: entity.title,
            description: entity.description,
            status: entity.status,
            created_at: entity.created_at,
            updated_at: entity.updated_at,
            priority: entity.priority,
            created_by: entity.created_by,
            assigned_to: entity.assigned_to,
            project_id: entity.project_id,
            type_id: entity.type_id,
            sequential_number: entity.sequential_number,
            field_values,
        }
    }
}

