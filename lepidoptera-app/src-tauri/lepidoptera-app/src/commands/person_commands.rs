use std::sync::Arc;
use std::sync::Mutex;
use chrono::Utc;
use ulid::Ulid;
use crate::app_context::AppContext;
use people::entities::Person;
use tauri::State;
use log::{debug, error, info};

#[tauri::command]
pub fn ensure_initial_user(
    state: State<'_, Mutex<Arc<AppContext>>>,
) -> Result<Option<Person>, String> {
    let command_name = "ensure_initial_user";
    debug!("[COMMAND] {} called", command_name);
    let start = std::time::Instant::now();
    
    let ctx = match state.lock() {
        Ok(ctx) => ctx,
        Err(e) => {
            error!("[COMMAND] {} failed to lock context: {}", command_name, e);
            return Err("Failed to lock context".to_string());
        }
    };
    
    let people_manager = ctx.people.clone();
    drop(ctx);
    
    // Check if any persons exist
    let persons = match people_manager.get_persons() {
        Ok(persons) => persons,
        Err(e) => {
            error!("[COMMAND] {} failed to get persons: {}", command_name, e);
            return Err(format!("Failed to get persons: {}", e));
        }
    };
    
    // If persons exist, nothing to do
    if !persons.is_empty() {
        let duration = start.elapsed();
        debug!("[COMMAND] {} completed: persons already exist ({} persons)", command_name, persons.len());
        return Ok(None);
    }
    
    // Create default person
    info!("[COMMAND] {} creating default person", command_name);
    let default_person = Person {
        id: Some(Ulid::new().to_string()),
        created_at: Utc::now().to_rfc3339(),
        updated_at: None,
        display_name: "[ChangeMe]".to_string(),
        is_active: true,
    };
    
    let created_person = match people_manager.create_person(default_person) {
        Ok(person) => person,
        Err(e) => {
            error!("[COMMAND] {} failed to create default person: {}", command_name, e);
            return Err(format!("Failed to create default person: {}", e));
        }
    };
    
    let duration = start.elapsed();
    info!("[COMMAND] {} completed successfully in {:?} (created default person)", command_name, duration);
    Ok(Some(created_person))
}

