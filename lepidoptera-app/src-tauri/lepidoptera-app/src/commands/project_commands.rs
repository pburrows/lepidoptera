use std::sync::Arc;
use std::sync::Mutex;
use chrono::Utc;
use ulid::Ulid;
use crate::app_context::AppContext;
use projects::entities::Project;
use tauri::State;
use serde_json::Value;

#[tauri::command]
pub fn create_project(
    state: State<'_, Mutex<Arc<AppContext>>>,
    project: CreateProjectRequest,
) -> Result<Project, String> {
    let ctx = state.lock().map_err(|_| "Failed to lock context")?;
    let projects_manager = ctx.projects.clone();
    drop(ctx);

    let new_project = Project {
        id: Some(Ulid::new().to_string()),
        created_at: Utc::now().to_rfc3339(),
        updated_at: None,
        name: project.name,
        description: project.description,
        is_active: project.is_active.unwrap_or(true),
    };

    projects_manager
        .create_project(new_project)
        .map_err(|e| format!("Failed to create project: {}", e))
}

#[tauri::command]
pub fn set_project_setting(
    state: State<'_, Mutex<Arc<AppContext>>>,
    project_id: String,
    setting_key: String,
    setting_value: Value,
    updated_by: String,
) -> Result<Value, String> {
    let ctx = state.lock().map_err(|_| "Failed to lock context")?;
    let projects_manager = ctx.projects.clone();
    drop(ctx);

    projects_manager
        .set_project_setting(project_id, setting_key, setting_value.clone(), updated_by)
        .map_err(|e| format!("Failed to set project setting: {}", e))?;

    Ok(setting_value)
}

#[derive(serde::Deserialize)]
pub struct CreateProjectRequest {
    pub name: String,
    pub description: Option<String>,
    pub is_active: Option<bool>,
}

