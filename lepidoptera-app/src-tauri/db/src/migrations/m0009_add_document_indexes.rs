use rusqlite_migration::M;

pub fn migration() -> M<'static> {
    M::up(
        "CREATE INDEX IF NOT EXISTS idx_document_versions_document_id ON document_versions(document_id);
         CREATE INDEX IF NOT EXISTS idx_document_versions_document_id_version ON document_versions(document_id, version);
         CREATE INDEX IF NOT EXISTS idx_documents_project_id_is_active ON documents(project_id, is_active);
         CREATE INDEX IF NOT EXISTS idx_documents_slug ON documents(slug);",
    )
        .down(
            "DROP INDEX IF EXISTS idx_documents_slug;
             DROP INDEX IF EXISTS idx_documents_project_id_is_active;
             DROP INDEX IF EXISTS idx_document_versions_document_id_version;
             DROP INDEX IF EXISTS idx_document_versions_document_id;"
        )
}

