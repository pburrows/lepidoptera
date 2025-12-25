use tauri::{AppHandle, Manager, WebviewUrl, Listener};
use log::{debug, error, info, warn};
use url::form_urlencoded;

/// Opens a new window with the specified route
/// 
/// # Arguments
/// * `app` - The Tauri application handle
/// * `route` - The route path to load in the new window (e.g., "/work-items/new/edit")
/// * `title` - Optional window title. If not provided, a default title will be used
/// * `label` - Optional unique label for the window. If not provided, a label will be generated from the route
/// 
/// # Returns
/// Returns Ok(()) if the window was created successfully, or an error message
/// 
/// # Note
/// This command is async to avoid deadlocks on Windows. WebviewWindowBuilder::build() deadlocks
/// when used in synchronous commands on Windows. See:
/// https://docs.rs/tauri/latest/tauri/webview/struct.WebviewWindowBuilder.html#method.new
#[tauri::command]
pub async fn open_new_window(
    app: AppHandle,
    route: String,
    title: Option<String>,
    label: Option<String>,
    active_project_id: Option<String>,
) -> Result<(), String> {
    let command_name = "open_new_window";
    debug!("[{}] Opening new window: route={}, title={:?}, label={:?}", 
        command_name, route, title, label);
    let start = std::time::Instant::now();
    
    // Generate a unique label if not provided
    let window_label = label.unwrap_or_else(|| {
        // Create a label from the route by replacing slashes and special chars
        format!("window-{}", route.replace('/', "-").replace(' ', "-").replace('$', ""))
    });
    
    // Use provided title or generate one from the route
    let window_title = title.unwrap_or_else(|| {
        // Extract a readable title from the route
        let parts: Vec<&str> = route.trim_start_matches('/').split('/').collect();
        if parts.is_empty() {
            "New Window".to_string()
        } else {
            // Capitalize first letter of each part and join
            parts.iter()
                .map(|part| {
                    let mut chars = part.chars();
                    match chars.next() {
                        None => String::new(),
                        Some(first) => first.to_uppercase().collect::<String>() + chars.as_str(),
                    }
                })
                .collect::<Vec<String>>()
                .join(" ")
        }
    });
    
    // Check if window already exists
    if let Some(existing_window) = app.get_webview_window(&window_label) {
        debug!("[{}] Window '{}' already exists, focusing it", command_name, window_label);
        if let Err(e) = existing_window.set_focus() {
            error!("[{}] Failed to focus existing window: {}", command_name, e);
            return Err(format!("Failed to focus existing window: {}", e));
        }
        info!("[{}] Focused existing window '{}'", command_name, window_label);
        return Ok(());
    }
    
    // Get the current window to determine the base URL and position
    let current_window = app.get_webview_window("main")
        .ok_or_else(|| {
            error!("[{}] Could not find main window", command_name);
            "Could not find main window".to_string()
        })?;
    
    // Get the current window's position to place the new window at the same location
    let parent_position = current_window.outer_position()
        .map_err(|e| {
            error!("[{}] Failed to get parent window position: {}", command_name, e);
            format!("Failed to get parent window position: {}", e)
        })?;
    
    // Get the current window's URL to construct the new URL
    let current_url = current_window.url()
        .map_err(|e| {
            error!("[{}] Failed to get current window URL: {}", command_name, e);
            format!("Failed to get current window URL: {}", e)
        })?;
    
    // Build query parameters: dialog=true and optionally activeProjectId
    let mut query_params = vec!["dialog=true".to_string()];
    if let Some(project_id) = active_project_id {
        // URL encode the project ID using form_urlencoded (proper for query parameters)
        let encoded_id: String = form_urlencoded::byte_serialize(project_id.as_bytes()).collect();
        query_params.push(format!("activeProjectId={}", encoded_id));
    }
    let query_string = query_params.join("&");
    
    // Add query parameters to the route
    let route_with_params = if route.contains('?') {
        format!("{}&{}", route, query_string)
    } else {
        format!("{}?{}", route, query_string)
    };
    
    // Join the route to the current URL's base to create the full URL
    let full_url = current_url.join(&route_with_params)
        .map_err(|e| {
            error!("[{}] Failed to join route '{}' to current URL: {}", command_name, route_with_params, e);
            format!("Failed to join route '{}' to current URL: {}", route_with_params, e)
        })?;
    
    debug!("[{}] Creating window: label={}, title={}, url={}, position=({}, {})", 
        command_name, window_label, window_title, full_url, parent_position.x, parent_position.y);
    
    // Create new window URL
    // Always use External for full URLs (including localhost) to ensure query parameters work correctly
    let webview_url = WebviewUrl::External(full_url);
    
    let builder = tauri::WebviewWindowBuilder::new(&app, &window_label, webview_url)
        .title(&window_title)
        .inner_size(900.0, 800.0)
        .position((parent_position.x + 20) as f64, (parent_position.y + 20) as f64)
        .resizable(true)
        .minimizable(true)
        .maximizable(true)
        .closable(true)
        .visible(true);
    
    match builder.build() {
        Ok(window) => {
            // Set up event listeners
            {
                let window_label_clone = window_label.clone();
                window.listen("tauri://close-requested", move |_event| {
                    debug!("[WINDOW] {} close requested", window_label_clone);
                });
            }
            
            {
                let window_label_clone = window_label.clone();
                window.listen("tauri://focus", move |_event| {
                    debug!("[WINDOW] {} focused", window_label_clone);
                });
            }
            
            {
                let window_label_clone = window_label.clone();
                window.listen("tauri://blur", move |_event| {
                    debug!("[WINDOW] {} blurred", window_label_clone);
                });
            }
            
            // Show and focus the window
            if let Err(e) = window.show() {
                warn!("[{}] Failed to show window: {}", command_name, e);
            }
            
            if let Err(e) = window.set_focus() {
                warn!("[{}] Failed to focus window: {}", command_name, e);
            }
            
            let duration = start.elapsed();
            info!("[{}] Created window '{}' successfully in {:?}", command_name, window_label, duration);
            Ok(())
        }
        Err(e) => {
            let duration = start.elapsed();
            error!("[{}] Failed to create window after {:?}: {}", command_name, duration, e);
            Err(format!("Failed to create window: {}", e))
        }
    }
}

