use crate::entities::Person;
use anyhow::Result;
use crate::models::team_result::TeamResult;

pub trait PersonManager: Send + Sync {
    fn get_person_by_id(&self, id: String) -> Result<Option<Person>>;
    fn get_persons(&self) -> Result<Vec<Person>>;
    fn create_person(&self, person: Person) -> Result<Person>;
}

pub trait TeamManager: Send + Sync {
    fn list_teams(&self) -> Result<Vec<TeamResult>>;
    fn get_team(&self, team_id: String, include_members: bool) -> Result<Vec<TeamResult>>;
    fn create_team(&self) -> Result<TeamResult>;
    fn add_person_to_team(&self, team_id: String, person_id: String, role: String) -> Result<TeamResult>;
}