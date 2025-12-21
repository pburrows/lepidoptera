use std::sync::Arc;
use crate::entities::Person;
use crate::people_sqlite_repository::PeopleRepository;
use anyhow::Result;

pub fn get_person_by_id(repository: &Arc<dyn PeopleRepository>, id: String) -> Result<Option<Person>> {
    repository.find_by_id(id.as_str())
}

