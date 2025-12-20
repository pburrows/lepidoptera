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
mod m0013_create_work_item_types;
mod m0014_add_work_items_type_id;
mod m0015_create_work_item_field_values;
mod m0016_create_project_settings;
mod m0017_create_work_item_number_ranges;
mod m0018_add_work_items_sequential_number;
mod m0019_create_local_machine;
mod m0020_change_sequential_number_to_text;
mod m0021_create_work_item_relationships;

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
        m0013_create_work_item_types::migration(),
        m0014_add_work_items_type_id::migration(),
        m0015_create_work_item_field_values::migration(),
        m0016_create_project_settings::migration(),
        m0017_create_work_item_number_ranges::migration(),
        m0018_add_work_items_sequential_number::migration(),
        m0019_create_local_machine::migration(),
        m0020_change_sequential_number_to_text::migration(),
        m0021_create_work_item_relationships::migration(),
      ])
}

pub fn run_migrations(connection: &mut rusqlite::Connection) -> anyhow::Result<()>{
    let migrations = get_migrations();
    migrations.to_latest(connection)?;
    Ok(())
}