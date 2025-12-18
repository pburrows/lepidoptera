use std::sync::Arc;
use std::sync::Mutex;
use crate::app_context::AppContext;
use work_items::entities::WorkItem;
use tauri::State;

#[tauri::command]
pub fn create_work_item(state: State<'_, Mutex<Arc<AppContext>>>, work_item: WorkItem) -> Result<WorkItem, String> {
    let ctx = state.lock().map_err(|_| "Failed to lock context")?;
    let work_items_manager = ctx.work_items.clone();
    drop(ctx);
    Ok(work_items_manager.create_work_item(work_item))
}

