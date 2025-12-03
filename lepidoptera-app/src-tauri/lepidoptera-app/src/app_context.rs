use anyhow::Result;
use db::Connection;
use std::sync::{Arc, Mutex};
use tickets::tickets_manager::SqliteTicketManager;
use tickets::tickets_port::TicketsManager;

pub struct AppContext {
    pub tickets: Arc<dyn TicketsManager>,
}

pub struct AppContextBuilder {
    // cfg: AppContext,
}

impl AppContextBuilder {
    pub fn new() -> Self {
        Self {
            // Initialize fields as needed
        }
    }

    pub fn build(self) -> Result<AppContext> {
        let db_path = "lepidoptera.db";
        let conn = Connection::new(db_path)?;
        let shared_connection = Arc::new(Mutex::new(conn));

        let tickets_manager = Arc::new(SqliteTicketManager::new(shared_connection.clone()));

        Ok(AppContext {
            tickets: tickets_manager,
        })
    }
}
