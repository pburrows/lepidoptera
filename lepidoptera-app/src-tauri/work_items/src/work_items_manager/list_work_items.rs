use std::sync::Arc;
use db::{ToSql, connection_pool::ConnectionPool, Connection};
use crate::models::{
    WorkItemListRequest, WorkItemListResponse, WorkItemListItem, WorkItemQuery,
    WorkItemTypeModel, WorkItemFieldValueModel, FieldDefinition, SortField, SortDirection,
};
use crate::repository::WorkItemsRepository;
use crate::work_item_types_repository::WorkItemTypesRepository;
use crate::entities::{WorkItem, WorkItemFieldValue};
use anyhow::{Result, Context};
use db::repository_base::Entity;
use std::collections::{HashMap, HashSet};

/// Top-level function to list work items with flexible querying
pub fn list_work_items(
    repository: &Arc<dyn WorkItemsRepository>,
    work_item_types_repository: &Arc<dyn WorkItemTypesRepository>,
    pool: &Arc<ConnectionPool>,
    request: WorkItemListRequest,
) -> Result<WorkItemListResponse> {
    let pooled_conn = pool.get()?;
    let conn = pooled_conn.get();

    // Build query components
    let mut params: Vec<Box<dyn ToSql>> = Vec::new();
    let mut param_index = 1;
    
    let (where_clause, where_param_count) = build_where_clause(&request.query, &mut params, &mut param_index);
    let (order_by, needs_sort_join) = build_order_by_clause(&request.query);
    let limit_clause = build_limit_clause(&request.query);
    let join_clause = build_join_clause(&needs_sort_join, &mut params, &mut param_index);

    // Execute queries
    let work_item_entities = query_work_items(&conn, &join_clause, &where_clause, &order_by, &limit_clause, &params)?;
    let total = query_total_count(&conn, &where_clause, &params, where_param_count)?;
    let (page, page_size, total_pages) = calculate_pagination_info(&request.query, total);

    // Load related data
    let work_item_types = load_work_item_types(work_item_types_repository, &work_item_entities)?;
    let field_values_map = load_field_values(&conn, &work_item_entities, &request.include_fields)?;

    // Build response
    let items = build_response_items(
        work_item_entities,
        &work_item_types,
        &field_values_map,
    )?;

    Ok(WorkItemListResponse {
        items,
        total,
        page,
        page_size,
        total_pages,
    })
}

// Helper function to add a parameter and return its placeholder
fn add_param(params: &mut Vec<Box<dyn ToSql>>, param_index: &mut usize, value: Box<dyn ToSql>) -> String {
    params.push(value);
    let placeholder = format!("?{}", *param_index);
    *param_index += 1;
    placeholder
}

