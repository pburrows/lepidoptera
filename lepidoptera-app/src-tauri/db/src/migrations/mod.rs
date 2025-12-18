mod m0001_schema_version;
mod m0002_create_tickets;
mod m0003_add_ticket_columns;
mod m0004_create_projects;
mod m0005_create_persons;
mod m0006_drop_schema_version;
mod m0007_create_documents;
mod m0008_create_attachments;
mod m0009_add_document_indexes;
mod m0010_add_projects_is_active;
mod m0011_add_document_version_published_fields;
mod m0012_rename_tickets_to_work_items;

use rusqlite_migration::{Migrations};

pub fn get_migrations() -> Migrations<'static> {
    Migrations::new(vec![
        m0001_schema_version::migration(),
        m0002_create_tickets::migration(),
        m0003_add_ticket_columns::migration(),
        m0004_create_projects::migration(),
        m0005_create_persons::migration(),
        m0006_drop_schema_version::migration(),
        m0007_create_documents::migration(),
        m0008_create_attachments::migration(),
        m0009_add_document_indexes::migration(),
        m0010_add_projects_is_active::migration(),
        m0011_add_document_version_published_fields::migration(),
        m0012_rename_tickets_to_work_items::migration(),
      ])
}

pub fn run_migrations(connection: &mut rusqlite::Connection) -> anyhow::Result<()>{
    let migrations = get_migrations();
    migrations.to_latest(connection)?;
    Ok(())
}