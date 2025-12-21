use std::sync::Arc;
use std::sync::Mutex;
use chrono::Utc;
use ulid::Ulid;
use crate::app_context::AppContext;
use projects::entities::Project;
use tauri::State;
use serde_json::Value;
use log::{debug, error, info};

#[tauri::command]
pub fn create_project(
    state: State<'_, Mutex<Arc<AppContext>>>,
    project: CreateProjectRequest,
) -> Result<Project, String> {
    let command_name = "create_project";
    debug!("[COMMAND] {} called: name={}", command_name, project.name);
    let start = std::time::Instant::now();
    
    let ctx = match state.lock() {
        Ok(ctx) => ctx,
        Err(e) => {
            error!("[COMMAND] {} failed to lock context: {}", command_name, e);
            return Err("Failed to lock context".to_string());
        }
    };
    
    let projects_manager = ctx.projects.clone();
    drop(ctx);

    let new_project = Project {
        id: Some(Ulid::new().to_string()),
        created_at: Utc::now().to_rfc3339(),
        updated_at: None,
        name: project.name.clone(),
        description: project.description.clone(),
        is_active: project.is_active.unwrap_or(true),
    };

    match projects_manager.create_project(new_project) {
        Ok(result) => {
            let duration = start.elapsed();
            info!("[COMMAND] {} completed successfully in {:?}", command_name, duration);
            Ok(result)
        }
        Err(e) => {
            let duration = start.elapsed();
            error!("[COMMAND] {} failed after {:?}: {}", command_name, duration, e);
            Err(format!("Failed to create project: {}", e))
        }
    }
}

#[tauri::command]
pub fn set_project_setting(
    state: State<'_, Mutex<Arc<AppContext>>>,
    project_id: String,
    setting_key: String,
    setting_value: Value,
    updated_by: String,
) -> Result<Value, String> {
    let command_name = "set_project_setting";
    debug!("[COMMAND] {} called: project_id={}, setting_key={}, updated_by={}", 
           command_name, project_id, setting_key, updated_by);
    let start = std::time::Instant::now();
    
    let ctx = match state.lock() {
        Ok(ctx) => ctx,
        Err(e) => {
            error!("[COMMAND] {} failed to lock context: {}", command_name, e);
            return Err("Failed to lock context".to_string());
        }
    };
    
    let projects_manager = ctx.projects.clone();
    drop(ctx);

    match projects_manager.set_project_setting(project_id.clone(), setting_key.clone(), setting_value.clone(), updated_by.clone()) {
        Ok(_) => {
            let duration = start.elapsed();
            info!("[COMMAND] {} completed successfully in {:?}", command_name, duration);
            Ok(setting_value)
        }
        Err(e) => {
            let duration = start.elapsed();
            error!("[COMMAND] {} failed after {:?}: {}", command_name, duration, e);
            Err(format!("Failed to set project setting: {}", e))
        }
    }
}

#[derive(serde::Deserialize)]
pub struct CreateProjectRequest {
    pub name: String,
    pub description: Option<String>,
    pub is_active: Option<bool>,
}