/// Builds the WHERE clause and returns it along with the parameter count
fn build_where_clause(
    query: &WorkItemQuery,
    params: &mut Vec<Box<dyn ToSql>>,
    param_index: &mut usize,
) -> (String, usize) {
    let mut where_clauses = Vec::new();

    // project_id is always required - queries cannot span multiple projects
    where_clauses.push(format!("project_id = {}", add_param(params, param_index, Box::new(query.project_id.clone()))));

    if let Some(statuses) = &query.statuses {
        if !statuses.is_empty() {
            let placeholders: Vec<String> = statuses.iter()
                .map(|s| add_param(params, param_index, Box::new(s.clone())))
                .collect();
            where_clauses.push(format!("status IN ({})", placeholders.join(", ")));
        }
    }

    if let Some(priority) = &query.priority {
        where_clauses.push(format!("priority = {}", add_param(params, param_index, Box::new(*priority))));
    }

    if let Some(priority_min) = &query.priority_min {
        where_clauses.push(format!("priority >= {}", add_param(params, param_index, Box::new(*priority_min))));
    }

    if let Some(priority_max) = &query.priority_max {
        where_clauses.push(format!("priority <= {}", add_param(params, param_index, Box::new(*priority_max))));
    }

    if let Some(type_id) = &query.type_id {
        where_clauses.push(format!("type_id = {}", add_param(params, param_index, Box::new(type_id.clone()))));
    }

    if let Some(type_ids) = &query.type_ids {
        if !type_ids.is_empty() {
            let placeholders: Vec<String> = type_ids.iter()
                .map(|id| add_param(params, param_index, Box::new(id.clone())))
                .collect();
            where_clauses.push(format!("type_id IN ({})", placeholders.join(", ")));
        }
    }

    if let Some(assigned_to) = &query.assigned_to {
        where_clauses.push(format!("assigned_to = {}", add_param(params, param_index, Box::new(assigned_to.clone()))));
    }

    if let Some(created_by) = &query.created_by {
        where_clauses.push(format!("created_by = {}", add_param(params, param_index, Box::new(created_by.clone()))));
    }

    if let Some(title_contains) = &query.title_contains {
        where_clauses.push(format!("title LIKE {}", add_param(params, param_index, Box::new(format!("%{}%", title_contains)))));
    }

    if let Some(sequence_numbers) = &query.sequence_numbers {
        if !sequence_numbers.is_empty() {
            let placeholders: Vec<String> = sequence_numbers.iter()
                .map(|s| add_param(params, param_index, Box::new(s.clone())))
                .collect();
            where_clauses.push(format!("sequential_number IN ({})", placeholders.join(", ")));
        }
    }

    // Handle field value queries
    if let Some(field_value_queries) = &query.field_value_queries {
        if !field_value_queries.is_empty() {
            for fv_query in field_value_queries {
                let field_id_param = add_param(params, param_index, Box::new(fv_query.field_id.clone()));
                let is_assignment_param = add_param(params, param_index, Box::new(fv_query.is_assignment_field));
                let value_param = add_param(params, param_index, Box::new(fv_query.value.clone()));
                where_clauses.push(format!(
                    "EXISTS (SELECT 1 FROM work_item_field_values wifv WHERE wifv.work_item_id = work_items.id AND wifv.field_id = {} AND wifv.is_assignment_field = {} AND wifv.value = {} AND wifv.is_active = 1)",
                    field_id_param, is_assignment_param, value_param
                ));
            }
        }
    }

    let where_clause = if where_clauses.is_empty() {
        String::new()
    } else {
        format!("WHERE {}", where_clauses.join(" AND "))
    };

    let where_param_count = params.len();
    (where_clause, where_param_count)
}

/// Builds the ORDER BY clause and returns it along with sort join info
fn build_order_by_clause(query: &WorkItemQuery) -> (String, Option<(String, bool)>) {
    match &query.sort_by {
        Some(SortField::FieldValue { field_id, is_assignment_field }) => {
            let direction = match query.sort_direction.unwrap_or(SortDirection::Asc) {
                SortDirection::Asc => "ASC",
                SortDirection::Desc => "DESC",
            };
            // When sorting by field value, we'll use a LEFT JOIN and sort by the value
            // In SQLite, NULL values sort first in ASC order and last in DESC order
            // To put NULLs last in ASC, we use: ORDER BY sort_fv.value IS NULL, sort_fv.value ASC
            // To put NULLs first in DESC, we use: ORDER BY sort_fv.value IS NULL DESC, sort_fv.value DESC
            let nulls_handling = match query.sort_direction.unwrap_or(SortDirection::Asc) {
                SortDirection::Asc => "sort_fv.value IS NULL, sort_fv.value",
                SortDirection::Desc => "sort_fv.value IS NULL DESC, sort_fv.value",
            };
            (
                format!("ORDER BY {} {}", nulls_handling, direction),
                Some((field_id.clone(), *is_assignment_field)),
            )
        }
        Some(field) => {
            let field_name = match field {
                SortField::CreatedAt => "created_at",
                SortField::UpdatedAt => "updated_at",
                SortField::Title => "title",
                SortField::Status => "status",
                SortField::Priority => "priority",
                SortField::TypeId => "type_id",
                SortField::FieldValue { .. } => unreachable!(), // Already handled above
            };
            let direction = match query.sort_direction.unwrap_or(SortDirection::Asc) {
                SortDirection::Asc => "ASC",
                SortDirection::Desc => "DESC",
            };
            (format!("ORDER BY {} {}", field_name, direction), None)
        }
        None => ("ORDER BY created_at DESC".to_string(), None),
    }
}

