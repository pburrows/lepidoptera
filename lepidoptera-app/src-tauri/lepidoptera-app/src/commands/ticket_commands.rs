use std::sync::Arc;
use std::sync::Mutex;
use crate::app_context::AppContext;
use tickets::entities::Ticket;
use tauri::State;

#[tauri::command]
pub fn create_ticket(state: State<'_, Mutex<Arc<AppContext>>>, ticket: Ticket) -> Result<Ticket, String> {
    let ctx = state.lock().map_err(|_| "Failed to lock context")?;
    let tickets_manager = ctx.tickets.clone();
    drop(ctx);
    Ok(tickets_manager.create_ticket(ticket))
}
