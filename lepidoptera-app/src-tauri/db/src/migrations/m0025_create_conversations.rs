use rusqlite_migration::M;

pub fn migration() -> M<'static> {
    M::up(
        "CREATE TABLE IF NOT EXISTS conversations (
            id TEXT PRIMARY KEY,
            created_at TEXT NOT NULL,
            updated_at TEXT,
            created_by TEXT NOT NULL,
            updated_by TEXT,
            is_archived INTEGER NOT NULL DEFAULT 0,
            name TEXT NOT NULL,
            description TEXT,
            conversation_scope TEXT NOT NULL,
            conversation_scope_id TEXT NOT NULL,
            direct_message_participants TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_conversations_scope ON conversations(conversation_scope);
        CREATE INDEX IF NOT EXISTS idx_conversations_created_by ON conversations(created_by);
        CREATE INDEX IF NOT EXISTS idx_conversations_is_archived ON conversations(is_archived);",
    )
        .down(
            "DROP INDEX IF EXISTS idx_conversations_is_archived;
             DROP INDEX IF EXISTS idx_conversations_created_by;
             DROP INDEX IF EXISTS idx_conversations_scope;
             DROP TABLE IF EXISTS conversations;"
        )
}

