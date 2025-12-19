//! Domain models (DTOs) for WorkItems
//!
//! This module contains Data Transfer Objects (DTOs) that represent work items
//! in a domain-friendly format. These models have hydrated JSON fields and
//! are optimized for business logic consumption, as opposed to entities which
//! are optimized for database storage.

pub mod work_item_type;
pub mod work_item;
pub mod work_item_field_value;
pub mod work_item_query;

pub use work_item_type::WorkItemTypeModel;
pub use work_item::WorkItemModel;
pub use work_item_field_value::{WorkItemFieldValueModel, FieldDefinition};
pub use work_item_query::{
    WorkItemQuery, WorkItemListRequest, WorkItemListItem, WorkItemListResponse,
    FieldValueQuery, SortField, SortDirection,
};

