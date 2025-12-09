use crate::entities::Ticket;
use crate::repository::TicketsRepository;
use std::sync::{Arc};

pub fn create_ticket(repository: &Arc<dyn TicketsRepository>, ticket: Ticket) -> (Ticket) {
    // todo: validate ticket
    // todo: create ULID id
    
    match repository.create(ticket) {
        Ok((ticket_with_id)) => {
            (ticket_with_id)
        }
        Err(e) => panic!("Failed to create ticket, {}", e),
    }
}
