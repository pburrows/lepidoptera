use rusqlite_migration::M;

pub fn migration() -> M<'static> {
    M::up(
        "CREATE TABLE IF NOT EXISTS tags (
            id TEXT PRIMARY KEY,
            created_at TEXT NOT NULL,
            updated_at TEXT,
            created_by TEXT NOT NULL,
            updated_by TEXT,
            project_id TEXT,
            name TEXT NOT NULL,
            hash_tag TEXT NOT NULL UNIQUE,
            FOREIGN KEY (project_id) REFERENCES projects(id)
        );
        CREATE INDEX IF NOT EXISTS idx_tags_project_id ON tags(project_id);
        CREATE INDEX IF NOT EXISTS idx_tags_hash_tag ON tags(hash_tag);
        CREATE INDEX IF NOT EXISTS idx_tags_created_by ON tags(created_by);",
    )
        .down(
            "DROP INDEX IF EXISTS idx_tags_created_by;
             DROP INDEX IF EXISTS idx_tags_hash_tag;
             DROP INDEX IF EXISTS idx_tags_project_id;
             DROP TABLE IF EXISTS tags;"
        )
}

