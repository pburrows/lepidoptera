use rusqlite_migration::M;

pub fn migration() -> M<'static> {
    M::up(
        "CREATE TABLE IF NOT EXISTS work_item_field_values (
            id TEXT PRIMARY KEY,
            project_id TEXT NOT NULL,
            work_item_id TEXT NOT NULL,
            field_id TEXT NOT NULL,
            is_assignment_field INTEGER NOT NULL DEFAULT 0,
            value TEXT NOT NULL DEFAULT '',
            created_at TEXT NOT NULL,
            updated_at TEXT,
            created_by TEXT NOT NULL,
            updated_by TEXT,
            is_active INTEGER NOT NULL DEFAULT 1,
            FOREIGN KEY (work_item_id) REFERENCES work_items(id),
            FOREIGN KEY (project_id) REFERENCES projects(id)
        );
        CREATE INDEX IF NOT EXISTS idx_work_item_field_values_work_item ON work_item_field_values(work_item_id, is_active);
        CREATE INDEX IF NOT EXISTS idx_work_item_field_values_field ON work_item_field_values(field_id, is_assignment_field);
        CREATE INDEX IF NOT EXISTS idx_work_item_field_values_project ON work_item_field_values(project_id);",
    )
        .down(
            "DROP INDEX IF EXISTS idx_work_item_field_values_project;
             DROP INDEX IF EXISTS idx_work_item_field_values_field;
             DROP INDEX IF EXISTS idx_work_item_field_values_work_item;
             DROP TABLE IF EXISTS work_item_field_values;"
        )
}

