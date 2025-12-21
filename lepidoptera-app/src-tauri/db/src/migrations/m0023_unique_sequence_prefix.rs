use rusqlite_migration::M;

pub fn migration() -> M<'static> {
    M::up(
        "CREATE UNIQUE INDEX IF NOT EXISTS idx_project_settings_unique_sequence_prefix 
         ON project_settings(setting_value) 
         WHERE setting_key = 'SEQUENCE_PREFIX';",
    )
        .down("DROP INDEX IF EXISTS idx_project_settings_unique_sequence_prefix;")
}

