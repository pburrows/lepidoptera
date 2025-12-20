use rusqlite::{Row, ToSql};
use serde::{Deserialize, Serialize};
use db::repository_base::Entity;
use db::to_sql_vec;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LocalMachine {
    pub id: Option<String>,
    pub os_machine_id: String,
    pub user_id: String,
    pub name: String,
    pub registered_at: String,
    pub last_seen_at: String,
    pub last_upstream_sync_at: Option<String>,
    pub last_downstream_sync_at: Option<String>,
    pub last_ip_address: Option<String>,
    pub is_active: bool,
    pub is_duplicate: bool,
}

impl Entity for LocalMachine {
    fn table_name() -> &'static str {
        "local_machine"
    }

    fn columns() -> &'static [&'static str] {
        &[
            "id",
            "os_machine_id",
            "user_id",
            "name",
            "registered_at",
            "last_seen_at",
            "last_upstream_sync_at",
            "last_downstream_sync_at",
            "last_ip_address",
            "is_active",
            "is_duplicate",
        ]
    }

    fn from_row(row: &Row) -> rusqlite::Result<Self> {
        Ok(Self {
            id: row.get(0)?,
            os_machine_id: row.get(1)?,
            user_id: row.get(2)?,
            name: row.get(3)?,
            registered_at: row.get(4)?,
            last_seen_at: row.get(5)?,
            last_upstream_sync_at: row.get(6)?,
            last_downstream_sync_at: row.get(7)?,
            last_ip_address: row.get(8)?,
            is_active: row.get(9)?,
            is_duplicate: row.get(10)?,
        })
    }

    fn id(&self) -> Option<String> {
        self.id.clone()
    }

    fn set_id(&mut self, id: String) {
        self.id = Some(id);
    }

    fn insert_values(&self) -> Vec<Box<dyn ToSql>> {
        to_sql_vec![
            self.id.clone().unwrap_or_default(),
            self.os_machine_id.clone(),
            self.user_id.clone(),
            self.name.clone(),
            self.registered_at.clone(),
            self.last_seen_at.clone(),
            self.last_upstream_sync_at.clone(),
            self.last_downstream_sync_at.clone(),
            self.last_ip_address.clone(),
            self.is_active,
            self.is_duplicate,
        ]
    }

    fn update_values(&self) -> Vec<Box<dyn ToSql>> {
        to_sql_vec![
            self.os_machine_id.clone(),
            self.user_id.clone(),
            self.name.clone(),
            self.registered_at.clone(),
            self.last_seen_at.clone(),
            self.last_upstream_sync_at.clone(),
            self.last_downstream_sync_at.clone(),
            self.last_ip_address.clone(),
            self.is_active,
            self.is_duplicate,
        ]
    }
}

