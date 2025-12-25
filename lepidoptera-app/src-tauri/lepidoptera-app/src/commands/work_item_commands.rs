use std::sync::Arc;
use std::sync::Mutex;
use crate::app_context::AppContext;
use work_items::models::{WorkItemModel, WorkItemTypeModel};
use tauri::State;
use log::{debug, error, info};

#[tauri::command]
pub fn create_work_item(
    state: State<'_, Mutex<Arc<AppContext>>>,
    work_item: WorkItemModel,
    sequence_prefix: String,
    machine_id: String,
) -> Result<WorkItemModel, String> {
    let command_name = "create_work_item";
    debug!("[COMMAND] {} called: sequence_prefix={}, machine_id={}", command_name, sequence_prefix, machine_id);
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
    
    match work_items_manager.create_work_item(work_item, &sequence_prefix, &machine_id) {
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

