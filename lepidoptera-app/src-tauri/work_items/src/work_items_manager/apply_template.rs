use std::sync::Arc;
use std::collections::HashMap;
use crate::models::{WorkItemTypeModel, WorkItemTypeTemplate};
use crate::work_item_types_repository::WorkItemTypesRepository;
use anyhow::{Result, Context};

/// Apply a template to create work item types for a project
/// 
/// This function:
/// 1. Creates all work item types from the template
/// 2. Maps name references to actual IDs for allowed_children_type_ids
pub fn apply_template(
    repository: &Arc<dyn WorkItemTypesRepository>,
    project_id: String,
    work_item_types: Vec<WorkItemTypeTemplate>,
) -> Result<Vec<WorkItemTypeModel>> {
    // First pass: Create all work item types and build a name -> id mapping
    let mut name_to_id: HashMap<String, String> = HashMap::new();
    let mut created_types: Vec<WorkItemTypeModel> = Vec::new();

    // Create all types first (without resolving child references)
    for template_type in &work_item_types {
        let work_item_type = WorkItemTypeModel {
            id: None, // Will be generated
            project_id: project_id.clone(),
            created_at: String::new(), // Will be set by create_work_item_type
            updated_at: None,
            is_active: true,
            name: template_type.name.clone(),
            display_name: template_type.display_name.clone(),
            allowed_children_type_ids: vec![], // Will be resolved in second pass
            allowed_statuses: serde_json::from_value(serde_json::Value::Array(template_type.allowed_statuses.clone()))
                .context("Failed to parse allowed_statuses")?,
            allowed_priorities: serde_json::from_value(serde_json::Value::Array(template_type.allowed_priorities.clone()))
                .context("Failed to parse allowed_priorities")?,
            assignment_field_definitions: serde_json::from_value(serde_json::Value::Array(template_type.assignment_field_definitions.clone()))
                .context("Failed to parse assignment_field_definitions")?,
            work_item_details: serde_json::from_value(template_type.work_item_details.clone())
                .context("Failed to parse work_item_details")?,
            work_item_fields: serde_json::from_value(serde_json::Value::Array(template_type.work_item_fields.clone()))
                .context("Failed to parse work_item_fields")?,
        };

        let created = crate::work_items_manager::create_work_item_type::create_work_item_type(
            repository,
            work_item_type,
        )?;

        // Store the mapping
        let type_id = created.id.as_ref()
            .ok_or_else(|| anyhow::anyhow!("Created work item type should have an ID"))?
            .clone();
        name_to_id.insert(template_type.name.clone(), type_id.clone());
        
        created_types.push(created);
    }

    // Second pass: Update allowed_children_type_ids with actual IDs
    for (index, template_type) in work_item_types.iter().enumerate() {
        let child_ids: Vec<String> = template_type
            .allowed_children_type_names
            .iter()
            .filter_map(|name| name_to_id.get(name).cloned())
            .collect();

        // Update the created type with resolved child IDs
        let mut work_item_type = created_types[index].clone();
        work_item_type.allowed_children_type_ids = child_ids;

        // Update in repository
        let updated = crate::work_items_manager::update_work_item_type::update_work_item_type(
            repository,
            work_item_type,
        )?;

        created_types[index] = updated;
    }

    Ok(created_types)
}

