use rusqlite_migration::M;

pub fn migration() -> M<'static> {
    M::up(
        "CREATE TABLE IF NOT EXISTS schema_version (
            version INTEGER PRIMARY KEY,
            applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )",
    )
        .down("DROP TABLE IF NOT EXISTS schema_version")
}