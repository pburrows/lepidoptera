/// Macro to wrap Tauri commands with logging
/// 
/// This macro logs:
/// - Command entry with parameters (at debug level)
/// - Command success (at info level)
/// - Command errors (at error level with full error details)
#[macro_export]
macro_rules! log_command {
    ($command_name:literal, $($arg:expr),*) => {{
        log::debug!("[COMMAND] {} called with args: {:?}", $command_name, ($($arg),*));
        let start = std::time::Instant::now();
        
        let result = {
            $($arg)*
        };
        
        let duration = start.elapsed();
        
        match &result {
            Ok(_) => {
                log::info!("[COMMAND] {} completed successfully in {:?}", $command_name, duration);
            }
            Err(e) => {
                log::error!("[COMMAND] {} failed after {:?}: {}", $command_name, duration, e);
            }
        }
        
        result
    }};
}

/// Helper function to log command entry
pub fn log_command_entry(command_name: &str, args: &str) {
    log::debug!("[COMMAND] {} called with args: {}", command_name, args);
}

/// Helper function to log command success
pub fn log_command_success(command_name: &str, duration: std::time::Duration) {
    log::info!("[COMMAND] {} completed successfully in {:?}", command_name, duration);
}

/// Helper function to log command error
pub fn log_command_error(command_name: &str, duration: std::time::Duration, error: &dyn std::error::Error) {
    log::error!("[COMMAND] {} failed after {:?}: {}", command_name, duration, error);
}

