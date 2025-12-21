use std::sync::Arc;
use crate::entities::Person;
use crate::people_sqlite_repository::PeopleRepository;

pub fn create_person(repository: &Arc<dyn PeopleRepository>, person: Person) -> anyhow::Result<Person> {
    repository.create(person)
}

