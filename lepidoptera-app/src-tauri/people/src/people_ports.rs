use crate::entities::Person;

pub trait PersonManager: Send + Sync {
    fn get_person_by_id(&self, id: i64) -> Option<Person>;
}