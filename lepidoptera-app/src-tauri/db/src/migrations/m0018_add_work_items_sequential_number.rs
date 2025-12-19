use rusqlite_migration::M;

pub fn migration() -> M<'static> {
    M::up(
        "ALTER TABLE work_items ADD COLUMN sequential_number INTEGER;",
    )
        .down(
            "ALTER TABLE work_items DROP COLUMN sequential_number;"
        )
}

