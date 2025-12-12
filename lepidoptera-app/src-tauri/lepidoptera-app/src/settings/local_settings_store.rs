use crate::settings::settings_store::SettingsStore;
use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use tauri::path::BaseDirectory;
use tauri::{AppHandle, Manager};

pub struct LocalSettingsStore {
    settings_path: PathBuf,
}

impl LocalSettingsStore {
    pub fn new(app_handle: &AppHandle) -> Result<Self> {
        let settings_path = app_handle.path().resolve(
            "lepidoptera_user.settings.json",
            BaseDirectory::AppLocalData,
        )?;
        Ok(Self { settings_path })
    }

    fn load_settings(&self) -> Result<HashMap<String, serde_json::Value>> {
        if !self.settings_path.exists() {
            return Ok(HashMap::new());
        }
        let contents = fs::read_to_string(&self.settings_path)?;
        let settings: HashMap<String, serde_json::Value> =
            serde_json::from_str(&contents).unwrap_or_else(|_| HashMap::new());
        Ok(settings)
    }

    fn save_settings(&self, settings: &HashMap<String, serde_json::Value>) -> Result<()> {
        if let Some(parent) = self.settings_path.parent() {
            fs::create_dir_all(parent)?;
        }

        let contents = serde_json::to_string_pretty(settings)?;
        fs::write(&self.settings_path, contents)?;
        Ok(())
    }
}

impl SettingsStore for LocalSettingsStore {
    fn get<T>(&self, key: &str) -> anyhow::Result<Option<T>>
    where T: for<'de> Deserialize<'de>
    {
        let settings = self.load_settings()?;

        match settings.get(key) {
            Some(value) => {
                let deserialized: T = serde_json::from_value(value.clone())?;
                Ok(Some(deserialized))
            }
            None => Ok(None)
        }
    }

    fn set<T: Serialize>(&self, key: &str, value: T) -> anyhow::Result<()> {
        let mut settings = self.load_settings()?;
        let json_value = serde_json::to_value(value)?;
        settings.insert(key.to_string(), json_value);
        self.save_settings(&settings)?;
        Ok(())
    }
}
