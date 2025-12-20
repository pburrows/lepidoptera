use std::sync::Arc;
use std::sync::Mutex;
use crate::app_context::AppContext;
use tauri::State;
use work_items::models::WorkItemTypeTemplate;

#[tauri::command]
pub fn apply_project_template(
    state: State<'_, Mutex<Arc<AppContext>>>,
    project_id: String,
    work_item_types: Vec<WorkItemTypeTemplate>,
) -> Result<Vec<work_items::models::WorkItemTypeModel>, String> {
    let ctx = state.lock().map_err(|_| "Failed to lock context")?;
    let work_items_manager = ctx.work_items.clone();
    drop(ctx);
    
    work_items_manager.apply_template(project_id, work_item_types)
        .map_err(|e| format!("Failed to apply template: {}", e))
}

