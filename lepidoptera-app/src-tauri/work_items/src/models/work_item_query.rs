use serde::{Deserialize, Serialize};
use crate::schemas::{AllowedStatus, AllowedPriority};

/// Query criteria for filtering work items by field values
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FieldValueQuery {
    /// The field ID to query (from WorkItemField or AssignmentFieldDefinition)
    pub field_id: String,
    /// Whether this is an assignment field
    pub is_assignment_field: bool,
    /// The value to match (exact match for now, can be extended for operators)
    pub value: String,
}

/// Sort direction for query results
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SortDirection {
    Asc,
    Desc,
}

/// Sort field for query results
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum SortField {
    CreatedAt,
    UpdatedAt,
    Title,
    Status,
    Priority,
    TypeId,
    /// Sort by a custom field value
    FieldValue {
        /// The field ID to sort by (from WorkItemField or AssignmentFieldDefinition)
        field_id: String,
        /// Whether this is an assignment field
        is_assignment_field: bool,
    },
}

/// Query parameters for listing work items
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkItemQuery {
    /// Filter by project ID (required - queries cannot span multiple projects)
    pub project_id: String,
    /// Filter by statuses (IN clause) - can contain one or more status IDs
    pub statuses: Option<Vec<String>>,
    /// Filter by exact priority
    pub priority: Option<i32>,
    /// Filter by minimum priority (>=)
    pub priority_min: Option<i32>,
    /// Filter by maximum priority (<=)
    pub priority_max: Option<i32>,
    /// Filter by work item type ID
    pub type_id: Option<String>,
    /// Filter by multiple type IDs
    pub type_ids: Option<Vec<String>>,
    /// Filter by assigned user ID
    pub assigned_to: Option<String>,
    /// Filter by created user ID
    pub created_by: Option<String>,
    /// Filter by title containing text (LIKE)
    pub title_contains: Option<String>,
    /// Filter by sequential numbers (IN clause) - can contain one or more formatted sequence numbers (e.g., M-0003, M-1045)
    pub sequence_numbers: Option<Vec<String>>,
    /// Filter by field values
    pub field_value_queries: Option<Vec<FieldValueQuery>>,
    /// Pagination: page number (1-indexed)
    pub page: Option<usize>,
    /// Pagination: items per page
    pub page_size: Option<usize>,
    /// Alternative pagination: limit
    pub limit: Option<usize>,
    /// Alternative pagination: offset
    pub offset: Option<usize>,
    /// Sort field
    pub sort_by: Option<SortField>,
    /// Sort direction
    pub sort_direction: Option<SortDirection>,
}

/// Requested fields to include in the response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkItemListRequest {
    /// The query parameters
    pub query: WorkItemQuery,
    /// Field IDs to include in the response (both WorkItemField and AssignmentField IDs)
    /// If None or empty, no custom fields are included
    pub include_fields: Option<Vec<String>>,
}

/// Response DTO for a work item in a list
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkItemListItem {
    /// Work item ID
    pub id: Option<String>,
    /// Work item title
    pub title: String,
    /// Work item description
    pub description: Option<String>,
    /// Status ID (from WorkItem)
    pub status: String,
    /// Created timestamp
    pub created_at: String,
    /// Updated timestamp
    pub updated_at: Option<String>,
    /// Priority value (from WorkItem)
    pub priority: i32,
    /// Created by user ID
    pub created_by: String,
    /// Assigned to user ID
    pub assigned_to: Option<String>,
    /// Project ID
    pub project_id: String,
    /// Work item type ID
    pub type_id: String,
    /// Sequential number for display (e.g., M-0003, M-1045, etc.)
    pub sequential_number: Option<String>,
    /// Hydrated status details from WorkItemType
    pub status_detail: Option<AllowedStatus>,
    /// Hydrated priority details from WorkItemType
    pub priority_detail: Option<AllowedPriority>,
    /// Requested field values (only those specified in include_fields)
    pub field_values: Vec<crate::models::WorkItemFieldValueModel>,
}

/// Paginated response for work item list
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkItemListResponse {
    /// The work items matching the query
    pub items: Vec<WorkItemListItem>,
    /// Total number of items matching the query (before pagination)
    pub total: usize,
    /// Current page number (if using page-based pagination)
    pub page: Option<usize>,
    /// Items per page (if using page-based pagination)
    pub page_size: Option<usize>,
    /// Total number of pages (if using page-based pagination)
    pub total_pages: Option<usize>,
}

