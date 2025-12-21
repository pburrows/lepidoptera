use std::fs::create_dir_all;
use crate::settings::local_settings_store::LocalSettingsStore;
use anyhow::Result;
use db::connection_pool::ConnectionPool;

use std::sync::Arc;
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
use attachment_store::attachment_ports::AttachmentsManager;
use attachment_store::attachments_manager::manager::SqliteAttachmentsManager;
use people::people_ports::PersonManager;
use people::people_manager::manager::SqlitePeopleManager;
use crate::settings::settings_store::SettingsStore;

pub struct AppContext {
    pub work_items: Arc<dyn WorkItemsManager>,
    pub projects: Arc<dyn ProjectsManager>,
    pub documents: Arc<dyn DocumentsManager>,
    pub sync: Arc<dyn SyncManager>,
    pub attachments: Arc<dyn AttachmentsManager>,
    pub people: Arc<dyn PersonManager>,
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

        // Create connection pool (initial: 2 connections, max: 10)
        let connection_pool = Arc::new(ConnectionPool::new(dp_path.clone(), 2, 10)?);

        let work_items_manager = Arc::new(SqliteWorkItemManager::new(connection_pool.clone()));
        let projects_manager = Arc::new(SqliteProjectsManager::new(connection_pool.clone()));
        let documents_manager = Arc::new(SqliteDocumentsManager::new(connection_pool.clone()));
        let sync_manager = Arc::new(SqliteSyncManager::new(connection_pool.clone()));
        let attachments_manager = Arc::new(SqliteAttachmentsManager::new(connection_pool.clone()));
        let people_manager = Arc::new(SqlitePeopleManager::new(connection_pool.clone()));
        let local_machine = sync_manager.get_local_machine()?;
        // println!("Local machine: {:?}", local_machine);

        Ok(AppContext {
            work_items: work_items_manager,
            projects: projects_manager,
            documents: documents_manager,
            sync: sync_manager,
            attachments: attachments_manager,
            people: people_manager,
            local_settings: self.settings,
        })
    }
}
