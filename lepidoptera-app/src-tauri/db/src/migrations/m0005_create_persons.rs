use rusqlite_migration::M;

pub fn migration() -> M<'static> {
    M::up(
        "CREATE TABLE IF NOT EXISTS persons (
            id TEXT PRIMARY KEY,
            created_at TEXT NOT NULL,
            updated_at TEXT,
            display_name TEXT NOT NULL,
            is_active INTEGER NOT NULL DEFAULT 1
        )",
    )
        .down("DROP TABLE IF NOT EXISTS persons")
}

