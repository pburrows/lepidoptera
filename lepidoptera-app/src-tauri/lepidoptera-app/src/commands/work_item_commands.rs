use std::sync::Arc;
use std::sync::Mutex;
use crate::app_context::AppContext;
use work_items::models::{WorkItemModel, WorkItemTypeModel, WorkItemListRequest, WorkItemListResponse};
use tauri::State;
use log::{debug, error, info};
use serde_json::Value;

#[tauri::command]
pub fn create_work_item(
    state: State<'_, Mutex<Arc<AppContext>>>,
    work_item: WorkItemModel,
) -> Result<WorkItemModel, String> {
    let command_name = "create_work_item";
    debug!("[COMMAND] {} called", command_name);
    let start = std::time::Instant::now();
    
    let ctx = match state.lock() {
        Ok(ctx) => ctx,
        Err(e) => {
            error!("[COMMAND] {} failed to lock context: {}", command_name, e);
            return Err("Failed to lock context".to_string());
        }
    };
    
    // Get machine_id from local_machine (using the sync instance ID, not os_machine_id)
    // This ID is synced across machines and used to track assigned number ranges
    let machine_id = ctx.local_machine.id
        .as_ref()
        .ok_or_else(|| {
            error!("[COMMAND] {} local_machine.id is None", command_name);
            "Local machine ID is not available".to_string()
        })?
        .clone();
    
    // Get sequence_prefix from project settings
    let projects_manager = ctx.projects.clone();
    let project_id = work_item.project_id.clone();
    drop(ctx);
    
    let sequence_prefix_setting = match projects_manager.get_project_setting(project_id.clone(), "SEQUENCE_PREFIX".to_string()) {
        Ok(Some(Value::String(prefix))) => prefix,
        Ok(Some(_)) => {
            error!("[COMMAND] {} SEQUENCE_PREFIX setting is not a string", command_name);
            return Err("SEQUENCE_PREFIX setting must be a string".to_string());
        }
        Ok(None) => {
            error!("[COMMAND] {} SEQUENCE_PREFIX setting not found for project {}", command_name, project_id);
            return Err(format!("SEQUENCE_PREFIX setting not found for project. Please configure a sequence prefix for this project."));
        }
        Err(e) => {
            error!("[COMMAND] {} failed to get SEQUENCE_PREFIX setting: {}", command_name, e);
            return Err(format!("Failed to get SEQUENCE_PREFIX setting: {}", e));
        }
    };
    
    debug!("[COMMAND] {} using sequence_prefix={}, machine_id={}", command_name, sequence_prefix_setting, machine_id);
    
    let ctx = match state.lock() {
        Ok(ctx) => ctx,
        Err(e) => {
            error!("[COMMAND] {} failed to lock context: {}", command_name, e);
            return Err("Failed to lock context".to_string());
        }
    };
    
    let work_items_manager = ctx.work_items.clone();
    drop(ctx);
    
    match work_items_manager.create_work_item(work_item, &sequence_prefix_setting, &machine_id) {
        Ok(result) => {
            let duration = start.elapsed();
            info!("[COMMAND] {} completed successfully in {:?}", command_name, duration);
            Ok(result)
        }
        Err(e) => {
            let duration = start.elapsed();
            error!("[COMMAND] {} failed after {:?}: {}", command_name, duration, e);
            Err(e.to_string())
        }
    }
}

#[tauri::command]
pub fn get_work_item_types_by_project(
    state: State<'_, Mutex<Arc<AppContext>>>,
    project_id: String,
) -> Result<Vec<WorkItemTypeModel>, String> {
    let command_name = "get_work_item_types_by_project";
    debug!("[COMMAND] {} called: project_id={}", command_name, project_id);
    let start = std::time::Instant::now();
    
    let ctx = match state.lock() {
        Ok(ctx) => ctx,
        Err(e) => {
            error!("[COMMAND] {} failed to lock context: {}", command_name, e);
            return Err("Failed to lock context".to_string());
        }
    };
    
    let work_items_manager = ctx.work_items.clone();
    drop(ctx);
    
    match work_items_manager.get_work_item_types_by_project(&project_id) {
        Ok(result) => {
            let duration = start.elapsed();
            info!("[COMMAND] {} completed successfully in {:?} (found {} types)", command_name, duration, result.len());
            Ok(result)
        }
        Err(e) => {
            let duration = start.elapsed();
            error!("[COMMAND] {} failed after {:?}: {}", command_name, duration, e);
            Err(e.to_string())
        }
    }
}

#[tauri::command]
pub fn list_work_items(
    state: State<'_, Mutex<Arc<AppContext>>>,
    request: WorkItemListRequest,
) -> Result<WorkItemListResponse, String> {
    let command_name = "list_work_items";
    debug!("[COMMAND] {} called: project_id={}", command_name, request.query.project_id);
    let start = std::time::Instant::now();
    
    let ctx = match state.lock() {
        Ok(ctx) => ctx,
        Err(e) => {
            error!("[COMMAND] {} failed to lock context: {}", command_name, e);
            return Err("Failed to lock context".to_string());
        }
    };
    
    let work_items_manager = ctx.work_items.clone();
    drop(ctx);
    
    match work_items_manager.list_work_items(request) {
        Ok(result) => {
            let duration = start.elapsed();
            info!("[COMMAND] {} completed successfully in {:?} (found {} items, total: {})", 
                command_name, duration, result.items.len(), result.total);
            Ok(result)
        }
        Err(e) => {
            let duration = start.elapsed();
            error!("[COMMAND] {} failed after {:?}: {}", command_name, duration, e);
            Err(e.to_string())
        }
    }
}

