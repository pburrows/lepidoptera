use rusqlite_migration::M;

pub fn migration() -> M<'static> {
    M::up(
        "CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            created_at TEXT NOT NULL,
            updated_at TEXT,
            name TEXT NOT NULL,
            description TEXT
        )",
    )
        .down("DROP TABLE IF NOT EXISTS projects")
}

