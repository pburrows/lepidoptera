use rusqlite_migration::M;

pub fn migration() -> M<'static> {
    M::up(
        "CREATE TABLE IF NOT EXISTS tagged_items (
            id TEXT PRIMARY KEY,
            tag_id TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT,
            created_by TEXT NOT NULL,
            updated_by TEXT,
            reference_type TEXT NOT NULL,
            reference_id TEXT NOT NULL,
            FOREIGN KEY (tag_id) REFERENCES tags(id),
            UNIQUE(tag_id, reference_type, reference_id)
        );
        CREATE INDEX IF NOT EXISTS idx_tagged_items_tag_id ON tagged_items(tag_id);
        CREATE INDEX IF NOT EXISTS idx_tagged_items_reference ON tagged_items(reference_type, reference_id);
        CREATE INDEX IF NOT EXISTS idx_tagged_items_created_by ON tagged_items(created_by);",
    )
        .down(
            "DROP INDEX IF EXISTS idx_tagged_items_created_by;
             DROP INDEX IF EXISTS idx_tagged_items_reference;
             DROP INDEX IF EXISTS idx_tagged_items_tag_id;
             DROP TABLE IF EXISTS tagged_items;"
        )
}

