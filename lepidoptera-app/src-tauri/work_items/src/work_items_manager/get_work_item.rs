use std::sync::{Arc, Mutex};
use db::Connection;
use crate::models::{WorkItemModel, WorkItemTypeModel, WorkItemFieldValueModel, FieldDefinition};
use crate::repository::WorkItemsRepository;
use crate::work_item_types_repository::WorkItemTypesRepository;
use crate::entities::WorkItemFieldValue;
use anyhow::{Result, Context};
use db::repository_base::Entity;

pub fn get_work_item(
    repository: &Arc<dyn WorkItemsRepository>,
    work_item_types_repository: &Arc<dyn WorkItemTypesRepository>,
    connection: &Arc<Mutex<Connection>>,
    id: &str,
) -> Result<Option<WorkItemModel>> {
    // Get the work item entity
    let work_item_entity = match repository.find_by_id(id)? {
        Some(entity) => entity,
        None => return Ok(None),
    };

    // Get the work item type to access field definitions
    let work_item_type_entity = work_item_types_repository
        .find_by_id(&work_item_entity.type_id)
        .context("Failed to find work item type")?;
    
    let work_item_type = match work_item_type_entity {
        Some(entity) => WorkItemTypeModel::from_entity(entity)
            .context("Failed to convert work item type entity to model")?,
        None => return Err(anyhow::anyhow!("Work item type not found: {}", work_item_entity.type_id)),
    };

    // Query field values for this work item
    let conn = connection.lock()
        .map_err(|e| anyhow::anyhow!("Failed to lock connection: {}", e))?;
    
    let param: &dyn db::ToSql = &id;
    let params = &[param];
    
    let field_value_entities = conn.query(
        "SELECT id, project_id, work_item_id, field_id, is_assignment_field, value, 
                created_at, updated_at, created_by, updated_by, is_active
         FROM work_item_field_values 
         WHERE work_item_id = ?1 AND is_active = 1",
        params,
        |row| WorkItemFieldValue::from_row(row),
    )
    .context("Failed to query work item field values")?;

    // Convert field value entities to models with field definitions
    let field_values: Vec<WorkItemFieldValueModel> = field_value_entities
        .into_iter()
        .map(|entity| {
            // Find the matching field definition from the work item type
            let field_definition = if entity.is_assignment_field {
                // Look in assignment_field_definitions
                work_item_type.assignment_field_definitions
                    .iter()
                    .find(|def| def.id == entity.field_id)
                    .map(|def| FieldDefinition::AssignmentField(def.clone()))
            } else {
                // Look in work_item_fields
                work_item_type.work_item_fields
                    .iter()
                    .find(|field| field.id == entity.field_id)
                    .map(|field| FieldDefinition::WorkItemField(field.clone()))
            };

            // Create the model with field definition if found
            match field_definition {
                Some(def) => WorkItemFieldValueModel::from_entity_with_definition(entity, def),
                None => WorkItemFieldValueModel::from_entity(entity),
            }
        })
        .collect();

    // Create the hydrated work item model
    Ok(Some(WorkItemModel::from_entity_with_field_values(
        work_item_entity,
        field_values,
    )))
}

