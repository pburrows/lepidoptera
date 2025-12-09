use std::sync::Arc;
use crate::entities::Ticket;
use crate::repository::TicketsRepository;
use anyhow::Result;
pub fn get_ticket(repository: &Arc<dyn TicketsRepository>, id: &str) -> Result<Option<Ticket>> {
    repository.find_by_id(id)
}
