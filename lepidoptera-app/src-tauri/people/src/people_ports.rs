use crate::entities::Person;
use anyhow::Result;

pub trait PersonManager: Send + Sync {
    fn get_person_by_id(&self, id: String) -> Result<Option<Person>>;
    fn get_persons(&self) -> Result<Vec<Person>>;
    fn create_person(&self, person: Person) -> Result<Person>;
}