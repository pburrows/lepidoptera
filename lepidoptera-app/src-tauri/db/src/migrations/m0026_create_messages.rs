use rusqlite_migration::M;

pub fn migration() -> M<'static> {
    M::up(
        "CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            conversation_id TEXT NOT NULL,
            reply_to_message_id TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT,
            created_by TEXT NOT NULL,
            updated_by TEXT,
            is_archived INTEGER NOT NULL DEFAULT 0,
            title TEXT,
            body TEXT NOT NULL,
            attachment_ids TEXT,
            mentions TEXT,
            reactions TEXT,
            FOREIGN KEY (conversation_id) REFERENCES conversations(id),
            FOREIGN KEY (reply_to_message_id) REFERENCES messages(id)
        );
        CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
        CREATE INDEX IF NOT EXISTS idx_messages_reply_to_message_id ON messages(reply_to_message_id);
        CREATE INDEX IF NOT EXISTS idx_messages_created_by ON messages(created_by);
        CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
        CREATE INDEX IF NOT EXISTS idx_messages_is_archived ON messages(is_archived);",
    )
        .down(
            "DROP INDEX IF EXISTS idx_messages_is_archived;
             DROP INDEX IF EXISTS idx_messages_created_at;
             DROP INDEX IF EXISTS idx_messages_created_by;
             DROP INDEX IF EXISTS idx_messages_reply_to_message_id;
             DROP INDEX IF EXISTS idx_messages_conversation_id;
             DROP TABLE IF EXISTS messages;"
        )
}

