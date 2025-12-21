use std::sync::Arc;
use std::sync::Mutex;
use chrono::Utc;
use ulid::Ulid;
use crate::app_context::AppContext;
use attachment_store::entities::Attachment;
use tauri::State;
use log::{debug, error, info};

#[tauri::command]
pub fn create_attachment(
    state: State<'_, Mutex<Arc<AppContext>>>,
    project_id: String,
    file_name: String,
    file_type: String,
    file_content: Vec<u8>,
    created_by: String,
) -> Result<Attachment, String> {
    let command_name = "create_attachment";
    debug!("[COMMAND] {} called: project_id={}, file_name={}, file_size={}", 
           command_name, project_id, file_name, file_content.len());
    let start = std::time::Instant::now();
    
    // Validate file size (max 2MB = 2 * 1024 * 1024 bytes)
    const MAX_FILE_SIZE: usize = 2 * 1024 * 1024;
    if file_content.len() > MAX_FILE_SIZE {
        return Err(format!("File size exceeds maximum allowed size of 2MB. File size: {} bytes", file_content.len()));
    }

    // Validate file type (PNG, JPG, GIF)
    let allowed_types = vec!["image/png", "image/jpeg", "image/jpg", "image/gif"];
    let normalized_file_type = file_type.to_lowercase();
    if !allowed_types.iter().any(|&t| normalized_file_type.contains(t)) {
        // Also check file extension as fallback
        let file_ext = file_name.split('.').last().unwrap_or("").to_lowercase();
        let allowed_extensions = vec!["png", "jpg", "jpeg", "gif"];
        if !allowed_extensions.contains(&file_ext.as_str()) {
            return Err(format!("File type not allowed. Allowed types: PNG, JPG, GIF. Got: {}", file_type));
        }
    }
    
    let ctx = match state.lock() {
        Ok(ctx) => ctx,
        Err(e) => {
            error!("[COMMAND] {} failed to lock context: {}", command_name, e);
            return Err("Failed to lock context".to_string());
        }
    };
    
    let attachments_manager = ctx.attachments.clone();
    drop(ctx);

    let attachment = Attachment {
        id: Some(Ulid::new().to_string()),
        project_id,
        created_at: Utc::now().to_rfc3339(),
        created_by,
        updated_at: None,
        updated_by: None,
        deleted_at: None,
        deleted_by: None,
        file_name,
        file_type,
        file_size: file_content.len() as u64,
        file_content,
    };

    match attachments_manager.create_attachment(attachment) {
        Ok(result) => {
            let duration = start.elapsed();
            info!("[COMMAND] {} completed successfully in {:?}", command_name, duration);
            Ok(result)
        }
        Err(e) => {
            let duration = start.elapsed();
            error!("[COMMAND] {} failed after {:?}: {}", command_name, duration, e);
            Err(format!("Failed to create attachment: {}", e))
        }
    }
}

#[tauri::command]
pub fn get_attachment(
    state: State<'_, Mutex<Arc<AppContext>>>,
    attachment_id: String,
) -> Result<Attachment, String> {
    let command_name = "get_attachment";
    debug!("[COMMAND] {} called: attachment_id={}", command_name, attachment_id);
    let start = std::time::Instant::now();
    
    let ctx = match state.lock() {
        Ok(ctx) => ctx,
        Err(e) => {
            error!("[COMMAND] {} failed to lock context: {}", command_name, e);
            return Err("Failed to lock context".to_string());
        }
    };
    
    let attachments_manager = ctx.attachments.clone();
    drop(ctx);

    match attachments_manager.get_attachment_by_id(&attachment_id) {
        Ok(Some(attachment)) => {
            let duration = start.elapsed();
            info!("[COMMAND] {} completed successfully in {:?}", command_name, duration);
            Ok(attachment)
        }
        Ok(None) => {
            let duration = start.elapsed();
            error!("[COMMAND] {} attachment not found after {:?}", command_name, duration);
            Err("Attachment not found".to_string())
        }
        Err(e) => {
            let duration = start.elapsed();
            error!("[COMMAND] {} failed after {:?}: {}", command_name, duration, e);
            Err(format!("Failed to get attachment: {}", e))
        }
    }
}