/// Builds the LIMIT/OFFSET clause for pagination
fn build_limit_clause(query: &WorkItemQuery) -> String {
    if let Some(limit) = query.limit {
        format!("LIMIT {}", limit)
    } else if let (Some(page), Some(page_size)) = (query.page, query.page_size) {
        let offset = (page.saturating_sub(1)) * page_size;
        format!("LIMIT {} OFFSET {}", page_size, offset)
    } else {
        String::new()
    }
}

/// Builds the JOIN clause if needed for field value sorting
fn build_join_clause(
    needs_sort_join: &Option<(String, bool)>,
    params: &mut Vec<Box<dyn ToSql>>,
    param_index: &mut usize,
) -> String {
    if let Some((field_id, is_assignment_field)) = needs_sort_join {
        let field_id_param = add_param(params, param_index, Box::new(field_id.clone()));
        let is_assignment_param = add_param(params, param_index, Box::new(*is_assignment_field));
        format!(
            "LEFT JOIN work_item_field_values sort_fv ON sort_fv.work_item_id = work_items.id AND sort_fv.field_id = {} AND sort_fv.is_assignment_field = {} AND sort_fv.is_active = 1",
            field_id_param, is_assignment_param
        )
    } else {
        String::new()
    }
}

/// Executes the main query to fetch work items
fn query_work_items(
    conn: &Connection,
    join_clause: &str,
    where_clause: &str,
    order_by: &str,
    limit_clause: &str,
    params: &[Box<dyn ToSql>],
) -> Result<Vec<WorkItem>> {
    let sql = format!(
        "SELECT work_items.id, work_items.title, work_items.description, work_items.status, work_items.created_at, work_items.updated_at, work_items.priority, work_items.created_by, work_items.assigned_to, work_items.project_id, work_items.type_id, work_items.sequential_number FROM work_items {} {} {} {}",
        join_clause, where_clause, order_by, limit_clause
    );

    let param_refs: Vec<&dyn ToSql> = params.iter().map(|p| p.as_ref()).collect();
    conn.query(
        &sql,
        &param_refs,
        |row| WorkItem::from_row(row),
    )
    .context("Failed to query work items")
}

/// Executes the count query to get total number of matching items
fn query_total_count(
    conn: &Connection,
    where_clause: &str,
    params: &[Box<dyn ToSql>],
    where_param_count: usize,
) -> Result<usize> {
    let where_param_refs: Vec<&dyn ToSql> = params.iter().take(where_param_count).map(|p| p.as_ref()).collect();
    let count_sql = format!("SELECT COUNT(*) FROM work_items {}", where_clause);
    let result = conn.query(
        &count_sql,
        &where_param_refs,
        |row| row.get::<_, i64>(0),
    )
    .context("Failed to count work items")?
    .first()
    .copied()
    .unwrap_or(0) as usize;
    Ok(result)
}

/// Calculates pagination metadata
fn calculate_pagination_info(query: &WorkItemQuery, total: usize) -> (Option<usize>, Option<usize>, Option<usize>) {
    if let (Some(p), Some(ps)) = (query.page, query.page_size) {
        let tp = (total as f64 / ps as f64).ceil() as usize;
        (Some(p), Some(ps), Some(tp))
    } else {
        (None, None, None)
    }
}

/// Loads work item types for all unique type_ids in the results
fn load_work_item_types(
    work_item_types_repository: &Arc<dyn WorkItemTypesRepository>,
    work_item_entities: &[WorkItem],
) -> Result<HashMap<String, WorkItemTypeModel>> {
    let type_ids: Vec<String> = work_item_entities.iter()
        .map(|wi| wi.type_id.clone())
        .collect::<HashSet<_>>()
        .into_iter()
        .collect();

    let mut work_item_types = HashMap::new();
    for type_id in type_ids {
        if let Some(type_entity) = work_item_types_repository.find_by_id(&type_id)? {
            if let Ok(type_model) = WorkItemTypeModel::from_entity(type_entity) {
                work_item_types.insert(type_id, type_model);
            }
        }
    }
    Ok(work_item_types)
}

