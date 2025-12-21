use std::sync::Arc;
use db::connection_pool::ConnectionPool;
use crate::people_ports::PersonManager;
use crate::people_manager::{create_person, get_all_persons, get_person_by_id};
use crate::people_sqlite_repository::{PeopleRepository, PeopleSqliteRepository};

pub struct SqlitePeopleManager {
    repository: Arc<dyn PeopleRepository>,
}

impl SqlitePeopleManager {
    pub fn new(pool: Arc<ConnectionPool>) -> Self {
        let repository: Arc<dyn PeopleRepository> =
            Arc::new(PeopleSqliteRepository::new(pool));
        Self { 
            repository,
        }
    }
}

impl PersonManager for SqlitePeopleManager {
    fn get_person_by_id(&self, id: String) -> anyhow::Result<Option<crate::entities::Person>> {
        get_person_by_id::get_person_by_id(&self.repository, id)
    }

    fn get_persons(&self) -> anyhow::Result<Vec<crate::entities::Person>> {
        get_all_persons::get_all_persons(&self.repository)
    }

    fn create_person(&self, person: crate::entities::Person) -> anyhow::Result<crate::entities::Person> {
        create_person::create_person(&self.repository, person)
    }
}

