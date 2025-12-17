use rusqlite_migration::M;

pub fn migration() -> M<'static> {
    M::up(
        "ALTER TABLE projects ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1;",
    )
        .down("ALTER TABLE projects DROP COLUMN is_active;")
}

