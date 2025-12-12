use anyhow::Result;
use serde::{Deserialize, Serialize};

pub trait SettingsStore {
    fn get<T>(&self, key: &str) -> Result<Option<T>>
    where T: for<'de> Deserialize<'de>;
    fn set<T: Serialize>(&self, key: &str, value: T) -> Result<()>;
}