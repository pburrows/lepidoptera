use crate::entities::Ticket;
use crate::repository::TicketsRepository;
use std::sync::{Arc};

pub fn create_ticket(repository: &Arc<dyn TicketsRepository>, ticket: Ticket) -> (Ticket, i64) {
    // todo: validate ticket
    
    match repository.create(ticket) {
        Ok((ticket_with_id, id)) => {
            (ticket_with_id, id)
        }
        Err(e) => panic!("Failed to create ticket, {}", e),
    }
}
