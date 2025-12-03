use std::sync::{Arc, Mutex};
use db::Connection;
use crate::entities::Ticket;
use crate::repository::TicketsRepository;
use crate::tickets_port::TicketsManager;
use crate::tickets_sqlite_repository::SqliteTicketsRepository;

mod create_ticket;
mod get_ticket;
pub struct SqliteTicketManager {
    repository: Arc<dyn TicketsRepository>,
}

impl SqliteTicketManager {
    pub fn new(connection: Arc<Mutex<Connection>>) -> Self {
         let repository: Arc<dyn TicketsRepository> =
            Arc::new(SqliteTicketsRepository::new(connection));
        Self { repository }
    }
}

impl TicketsManager for SqliteTicketManager {

    fn get_ticket(&self, id: i64) -> Option<Ticket> {
        get_ticket::get_ticket(&self.repository, id)
    }

    fn create_ticket(&self, ticket: Ticket) -> (Ticket, i64) {
        create_ticket::create_ticket(&self.repository, ticket)
    }
}