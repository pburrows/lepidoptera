use crate::entities::Person;
use crate::people_sqlite_repository::PeopleRepository;
use anyhow::Result;
use std::sync::Arc;

pub fn get_all_persons(
    repository: &Arc<dyn PeopleRepository>,
) -> Result<Vec<Person>> {
    repository.find_all()
}

