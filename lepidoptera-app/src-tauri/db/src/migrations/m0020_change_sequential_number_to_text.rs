use rusqlite_migration::M;

pub fn migration() -> M<'static> {
    M::up(
        r#"
        -- SQLite doesn't support direct column type changes, so we need to:
        -- 1. Create a new table with the correct schema
        -- 2. Copy data with conversion
        -- 3. Drop old table and rename new table
        
        CREATE TABLE work_items_new (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT,
            priority INTEGER NOT NULL,
            created_by TEXT NOT NULL,
            assigned_to TEXT,
            project_id TEXT NOT NULL,
            type_id TEXT NOT NULL,
            sequential_number TEXT
        );
        
        -- Copy data, converting sequential_number from INTEGER to formatted TEXT
        -- For existing records, format as "M-<number>" with at least 4 digits
        INSERT INTO work_items_new (
            id, title, description, status, created_at, updated_at,
            priority, created_by, assigned_to, project_id, type_id, sequential_number
        )
        SELECT 
            id, title, description, status, created_at, updated_at,
            priority, created_by, assigned_to, project_id, type_id,
            CASE 
                WHEN sequential_number IS NOT NULL THEN 
                    'M-' || printf('%04d', sequential_number)
                ELSE NULL
            END as sequential_number
        FROM work_items;
        
        -- Drop old table
        DROP TABLE work_items;
        
        -- Rename new table
        ALTER TABLE work_items_new RENAME TO work_items;
        
        -- Note: Indexes will be preserved automatically as they reference the table name
        "#,
    )
        .down(
            r#"
        -- Reverse migration: convert back to INTEGER
        CREATE TABLE work_items_new (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT,
            priority INTEGER NOT NULL,
            created_by TEXT NOT NULL,
            assigned_to TEXT,
            project_id TEXT NOT NULL,
            type_id TEXT NOT NULL,
            sequential_number INTEGER
        );
        
        -- Copy data, extracting number from formatted string
        -- Extract number after the dash, or use NULL if format is unexpected
        INSERT INTO work_items_new (
            id, title, description, status, created_at, updated_at,
            priority, created_by, assigned_to, project_id, type_id, sequential_number
        )
        SELECT 
            id, title, description, status, created_at, updated_at,
            priority, created_by, assigned_to, project_id, type_id,
            CASE 
                WHEN sequential_number IS NOT NULL AND sequential_number LIKE '%-%' THEN
                    CAST(substr(sequential_number, instr(sequential_number, '-') + 1) AS INTEGER)
                ELSE NULL
            END as sequential_number
        FROM work_items;
        
        DROP TABLE work_items;
        ALTER TABLE work_items_new RENAME TO work_items;
        "#
        )
}

