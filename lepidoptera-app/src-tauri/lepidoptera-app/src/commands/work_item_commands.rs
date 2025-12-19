use std::sync::Arc;
use std::sync::Mutex;
use crate::app_context::AppContext;
use work_items::models::WorkItemModel;
use tauri::State;

#[tauri::command]
pub fn create_work_item(
    state: State<'_, Mutex<Arc<AppContext>>>,
    work_item: WorkItemModel,
    sequence_prefix: String,
    machine_id: String,
) -> Result<WorkItemModel, String> {
    let ctx = state.lock().map_err(|_| "Failed to lock context")?;
    let work_items_manager = ctx.work_items.clone();
    drop(ctx);
    work_items_manager.create_work_item(work_item, &sequence_prefix, &machine_id)
        .map_err(|e| e.to_string())
}

