use rusqlite_migration::M;

pub fn migration() -> M<'static> {
    M::up(
        "CREATE TABLE IF NOT EXISTS project_settings (
            id TEXT PRIMARY KEY,
            project_id TEXT NOT NULL,
            setting_key TEXT NOT NULL,
            setting_value TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT,
            created_by TEXT NOT NULL,
            updated_by TEXT,
            FOREIGN KEY (project_id) REFERENCES projects(id),
            UNIQUE(project_id, setting_key)
        );
        CREATE INDEX IF NOT EXISTS idx_project_settings_project ON project_settings(project_id);
        CREATE INDEX IF NOT EXISTS idx_project_settings_key ON project_settings(project_id, setting_key);",
    )
        .down(
            "DROP INDEX IF EXISTS idx_project_settings_key;
             DROP INDEX IF EXISTS idx_project_settings_project;
             DROP TABLE IF EXISTS project_settings;"
        )
}

