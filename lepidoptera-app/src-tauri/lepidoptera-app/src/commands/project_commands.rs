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
        created_by: "".to_string(), // todo: fill in created by correctly
        updated_by: None,
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
pub fn get_project_setting(
    state: State<'_, Mutex<Arc<AppContext>>>,
    project_id: String,
    setting_key: String,
) -> Result<Option<Value>, String> {
    let command_name = "get_project_setting";
    debug!("[COMMAND] {} called: project_id={}, setting_key={}", 
           command_name, project_id, setting_key);
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

    match projects_manager.get_project_setting(project_id, setting_key) {
        Ok(result) => {
            let duration = start.elapsed();
            info!("[COMMAND] {} completed successfully in {:?}", command_name, duration);
            Ok(result)
        }
        Err(e) => {
            let duration = start.elapsed();
            error!("[COMMAND] {} failed after {:?}: {}", command_name, duration, e);
            Err(format!("Failed to get project setting: {}", e))
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

#[tauri::command]
pub fn ensure_initial_project(
    state: State<'_, Mutex<Arc<AppContext>>>,
) -> Result<Option<Project>, String> {
    let command_name = "ensure_initial_project";
    debug!("[COMMAND] {} called", command_name);
    let start = std::time::Instant::now();
    
    let ctx = match state.lock() {
        Ok(ctx) => ctx,
        Err(e) => {
            error!("[COMMAND] {} failed to lock context: {}", command_name, e);
            return Err("Failed to lock context".to_string());
        }
    };
    
    let projects_manager = ctx.projects.clone();
    let work_items_manager = ctx.work_items.clone();
    drop(ctx);
    
    // Check if any projects exist
    let projects = match projects_manager.get_projects() {
        Ok(projects) => projects,
        Err(e) => {
            error!("[COMMAND] {} failed to get projects: {}", command_name, e);
            return Err(format!("Failed to get projects: {}", e));
        }
    };
    
    // If projects exist, nothing to do
    if !projects.is_empty() {
        let duration = start.elapsed();
        debug!("[COMMAND] {} completed: projects already exist ({} projects)", command_name, projects.len());
        return Ok(None);
    }
    
    // Create default project
    info!("[COMMAND] {} creating default project", command_name);
    let default_project = Project {
        id: Some(Ulid::new().to_string()),
        created_at: Utc::now().to_rfc3339(),
        updated_at: None,
        name: "Main".to_string(),
        description: Some("Default Lepidoptera project.".to_string()),
        is_active: true,
        created_by: "".to_string(), // todo: fill in created_by correctly
        updated_by: None,
    };
    
    let created_project = match projects_manager.create_project(default_project) {
        Ok(project) => project,
        Err(e) => {
            error!("[COMMAND] {} failed to create default project: {}", command_name, e);
            return Err(format!("Failed to create default project: {}", e));
        }
    };
    
    let project_id = match created_project.id.as_ref() {
        Some(id) => id.clone(),
        None => {
            error!("[COMMAND] {} created project without ID", command_name);
            return Err("Created project should have an ID".to_string());
        }
    };
    
    // Set the default SEQUENCE_PREFIX setting
    if let Err(e) = projects_manager.set_project_setting(
        project_id.clone(),
        "SEQUENCE_PREFIX".to_string(),
        Value::String("M".to_string()),
        "system".to_string(),
    ) {
        error!("[COMMAND] {} failed to set SEQUENCE_PREFIX: {}", command_name, e);
        // Continue anyway - this is not critical
    }
    
    // Apply the kanban template
    use crate::commands::default_kanban_template::get_default_kanban_template;
    let template = get_default_kanban_template();
    match work_items_manager.apply_template(project_id.clone(), template) {
        Ok(_) => {
            info!("[COMMAND] {} applied kanban template successfully", command_name);
        }
        Err(e) => {
            error!("[COMMAND] {} failed to apply kanban template: {}", command_name, e);
            // Continue anyway - project is created even if template fails
        }
    }
    
    let duration = start.elapsed();
    info!("[COMMAND] {} completed successfully in {:?} (created default project)", command_name, duration);
    Ok(Some(created_project))
}

#[tauri::command]
pub fn get_project_by_id(
    state: State<'_, Mutex<Arc<AppContext>>>,
    project_id: String,
) -> Result<Option<Project>, String> {
    let command_name = "get_project_by_id";
    debug!("[COMMAND] {} called: project_id={}", command_name, project_id);
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

    match projects_manager.get_project_by_id(project_id) {
        Ok(result) => {
            let duration = start.elapsed();
            info!("[COMMAND] {} completed successfully in {:?}", command_name, duration);
            Ok(result)
        }
        Err(e) => {
            let duration = start.elapsed();
            error!("[COMMAND] {} failed after {:?}: {}", command_name, duration, e);
            Err(format!("Failed to get project: {}", e))
        }
    }
}

#[tauri::command]
pub fn update_project(
    state: State<'_, Mutex<Arc<AppContext>>>,
    project: Project,
) -> Result<Project, String> {
    let command_name = "update_project";
    debug!("[COMMAND] {} called: project_id={:?}", command_name, project.id);
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

    match projects_manager.update_project(project) {
        Ok(result) => {
            let duration = start.elapsed();
            info!("[COMMAND] {} completed successfully in {:?}", command_name, duration);
            Ok(result)
        }
        Err(e) => {
            let duration = start.elapsed();
            error!("[COMMAND] {} failed after {:?}: {}", command_name, duration, e);
            Err(format!("Failed to update project: {}", e))
        }
    }
}

#[derive(serde::Deserialize)]
pub struct CreateProjectRequest {
    pub name: String,
    pub description: Option<String>,
    pub is_active: Option<bool>,
}

