use rusqlite_migration::M;

pub fn migration() -> M<'static> {
    M::up(
        "CREATE TABLE IF NOT EXISTS work_item_types (
            id TEXT PRIMARY KEY,
            project_id TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT,
            is_active INTEGER NOT NULL DEFAULT 1,
            allowed_children_type_ids TEXT NOT NULL DEFAULT '[]',
            allowed_statuses TEXT NOT NULL DEFAULT '[]',
            allowed_priorities TEXT NOT NULL DEFAULT '[]',
            assignment_field_definitions TEXT NOT NULL DEFAULT '{}',
            work_item_details TEXT NOT NULL DEFAULT '{}',
            work_item_fields TEXT NOT NULL DEFAULT '{}'
        )",
    )
        .down("DROP TABLE IF NOT EXISTS work_item_types")
}

