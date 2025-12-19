use rusqlite_migration::M;

pub fn migration() -> M<'static> {
    M::up(
        "CREATE TABLE IF NOT EXISTS local_machine (
            id TEXT PRIMARY KEY,
            os_machine_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            name TEXT NOT NULL,
            registered_at TEXT NOT NULL,
            last_seen_at TEXT NOT NULL,
            last_upstream_sync_at TEXT,
            last_downstream_sync_at TEXT,
            last_ip_address TEXT,
            is_active INTEGER NOT NULL DEFAULT 1,
            is_duplicate INTEGER NOT NULL DEFAULT 0,
            UNIQUE(os_machine_id, user_id)
        );
        CREATE INDEX IF NOT EXISTS idx_local_machine_os_user ON local_machine(os_machine_id, user_id);",
    )
        .down(
            "DROP INDEX IF EXISTS idx_local_machine_os_user;
             DROP TABLE IF EXISTS local_machine;"
        )
}

