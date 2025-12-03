use crate::entities::Ticket;

pub trait TicketsManager: Send + Sync {
    fn get_ticket(&self, id: i64) -> Option<Ticket>;
    fn create_ticket(&self, ticket: Ticket) -> (Ticket, i64);
}