use std::fs;
use tauri::command;
use log::{debug, error, info};

#[tauri::command]
pub fn read_file_binary(path: String) -> Result<Vec<u8>, String> {
    let command_name = "read_file_binary";
    debug!("[COMMAND] {} called: path={}", command_name, path);
    let start = std::time::Instant::now();
    
    match fs::read(&path) {
        Ok(content) => {
            let duration = start.elapsed();
            info!("[COMMAND] {} completed successfully in {:?} ({} bytes)", command_name, duration, content.len());
            Ok(content)
        }
        Err(e) => {
            let duration = start.elapsed();
            error!("[COMMAND] {} failed after {:?}: {}", command_name, duration, e);
            Err(format!("Failed to read file: {}", e))
        }
    }
}

