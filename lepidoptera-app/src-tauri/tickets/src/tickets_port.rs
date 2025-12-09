use anyhow::Result;
use crate::entities::Ticket;

pub trait TicketsManager: Send + Sync {
    fn get_ticket(&self, id: &str) -> Result<Option<Ticket>>;
    fn create_ticket(&self, ticket: Ticket) -> (Ticket);
}