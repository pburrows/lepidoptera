use rusqlite_migration::M;

pub fn migration() -> M<'static> {
    M::up(
        "CREATE TABLE IF NOT EXISTS work_item_number_ranges (
            id TEXT PRIMARY KEY,
            project_id TEXT NOT NULL,
            machine_id TEXT NOT NULL,
            range_start INTEGER NOT NULL,
            range_end INTEGER NOT NULL,
            current_number INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT,
            FOREIGN KEY (project_id) REFERENCES projects(id),
            UNIQUE(project_id, machine_id, range_start)
        );
        CREATE INDEX IF NOT EXISTS idx_work_item_number_ranges_project ON work_item_number_ranges(project_id);
        CREATE INDEX IF NOT EXISTS idx_work_item_number_ranges_machine ON work_item_number_ranges(machine_id);
        CREATE INDEX IF NOT EXISTS idx_work_item_number_ranges_project_machine ON work_item_number_ranges(project_id, machine_id);",
    )
        .down(
            "DROP INDEX IF EXISTS idx_work_item_number_ranges_project_machine;
             DROP INDEX IF EXISTS idx_work_item_number_ranges_machine;
             DROP INDEX IF EXISTS idx_work_item_number_ranges_project;
             DROP TABLE IF EXISTS work_item_number_ranges;"
        )
}

