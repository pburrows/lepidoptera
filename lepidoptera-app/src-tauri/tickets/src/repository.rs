use crate::entities::Ticket;
use anyhow::Result;

pub trait TicketsRepository: Send + Sync {
    fn find_by_id(&self, id: &str) -> Result<Option<Ticket>>;

    fn create(&self, ticket: Ticket) -> Result<(Ticket)>;
}