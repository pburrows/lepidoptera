use std::fs::create_dir_all;
use crate::settings::local_settings_store::LocalSettingsStore;
use anyhow::Result;
use db::Connection;

use std::sync::{Arc, Mutex};
use tauri::{AppHandle, Manager};
use tauri::path::BaseDirectory;
use work_items::work_items_port::WorkItemsManager;
use work_items::work_items_manager::manager::SqliteWorkItemManager;
use documents::docuent_ports::DocumentsManager;
use documents::documents_manager::manager::SqliteDocumentsManager;
use projects::project_ports::ProjectsManager;
use projects::projects_manager::manager::SqliteProjectsManager;
use sync::sync_ports::SyncManager;
use sync::sync_manager::manager::SqliteSyncManager;
use crate::settings::settings_store::SettingsStore;

pub struct AppContext {
    pub work_items: Arc<dyn WorkItemsManager>,
    pub projects: Arc<dyn ProjectsManager>,
    pub documents: Arc<dyn DocumentsManager>,
    pub sync: Arc<dyn SyncManager>,
    pub local_settings: LocalSettingsStore,
}

pub struct AppContextBuilder {
    // cfg: AppContext,
    settings: LocalSettingsStore,
}

impl AppContextBuilder {
    pub fn new(settings_store: LocalSettingsStore) -> Self {
        Self {
            // Initialize fields as needed
            settings: settings_store,
        }
    }

    pub fn build(self, app_handle: &AppHandle) -> Result<AppContext> {
        let mru_workspace: String = self.settings.get("mru_workspace_path")?.unwrap_or_default();

        let dp_path = if mru_workspace.is_empty() {
            let base_dir = app_handle.path().resolve("workspaces", BaseDirectory::AppLocalData)?;
            let default_path = base_dir
                .join("default_workspace.db");

            if let Some(parent) = default_path.parent() {
                create_dir_all(parent)?;
            }

            default_path.to_string_lossy().to_string()
        } else {
            mru_workspace
        };

        // let db_path = "lepidoptera.db";
        let conn = Connection::new(dp_path.as_str())?;
        let shared_connection = Arc::new(Mutex::new(conn));

        let work_items_manager = Arc::new(SqliteWorkItemManager::new(shared_connection.clone()));
        let projects_manager = Arc::new(SqliteProjectsManager::new(shared_connection.clone()));
        let documents_manager = Arc::new(SqliteDocumentsManager::new(shared_connection.clone()));
        let sync_manager = Arc::new(SqliteSyncManager::new(shared_connection.clone()));
        let local_machine = sync_manager.get_local_machine()?;
        // println!("Local machine: {:?}", local_machine);

        Ok(AppContext {
            work_items: work_items_manager,
            projects: projects_manager,
            documents: documents_manager,
            sync: sync_manager,
            local_settings: self.settings,
        })
    }
}
