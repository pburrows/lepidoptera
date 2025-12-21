use rusqlite_migration::M;

pub fn migration() -> M<'static> {
    M::up(
        "ALTER TABLE work_item_types ADD COLUMN name TEXT NOT NULL DEFAULT ''; 
        ALTER TABLE work_item_types ADD COLUMN display_name TEXT NOT NULL DEFAULT '';",
    )
        .down("ALTER TABLE work_item_types DROP COLUMN display_name; ALTER TABLE work_item_types DROP COLUMN name;")
}

