use rusqlite_migration::M;

pub fn migration() -> M<'static> {
    M::up(
        "DROP TABLE IF EXISTS schema_version",
    )
}
