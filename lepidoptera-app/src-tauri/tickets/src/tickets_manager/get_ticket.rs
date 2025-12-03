use std::sync::Arc;
use crate::entities::Ticket;
use crate::repository::TicketsRepository;
pub fn get_ticket(repository: &Arc<dyn TicketsRepository>, id: i64) -> Option<Ticket> {
    match repository.find_by_id(id) {
        Ok(Some(ticket)) => {Some(ticket)}
        Ok(None) => None,
        Err(e) => panic!("Failed to get ticket, {}", e)
    }
}
