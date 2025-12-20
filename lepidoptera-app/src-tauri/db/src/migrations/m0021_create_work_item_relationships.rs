use rusqlite_migration::M;

pub fn migration() -> M<'static> {
    M::up(
        "CREATE TABLE IF NOT EXISTS work_item_relationships (
            id TEXT PRIMARY KEY,
            project_id TEXT NOT NULL,
            source_work_item_id TEXT NOT NULL,
            target_work_item_id TEXT NOT NULL,
            relationship_type TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT,
            created_by TEXT NOT NULL,
            updated_by TEXT,
            is_active INTEGER NOT NULL DEFAULT 1,
            FOREIGN KEY (source_work_item_id) REFERENCES work_items(id),
            FOREIGN KEY (target_work_item_id) REFERENCES work_items(id),
            FOREIGN KEY (project_id) REFERENCES projects(id),
            UNIQUE(source_work_item_id, target_work_item_id, relationship_type)
        );
        CREATE INDEX IF NOT EXISTS idx_work_item_relationships_source ON work_item_relationships(source_work_item_id, relationship_type, is_active);
        CREATE INDEX IF NOT EXISTS idx_work_item_relationships_target ON work_item_relationships(target_work_item_id, relationship_type, is_active);
        CREATE INDEX IF NOT EXISTS idx_work_item_relationships_project ON work_item_relationships(project_id);",
    )
        .down(
            "DROP INDEX IF EXISTS idx_work_item_relationships_project;
             DROP INDEX IF EXISTS idx_work_item_relationships_target;
             DROP INDEX IF EXISTS idx_work_item_relationships_source;
             DROP TABLE IF EXISTS work_item_relationships;"
        )
}

