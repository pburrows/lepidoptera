use crate::models::{WorkItemModel, WorkItemTypeModel};
use crate::repository::WorkItemsRepository;
use crate::work_item_types_repository::WorkItemTypesRepository;
use crate::entities::WorkItemFieldValue;
use crate::work_items_manager::{validate_field_value::validate_field_value, number_range_manager::NumberRangeManager};
use crate::work_item_number_ranges_repository::WorkItemNumberRangesRepository;
use db::repository_base::GenericRepository;
use std::sync::{Arc};
use anyhow::{Result, Context};
use ulid::Ulid;
use chrono::Utc;
use db::connection_pool::ConnectionPool;

pub fn create_work_item(
    repository: &Arc<dyn WorkItemsRepository>,
    work_item_types_repository: &Arc<dyn WorkItemTypesRepository>,
    number_ranges_repository: &Arc<dyn WorkItemNumberRangesRepository>,
    pool: &Arc<ConnectionPool>,
    mut work_item: WorkItemModel,
    sequence_prefix: &str,
    machine_id: &str,
) -> Result<WorkItemModel> {
    // Get the work item type to access field definitions
    let work_item_type_entity = work_item_types_repository
        .find_by_id(&work_item.type_id)
        .context("Failed to find work item type")?;
    
    let work_item_type = match work_item_type_entity {
        Some(entity) => WorkItemTypeModel::from_entity(entity)
            .context("Failed to convert work item type entity to model")?,
        None => return Err(anyhow::anyhow!("Work item type not found: {}", work_item.type_id)),
    };

    // Validate all field values before creating the work item
    for field_value in &work_item.field_values {
        if field_value.is_assignment_field {
            // Assignment fields don't have validation rules in the same way
            // They're validated against the assignment_field_definitions
            // For now, we'll skip validation for assignment fields
            // TODO: Add validation for assignment fields if needed
            continue;
        }

        // Find the matching field definition
        let field_def = work_item_type.work_item_fields
            .iter()
            .find(|field| field.id == field_value.field_id);

        match field_def {
            Some(field) => {
                validate_field_value(field, &field_value.value)
                    .map_err(|e| anyhow::anyhow!("{}", e))?;
            }
            None => {
                return Err(anyhow::anyhow!(
                    "Field '{}' is not defined in work item type '{}'",
                    field_value.field_id,
                    work_item.type_id
                ));
            }
        }
    }

    // Generate ULID and timestamp for work item if not provided
    if work_item.id.is_none() {
        work_item.id = Some(Ulid::new().to_string());
    }
    if work_item.created_at.is_empty() {
        work_item.created_at = Utc::now().to_rfc3339();
    }

    // Generate sequential number if not provided
    if work_item.sequential_number.is_none() {
        let number_range_manager = NumberRangeManager::new(
            number_ranges_repository.clone(),
            pool.clone(),
        );
        let sequential_number_raw = number_range_manager.get_next_number(
            &work_item.project_id,
            machine_id,
        )?;
        // Format as <sequence_prefix>-<number> where number has at least four digits
        let formatted_number = format!("{}-{:04}", sequence_prefix, sequential_number_raw);
        work_item.sequential_number = Some(formatted_number);
    }

    // Convert model to entity
    let entity = work_item.to_entity();
    
    // Create in repository
    let created_entity = repository.create(entity)?;
    
    // Get the created work item ID
    let work_item_id = created_entity.id.as_ref()
        .ok_or_else(|| anyhow::anyhow!("Work item was created but has no ID"))?;

    // Create field values
    let field_value_repository = GenericRepository::<WorkItemFieldValue>::new(pool.clone());
    let mut created_field_values = Vec::new();

    for field_value_model in &work_item.field_values {
        // Generate ULID and timestamp for field value if not provided
        let mut field_value_entity = field_value_model.to_entity();
        if field_value_entity.id.is_none() {
            field_value_entity.id = Some(Ulid::new().to_string());
        }
        if field_value_entity.created_at.is_empty() {
            field_value_entity.created_at = Utc::now().to_rfc3339();
        }
        // Ensure project_id and work_item_id are set correctly
        field_value_entity.project_id = work_item.project_id.clone();
        field_value_entity.work_item_id = work_item_id.clone();
        // Ensure created_by is set (use work_item's created_by if field_value doesn't have it)
        if field_value_entity.created_by.is_empty() {
            field_value_entity.created_by = work_item.created_by.clone();
        }
        field_value_entity.is_active = true;

        // Create the field value entity
        let created_field_value_entity = field_value_repository.create(field_value_entity, None)
            .context("Failed to create work item field value")?;
        
        // Convert back to model (we'll need to add the field definition later if needed)
        created_field_values.push(crate::models::WorkItemFieldValueModel::from_entity(
            created_field_value_entity
        ));
    }

    // Create the hydrated work item model with field values
    Ok(WorkItemModel::from_entity_with_field_values(
        created_entity,
        created_field_values,
    ))
}

