use crate::app_context::AppContextBuilder;
use crate::commands::work_item_commands::create_work_item;
use crate::settings::local_settings_store::LocalSettingsStore;
use std::sync::{Arc, Mutex};
use tauri::Manager;
use crate::commands::navigation_commands::{get_navigation, get_projects};

mod app_context;
mod commands;
mod settings;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .setup(|app| {
            let app_handle = app.handle();
            let settings_store = LocalSettingsStore::new(app_handle)?;

            let ctx = Arc::new(AppContextBuilder::new(settings_store).build(app_handle)?);
            app.manage(Mutex::new(ctx));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet, 
            create_work_item, 
            get_navigation,
            get_projects])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
