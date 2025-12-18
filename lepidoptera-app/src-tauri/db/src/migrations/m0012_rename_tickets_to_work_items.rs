use rusqlite_migration::M;

pub fn migration() -> M<'static> {
    M::up(
        "ALTER TABLE work_items RENAME TO work_items",
    )
        .down("ALTER TABLE work_items RENAME TO work_items")
}

