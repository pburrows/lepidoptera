mod m0001_schema_version;
mod m0002_create_tickets;

use rusqlite_migration::{Migrations};

pub fn get_migrations() -> Migrations<'static> {
    Migrations::new(vec![
        m0001_schema_version::migration(),
        m0002_create_tickets::migration(),
      ])
}

pub fn run_migrations(connection: &mut rusqlite::Connection) -> anyhow::Result<()>{
    let migrations = get_migrations();
    migrations.to_latest(connection)?;
    Ok(())
}