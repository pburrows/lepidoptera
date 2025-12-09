use rusqlite_migration::M;

pub fn migration() -> M<'static> {
    M::up(
        "ALTER TABLE tickets ADD COLUMN priority INTEGER;
         ALTER TABLE tickets ADD COLUMN created_by INTEGER;
         ALTER TABLE tickets ADD COLUMN assigned_to TEXT;
         ALTER TABLE tickets ADD COLUMN project_id TEXT;",
    )
        .down(
            "ALTER TABLE tickets DROP COLUMN priority;
             ALTER TABLE tickets DROP COLUMN created_by;
             ALTER TABLE tickets DROP COLUMN assigned_to;
             ALTER TABLE tickets DROP COLUMN project_id;",
        )
}

