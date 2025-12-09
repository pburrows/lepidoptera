use crate::entities::Ticket;
use db::repository_base::GenericRepository;
use db::Connection;
use std::sync::{Arc, Mutex};
use crate::repository::TicketsRepository;

pub struct SqliteTicketsRepository {
    inner: GenericRepository<Ticket>,
}

impl SqliteTicketsRepository {
    pub fn new(connection: Arc<Mutex<Connection>>) -> Self {
        Self {
            inner: GenericRepository::new(connection),
        }
    }
}

impl TicketsRepository for SqliteTicketsRepository {
    fn find_by_id(&self, id: &str) -> anyhow::Result<Option<Ticket>> {
        self.inner.find_by_id(id)
    }

    fn create(&self, ticket: Ticket) -> anyhow::Result<(Ticket)> {
       self.inner.create(ticket) 
    }
}
