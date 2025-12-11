use std::sync::{Arc, Mutex};
use crate::app_context::AppContextBuilder;
use tauri::Manager;
use crate::commands::ticket_commands::create_ticket;

mod app_context;
mod commands;

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
            let ctx = Arc::new(AppContextBuilder::new().build()?);
            app.manage(Mutex::new(ctx));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet, create_ticket])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