/// Loads field values for work items if requested
fn load_field_values(
    conn: &Connection,
    work_item_entities: &[WorkItem],
    include_fields: &Option<Vec<String>>,
) -> Result<HashMap<String, Vec<WorkItemFieldValueModel>>> {
    let include_fields_set = include_fields.as_ref()
        .map(|f| f.iter().cloned().collect::<HashSet<_>>())
        .unwrap_or_default();

    let work_item_ids: Vec<String> = work_item_entities.iter()
        .filter_map(|wi| wi.id.as_ref().cloned())
        .collect();

    let mut field_values_map = HashMap::new();
    
    if !include_fields_set.is_empty() && !work_item_ids.is_empty() {
        // Build parameters for field value query
        let mut fv_param_index = 1;
        let mut fv_params: Vec<Box<dyn ToSql>> = Vec::new();
        
        let id_placeholders: Vec<String> = work_item_ids.iter()
            .map(|_| {
                let placeholder = format!("?{}", fv_param_index);
                fv_param_index += 1;
                placeholder
            })
            .collect();
        
        let field_id_placeholders: Vec<String> = include_fields_set.iter()
            .map(|_| {
                let placeholder = format!("?{}", fv_param_index);
                fv_param_index += 1;
                placeholder
            })
            .collect();

        fv_params.extend(work_item_ids.iter().map(|id| Box::new(id.clone()) as Box<dyn ToSql>));
        fv_params.extend(include_fields_set.iter().map(|f| Box::new(f.clone()) as Box<dyn ToSql>));

        let fv_sql = format!(
            "SELECT id, project_id, work_item_id, field_id, is_assignment_field, value, created_at, updated_at, created_by, updated_by, is_active FROM work_item_field_values WHERE work_item_id IN ({}) AND field_id IN ({}) AND is_active = 1",
            id_placeholders.join(", "),
            field_id_placeholders.join(", ")
        );

        let fv_param_refs: Vec<&dyn ToSql> = fv_params.iter().map(|p| p.as_ref()).collect();
        let fv_entities: Vec<WorkItemFieldValue> = conn.query(
            &fv_sql,
            &fv_param_refs,
            |row| WorkItemFieldValue::from_row(row),
        )
        .context("Failed to query work item field values")?;

        // Group field values by work_item_id
        for fv_entity in fv_entities {
            field_values_map
                .entry(fv_entity.work_item_id.clone())
                .or_insert_with(Vec::new)
                .push(WorkItemFieldValueModel::from_entity(fv_entity));
        }
    }

    Ok(field_values_map)
}

/// Hydrates field values with their field definitions from work item types
fn hydrate_field_values(
    field_values: &mut [WorkItemFieldValueModel],
    work_item_type: Option<&WorkItemTypeModel>,
) {
    if let Some(wit) = work_item_type {
        for fv in field_values {
            let field_definition = if fv.is_assignment_field {
                wit.assignment_field_definitions
                    .iter()
                    .find(|def| def.id == fv.field_id)
                    .map(|def| FieldDefinition::AssignmentField(def.clone()))
            } else {
                wit.work_item_fields
                    .iter()
                    .find(|field| field.id == fv.field_id)
                    .map(|field| FieldDefinition::WorkItemField(field.clone()))
            };

            if let Some(def) = field_definition {
                *fv = WorkItemFieldValueModel::from_entity_with_definition(
                    fv.to_entity(),
                    def,
                );
            }
        }
    }
}

/// Transforms work item entities into response DTOs with hydrated data
fn build_response_items(
    work_item_entities: Vec<WorkItem>,
    work_item_types: &HashMap<String, WorkItemTypeModel>,
    field_values_map: &HashMap<String, Vec<WorkItemFieldValueModel>>,
) -> Result<Vec<WorkItemListItem>> {
    let mut items = Vec::new();
    
    for entity in work_item_entities {
        let type_id = &entity.type_id;
        let work_item_type = work_item_types.get(type_id);

        // Get status detail
        let status_detail = work_item_type
            .and_then(|wit| wit.allowed_statuses.iter().find(|s| s.id == entity.status))
            .cloned();

        // Get priority detail
        let priority_detail = work_item_type
            .and_then(|wit| wit.allowed_priorities.iter().find(|p| p.value == entity.priority))
            .cloned();

        // Get field values for this work item
        let mut field_values = field_values_map
            .get(entity.id.as_ref().unwrap_or(&String::new()))
            .cloned()
            .unwrap_or_default();

        // Hydrate field values with field definitions
        hydrate_field_values(&mut field_values, work_item_type);

        items.push(WorkItemListItem {
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
            status_detail,
            priority_detail,
            field_values,
        });
    }

    Ok(items)
}
