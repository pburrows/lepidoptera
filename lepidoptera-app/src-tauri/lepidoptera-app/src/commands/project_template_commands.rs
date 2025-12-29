use std::sync::Arc;
use crate::app_context::AppContext;
use tauri::State;
use work_items::models::WorkItemTypeTemplate;
use log::{debug, error, info};

#[tauri::command]
pub fn apply_project_template(
    state: State<'_, Arc<AppContext>>,
    project_id: String,
    work_item_types: Vec<WorkItemTypeTemplate>,
) -> Result<Vec<work_items::models::WorkItemTypeModel>, String> {
    let command_name = "apply_project_template";
    debug!("[COMMAND] {} called: project_id={}, work_item_types_count={}", 
           command_name, project_id, work_item_types.len());
    let start = std::time::Instant::now();
    
    let ctx = state.inner();
    let work_items_manager = ctx.work_items.clone();
    
    match work_items_manager.apply_template(project_id.clone(), work_item_types) {
        Ok(result) => {
            let duration = start.elapsed();
            info!("[COMMAND] {} completed successfully in {:?}", command_name, duration);
            Ok(result)
        }
        Err(e) => {
            let duration = start.elapsed();
            error!("[COMMAND] {} failed after {:?}: {}", command_name, duration, e);
            Err(format!("Failed to apply template: {}", e))
        }
    }
}

