use serde::{Deserialize, Serialize};
use crate::entities::WorkItemFieldValue as WorkItemFieldValueEntity;
use crate::schemas::{WorkItemField, AssignmentFieldDefinition};

/// Enum representing either a WorkItemField or AssignmentFieldDefinition
/// 
/// This allows the model to include the field definition so consumers
/// know how to display and validate the field value.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum FieldDefinition {
    WorkItemField(WorkItemField),
    AssignmentField(AssignmentFieldDefinition),
}

/// Domain model for WorkItemFieldValue
/// 
/// This represents a custom field value for a work item. The value is stored
/// as a string but can represent various types depending on the field definition.
/// The `field_definition` is populated from the associated WorkItemType to provide
/// metadata about how to display and validate this field.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkItemFieldValueModel {
    pub id: Option<String>,
    pub project_id: String,
    pub work_item_id: String,
    pub field_id: String,
    pub is_assignment_field: bool,
    pub value: String, // The actual value (can be JSON for complex types)
    pub created_at: String,
    pub updated_at: Option<String>,
    pub created_by: String,
    pub updated_by: Option<String>,
    pub is_active: bool,
    /// The field definition from the WorkItemType (populated when loading from repository)
    /// This tells consumers how to display, validate, and interpret the value
    pub field_definition: Option<FieldDefinition>,
}

impl WorkItemFieldValueModel {
    /// Convert from entity to model (without field definition)
    /// 
    /// The field definition should be populated separately by looking up
    /// the WorkItemType and finding the matching field definition.
    pub fn from_entity(entity: WorkItemFieldValueEntity) -> Self {
        Self {
            id: entity.id,
            project_id: entity.project_id,
            work_item_id: entity.work_item_id,
            field_id: entity.field_id,
            is_assignment_field: entity.is_assignment_field,
            value: entity.value,
            created_at: entity.created_at,
            updated_at: entity.updated_at,
            created_by: entity.created_by,
            updated_by: entity.updated_by,
            is_active: entity.is_active,
            field_definition: None,
        }
    }

    /// Convert from entity to model with field definition
    /// 
    /// This is the preferred method when you have the field definition available
    /// from the WorkItemType.
    pub fn from_entity_with_definition(
        entity: WorkItemFieldValueEntity,
        field_definition: FieldDefinition,
    ) -> Self {
        Self {
            id: entity.id,
            project_id: entity.project_id,
            work_item_id: entity.work_item_id,
            field_id: entity.field_id,
            is_assignment_field: entity.is_assignment_field,
            value: entity.value,
            created_at: entity.created_at,
            updated_at: entity.updated_at,
            created_by: entity.created_by,
            updated_by: entity.updated_by,
            is_active: entity.is_active,
            field_definition: Some(field_definition),
        }
    }

    /// Convert from model to entity
    /// 
    /// Note: The field_definition is not stored in the entity, only the field_id
    /// and is_assignment_field flag are persisted.
    pub fn to_entity(&self) -> WorkItemFieldValueEntity {
        WorkItemFieldValueEntity {
            id: self.id.clone(),
            project_id: self.project_id.clone(),
            work_item_id: self.work_item_id.clone(),
            field_id: self.field_id.clone(),
            is_assignment_field: self.is_assignment_field,
            value: self.value.clone(),
            created_at: self.created_at.clone(),
            updated_at: self.updated_at.clone(),
            created_by: self.created_by.clone(),
            updated_by: self.updated_by.clone(),
            is_active: self.is_active,
        }
    }
}

