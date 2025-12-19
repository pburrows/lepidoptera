use rusqlite_migration::M;

pub fn migration() -> M<'static> {
    M::up(
        "ALTER TABLE work_items ADD COLUMN type_id TEXT NOT NULL DEFAULT '';",
    )
        .down("ALTER TABLE work_items DROP COLUMN type_id;")
}

