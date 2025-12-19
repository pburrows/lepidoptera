use serde::{Deserialize, Serialize};
use crate::schemas::{
    AllowedChildrenTypeIds,
    AllowedStatuses,
    AllowedPriorities,
    AssignmentFieldDefinitions,
    WorkItemDetails,
    WorkItemFields,
};
use crate::entities::WorkItemType as WorkItemTypeEntity;
use anyhow::{Result, Context};

/// Domain model for WorkItemType with hydrated JSON fields
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkItemTypeModel {
    pub id: Option<String>,
    pub project_id: String,
    pub created_at: String,
    pub updated_at: Option<String>,
    pub is_active: bool,
    // Hydrated JSON fields
    pub allowed_children_type_ids: AllowedChildrenTypeIds,
    pub allowed_statuses: AllowedStatuses,
    pub allowed_priorities: AllowedPriorities,
    pub assignment_field_definitions: AssignmentFieldDefinitions,
    pub work_item_details: WorkItemDetails,
    pub work_item_fields: WorkItemFields,
}

impl WorkItemTypeModel {
    /// Convert from entity (storage format) to model (domain format)
    pub fn from_entity(entity: WorkItemTypeEntity) -> Result<Self> {
        Ok(Self {
            id: entity.id,
            project_id: entity.project_id,
            created_at: entity.created_at,
            updated_at: entity.updated_at,
            is_active: entity.is_active,
            allowed_children_type_ids: serde_json::from_str(&entity.allowed_children_type_ids)
                .context("Failed to parse allowed_children_type_ids")?,
            allowed_statuses: serde_json::from_str(&entity.allowed_statuses)
                .context("Failed to parse allowed_statuses")?,
            allowed_priorities: serde_json::from_str(&entity.allowed_priorities)
                .context("Failed to parse allowed_priorities")?,
            assignment_field_definitions: serde_json::from_str(&entity.assignment_field_definitions)
                .context("Failed to parse assignment_field_definitions")?,
            work_item_details: serde_json::from_str(&entity.work_item_details)
                .context("Failed to parse work_item_details")?,
            work_item_fields: serde_json::from_str(&entity.work_item_fields)
                .context("Failed to parse work_item_fields")?,
        })
    }

    /// Convert from model (domain format) to entity (storage format)
    pub fn to_entity(&self) -> Result<WorkItemTypeEntity> {
        Ok(WorkItemTypeEntity {
            id: self.id.clone(),
            project_id: self.project_id.clone(),
            created_at: self.created_at.clone(),
            updated_at: self.updated_at.clone(),
            is_active: self.is_active,
            allowed_children_type_ids: serde_json::to_string(&self.allowed_children_type_ids)
                .context("Failed to serialize allowed_children_type_ids")?,
            allowed_statuses: serde_json::to_string(&self.allowed_statuses)
                .context("Failed to serialize allowed_statuses")?,
            allowed_priorities: serde_json::to_string(&self.allowed_priorities)
                .context("Failed to serialize allowed_priorities")?,
            assignment_field_definitions: serde_json::to_string(&self.assignment_field_definitions)
                .context("Failed to serialize assignment_field_definitions")?,
            work_item_details: serde_json::to_string(&self.work_item_details)
                .context("Failed to serialize work_item_details")?,
            work_item_fields: serde_json::to_string(&self.work_item_fields)
                .context("Failed to serialize work_item_fields")?,
        })
    }
}

