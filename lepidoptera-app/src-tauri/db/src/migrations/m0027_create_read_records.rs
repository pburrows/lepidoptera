use rusqlite_migration::M;

pub fn migration() -> M<'static> {
    M::up(
        "CREATE TABLE IF NOT EXISTS read_records (
            id TEXT PRIMARY KEY,
            created_at TEXT NOT NULL,
            person_id TEXT NOT NULL,
            conversation_id TEXT NOT NULL,
            last_read_message_id TEXT,
            last_read_at TEXT,
            FOREIGN KEY (person_id) REFERENCES persons(id),
            FOREIGN KEY (conversation_id) REFERENCES conversations(id),
            FOREIGN KEY (last_read_message_id) REFERENCES messages(id),
            UNIQUE(person_id, conversation_id)
        );
        CREATE INDEX IF NOT EXISTS idx_read_records_person_id ON read_records(person_id);
        CREATE INDEX IF NOT EXISTS idx_read_records_conversation_id ON read_records(conversation_id);
        CREATE INDEX IF NOT EXISTS idx_read_records_last_read_message_id ON read_records(last_read_message_id);",
    )
        .down(
            "DROP INDEX IF EXISTS idx_read_records_last_read_message_id;
             DROP INDEX IF EXISTS idx_read_records_conversation_id;
             DROP INDEX IF EXISTS idx_read_records_person_id;
             DROP TABLE IF EXISTS read_records;"
        )
}

