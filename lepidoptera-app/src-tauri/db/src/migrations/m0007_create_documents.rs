use rusqlite_migration::M;

pub fn migration() -> M<'static> {
    M::up(
        "CREATE TABLE IF NOT EXISTS documents (
            id TEXT PRIMARY KEY,
            project_id TEXT NOT NULL,
            created_at TEXT NOT NULL,
            created_by TEXT NOT NULL,
            updated_at TEXT,
            updated_by TEXT,
            parent_id TEXT,
            slug TEXT NOT NULL,
            is_active INTEGER NOT NULL DEFAULT 1
        );
        CREATE TABLE IF NOT EXISTS document_versions (
            id TEXT PRIMARY KEY,
            document_id TEXT NOT NULL,
            version INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            created_by TEXT NOT NULL,
            title TEXT NOT NULL,
            body TEXT,
            summary TEXT,
            attachment_ids TEXT,
            FOREIGN KEY (document_id) REFERENCES documents(id)
        )",
    )
        .down(
            "DROP TABLE IF EXISTS document_versions;
             DROP TABLE IF EXISTS documents"
        )
}

