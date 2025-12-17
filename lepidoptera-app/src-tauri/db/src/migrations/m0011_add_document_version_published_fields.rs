use rusqlite_migration::M;

pub fn migration() -> M<'static> {
    M::up(
        "ALTER TABLE document_versions ADD COLUMN published_at TEXT;
         ALTER TABLE document_versions ADD COLUMN published_by TEXT;",
    )
        .down(
            "ALTER TABLE document_versions DROP COLUMN published_at;
             ALTER TABLE document_versions DROP COLUMN published_by;",
        )
}

