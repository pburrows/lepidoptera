use serde::{Deserialize, Serialize};

/// Schema for `allowed_children_type_ids` field
/// Represents a list of WorkItemType IDs that can be children of this type
pub type AllowedChildrenTypeIds = Vec<String>;

/// Schema for `allowed_statuses` field
/// Represents the allowed status values for work items of this type
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AllowedStatus {
    pub id: String,
    pub label: String,
    pub description: Option<String>,
    pub color: Option<String>,
}

pub type AllowedStatuses = Vec<AllowedStatus>;

/// Schema for `allowed_priorities` field
/// Represents the allowed priority values for work items of this type
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AllowedPriority {
    pub id: String,
    pub label: String,
    pub value: i32,
    pub color: Option<String>,
}

pub type AllowedPriorities = Vec<AllowedPriority>;

/// Schema for `assignment_field_definitions` field
/// Defines custom assignment fields for work items of this type
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AssignmentFieldDefinition {
    pub id: String,
    pub label: String,
    pub field_type: String, // e.g., "person", "team", "custom"
    pub required: bool,
    pub default_value: Option<String>,
}

pub type AssignmentFieldDefinitions = Vec<AssignmentFieldDefinition>;

/// Schema for `work_item_details` field
/// Additional metadata and configuration for work items of this type
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkItemDetails {
    pub icon: Option<String>,
    pub color: Option<String>,
    pub description: Option<String>,
    pub default_fields: Option<Vec<String>>,
    #[serde(flatten)]
    pub custom: serde_json::Value, // Allow additional custom fields
}

/// Schema for `work_item_fields` field
/// Defines custom fields available for work items of this type
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkItemField {
    pub id: String,
    pub label: String,
    pub field_type: String, // e.g., "text", "number", "date", "select", etc.
    pub required: bool,
    pub default_value: Option<serde_json::Value>,
    pub validation: Option<FieldValidation>,
    pub options: Option<Vec<FieldOption>>, // For select/radio fields
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FieldValidation {
    pub min: Option<f64>,
    pub max: Option<f64>,
    pub pattern: Option<String>,
    pub min_length: Option<usize>,
    pub max_length: Option<usize>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FieldOption {
    pub value: String,
    pub label: String,
}

pub type WorkItemFields = Vec<WorkItemField>;

