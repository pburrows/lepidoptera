use std::sync::Arc;
use db::connection_pool::ConnectionPool;
use db::repository_base::{Entity, GenericRepository};
use crate::entities::Person;
use anyhow::Result;

pub trait PeopleRepository: Send + Sync {
    fn find_by_id(&self, id: &str) -> Result<Option<Person>>;
    fn find_all(&self) -> Result<Vec<Person>>;
    fn create(&self, person: Person) -> Result<Person>;
}

pub struct PeopleSqliteRepository {
    inner: GenericRepository<Person>,
    pool: Arc<ConnectionPool>
}

impl PeopleSqliteRepository {
    pub fn new(pool: Arc<ConnectionPool>) -> Self {
        Self {
            inner: GenericRepository::new(pool.clone()),
            pool,
        }
    }
}

impl PeopleRepository for PeopleSqliteRepository {
    fn find_by_id(&self, id: &str) -> Result<Option<Person>> {
        self.inner.find_by_id(id, None)
    }

    fn find_all(&self) -> Result<Vec<Person>> {
        let pooled_conn = self.pool.get()?;
        let conn = pooled_conn.get();
        let results = conn.query(
            &format!("SELECT * FROM {} WHERE is_active = 1", Person::table_name()),
            &[],
            |row| Person::from_row(row),
        )?;
        Ok(results)
    }

    fn create(&self, person: Person) -> Result<Person> {
       self.inner.create(person, None)
    }
}

