use rusqlite_migration::M;

pub fn migration() -> M<'static> {
    M::up(
        "ALTER TABLE projects ADD COLUMN created_by TEXT NOT NULL DEFAULT '';
         ALTER TABLE projects ADD COLUMN updated_by TEXT;",
    )
        .down("ALTER TABLE projects DROP COLUMN updated_by; ALTER TABLE projects DROP COLUMN created_by;")
}

