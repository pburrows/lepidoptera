use crate::app_context::AppContextBuilder;
use crate::commands::work_item_commands::{create_work_item, get_work_item_types_by_project, list_work_items};
use crate::commands::project_template_commands::apply_project_template;
use crate::commands::project_commands::{create_project, get_project_setting, set_project_setting, ensure_initial_project, get_project_by_id, update_project};
use crate::commands::person_commands::{ensure_initial_user, get_persons};
use crate::commands::attachment_commands::{create_attachment, get_attachment};
use crate::commands::file_commands::read_file_binary;
use crate::commands::window_commands::open_new_window;
use crate::settings::local_settings_store::LocalSettingsStore;
use std::sync::{Arc, Mutex};
use tauri::Manager;
use crate::commands::navigation_commands::{get_navigation, get_projects};
use tauri_plugin_log::{Target, TargetKind};

mod app_context;
mod commands;
mod settings;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    log::debug!("[COMMAND] greet called: name={}", name);
    let result = format!("Hello, {}! You've been greeted from Rust!", name);
    log::info!("[COMMAND] greet completed successfully");
    result
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::new()
                .clear_targets()
                .target(Target::new(TargetKind::Stdout))
                .target(Target::new(TargetKind::LogDir {
                    file_name: Some("lepidoptera".to_string()),
                }))
                .level(log::LevelFilter::Info)
                .level_for("lepidoptera_app", log::LevelFilter::Debug)
                .level_for("db", log::LevelFilter::Debug)
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .setup(|app| {
            log::info!("Initializing Lepidoptera application");
            let app_handle = app.handle();
            let settings_store = LocalSettingsStore::new(app_handle)?;

            let ctx = Arc::new(AppContextBuilder::new(settings_store).build(app_handle)?);
            app.manage(Mutex::new(ctx));
            log::info!("Application context initialized successfully");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet, 
            create_work_item,
            get_work_item_types_by_project,
            list_work_items,
            get_navigation,
            get_projects,
            create_project,
            get_project_by_id,
            update_project,
            get_project_setting,
            set_project_setting,
            apply_project_template,
            ensure_initial_project,
            ensure_initial_user,
            get_persons,
            create_attachment,
            get_attachment,
            read_file_binary,
            open_new_window])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
