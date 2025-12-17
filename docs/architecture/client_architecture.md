# Client Architecture

## Overview

This document details the client-side implementation architecture for the Lepidoptera application. The client is designed to function completely independently without any server connection, with server features being optional enhancements.

**Critical Design Principle**: The client must function entirely offline. Server features are opt-in and gracefully degrade when unavailable.

## Architecture Principles

### 1. Offline-First Design

- All core functionality works without server connection
- Server features enhance but don't require connectivity
- Data is stored locally in SQLite databases
- Sync is asynchronous and non-blocking

### 2. Workspace Isolation

- Each workspace is a separate SQLite database
- Workspaces sync independently
- User can have multiple workspaces
- Workspace data only syncs when workspace is loaded

### 3. Security & Privacy

- Sensitive data never leaves the device
- Tokens stored securely
- No hard dependencies on server table structures
- Privacy-preserving sync design

## Technology Stack

### Core Technologies

- **Frontend Framework**: React (TypeScript)
- **Desktop Framework**: Tauri (Rust + Web frontend)
- **Database**: SQLite (via `rusqlite`)
- **Language**: Rust (backend), TypeScript (frontend)
- **Serialization**: Serde (Rust), JSON (API communication)
- **Async Runtime**: Tokio (Rust)

### Supporting Libraries

- **ULID Generation**: `ulid` crate
- **HTTP Client**: `reqwest` (Rust) or `fetch` (TypeScript)
- **Date/Time**: `chrono` (Rust) or native Date (TypeScript)
- **Secure Storage**: Tauri secure storage APIs
- **Logging**: `tracing` (Rust), console (TypeScript)

## Database Architecture

### Workspace Database Structure

Each workspace is a separate SQLite database file stored in the user's data directory:

- **Windows**: `%LOCALAPPDATA%\lepidoptera\workspaces\{workspace_id}.db`
- **macOS**: `~/Library/Application Support/lepidoptera/workspaces/{workspace_id}.db`
- **Linux**: `~/.local/share/lepidoptera/workspaces/{workspace_id}.db`

### Core Tables

#### Domain Tables

- `tickets` - Issue/ticket tracking
- `projects` - Project management
- `documents` - Document storage
- `persons` - People/contacts (workspace-local)
- `attachments` - File attachments (binary data)

#### Sync Infrastructure Tables

See "Sync Infrastructure" section for detailed schemas.

## Sync Infrastructure

### Event Streams Table

Stores all change events for synchronization and audit purposes.

```sql
CREATE TABLE IF NOT EXISTS event_streams (
    id TEXT PRIMARY KEY,                    -- ULID, unique event identifier
    machine_id TEXT NOT NULL,               -- ULID, identifies the source machine
    entity_type TEXT NOT NULL,              -- 'tickets', 'projects', 'documents', 'attachments', etc.
    entity_id TEXT NOT NULL,                -- ID of the affected entity
    operation TEXT NOT NULL,                -- 'CREATE', 'UPDATE', 'DELETE'
    payload TEXT NOT NULL,                  -- JSON representation of the entity state at time of change
    created_at TEXT NOT NULL,               -- ISO 8601 timestamp when event was created
    synced_at TEXT,                         -- ISO 8601 timestamp when event was sent to server (NULL if not yet synced)
    applied_at TEXT,                        -- ISO 8601 timestamp when event was applied locally (NULL for local events)
);

CREATE INDEX idx_event_streams_sync ON event_streams(synced_at, created_at);
CREATE INDEX idx_event_streams_entity ON event_streams(entity_type, entity_id, created_at);
CREATE INDEX idx_event_streams_machine ON event_streams(machine_id, created_at);
```

### Local Machine Table

Stores private information about the CURRENT machine only. This table should NEVER be synced.

```sql
CREATE TABLE IF NOT EXISTS local_machine (
    id TEXT PRIMARY KEY,                    -- ULID, unique sync instance identifier
    os_machine_id TEXT NOT NULL,            -- OS-provided machine identifier (PRIVATE - not shared)
    user_id TEXT NOT NULL,                  -- ULID, account user ID from server authentication
    name TEXT NOT NULL,                     -- Human-readable machine name
    registered_at TEXT NOT NULL,            -- ISO 8601 timestamp when machine was registered
    last_seen_at TEXT NOT NULL,             -- ISO 8601 timestamp of last sync activity
    last_upstream_sync_at TEXT,             -- ISO 8601 timestamp of last successful upstream sync
    last_downstream_sync_at TEXT,           -- ISO 8601 timestamp of last successful downstream sync
    last_ip_address TEXT,                   -- Last known IP address (PRIVATE - not shared)
    is_active INTEGER NOT NULL DEFAULT 1,   -- 1 if active, 0 if deactivated
    is_duplicate INTEGER NOT NULL DEFAULT 0, -- 1 if detected as duplicate copy, 0 otherwise
    UNIQUE(os_machine_id, user_id)          -- Ensures one sync instance per machine+user combination
);

CREATE INDEX idx_local_machine_os_user ON local_machine(os_machine_id, user_id);
```

**Privacy**: This table contains sensitive information and must NEVER be synced to other clients.

### Machine Profiles Table

Stores public information about other machines for display in audit trails. This is a cache synced from the server.

```sql
CREATE TABLE IF NOT EXISTS machine_profiles (
    id TEXT PRIMARY KEY,                    -- ULID, machine sync instance identifier
    user_id TEXT NOT NULL,                  -- ULID, account user ID
    user_display_name TEXT NOT NULL,        -- User's display name (synced from server)
    name TEXT NOT NULL,                     -- Human-readable machine name
    last_updated_at TEXT NOT NULL,          -- ISO 8601 timestamp when profile was last updated
);

CREATE INDEX idx_machine_profiles_user ON machine_profiles(user_id);
```

### Sync State Table

Tracks synchronization state for the local machine.

```sql
CREATE TABLE IF NOT EXISTS sync_state (
    machine_id TEXT PRIMARY KEY,            -- ULID, references local_machine(id)
    last_upstream_sync_at TEXT,             -- ISO 8601 timestamp of last successful upstream sync
    last_downstream_sync_at TEXT,           -- ISO 8601 timestamp of last successful downstream sync
    upstream_cursor TEXT,                   -- Last event ID successfully synced upstream
    downstream_cursor TEXT,                 -- Last event ID successfully synced downstream
    FOREIGN KEY (machine_id) REFERENCES local_machine(id)
);
```

## Transactional Outbox Pattern

### Implementation

All write operations MUST use database transactions to ensure atomicity:

```rust
// Example: Creating a ticket
connection.transaction(|tx| {
    // 1. Write to main table
    tx.execute(
        "INSERT INTO tickets (id, title, description, created_at) VALUES (?, ?, ?, ?)",
        params![ticket_id, title, description, created_at]
    )?;
    
    // 2. Write to event_streams table
    let event_id = generate_ulid();
    tx.execute(
        "INSERT INTO event_streams (id, machine_id, entity_type, entity_id, operation, payload, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        params![
            event_id,
            machine_id,
            "tickets",
            ticket_id,
            "CREATE",
            &serde_json::to_string(&ticket)?,
            created_at
        ]
    )?;
    
    Ok(())
})?;
```

### Event Payload Format

Events store the complete entity state at the time of change:

```json
{
  "id": "01ARZ3NDEKTSV4RRFFQ69G5FAV",
  "title": "Fix bug in sync",
  "description": "...",
  "project_id": "01ARZ3NDEKTSV4RRFFQ69G5FAX",
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z"
}
```

## Authentication Implementation

### Token Storage

**Access Token**:
- Stored in memory (cleared on app close)
- Included in `Authorization: Bearer {token}` header
- Short-lived (15 minutes)
- Automatically refreshed when expired

**Refresh Token**:
- Stored securely using Tauri secure storage APIs
- Used only for token refresh endpoint
- Long-lived (7 days)
- Revoked on logout

### Secure Storage Implementation

```rust
use tauri::api::path::app_data_dir;
use tauri::Config;

// Store refresh token securely
async fn store_refresh_token(token: &str) -> Result<(), Error> {
    let app_data = app_data_dir(&Config::default())?;
    let token_file = app_data.join("refresh_token.enc");
    
    // Encrypt token before storing
    let encrypted = encrypt_token(token)?;
    std::fs::write(token_file, encrypted)?;
    
    Ok(())
}

// Retrieve refresh token
async fn get_refresh_token() -> Result<Option<String>, Error> {
    let app_data = app_data_dir(&Config::default())?;
    let token_file = app_data.join("refresh_token.enc");
    
    if !token_file.exists() {
        return Ok(None);
    }
    
    let encrypted = std::fs::read(token_file)?;
    let token = decrypt_token(&encrypted)?;
    
    Ok(Some(token))
}
```

### Authentication Flow

#### Registration

```rust
pub async fn register(
    email: String,
    password: String,
    display_name: String,
) -> Result<AuthResponse, AuthError> {
    let client = reqwest::Client::new();
    let response = client
        .post(&format!("{}/api/auth/register", server_url))
        .json(&RegisterRequest {
            email,
            password,
            display_name,
        })
        .send()
        .await?;
    
    let auth_response: AuthResponse = response.json().await?;
    
    // Store refresh token securely
    store_refresh_token(&auth_response.refresh_token).await?;
    
    // Store access token in memory
    set_access_token(auth_response.access_token.clone());
    
    Ok(auth_response)
}
```

#### Login

```rust
pub async fn login(
    email: String,
    password: String,
) -> Result<AuthResponse, AuthError> {
    let client = reqwest::Client::new();
    let response = client
        .post(&format!("{}/api/auth/login", server_url))
        .json(&LoginRequest { email, password })
        .send()
        .await?;
    
    let auth_response: AuthResponse = response.json().await?;
    
    // Store tokens
    store_refresh_token(&auth_response.refresh_token).await?;
    set_access_token(auth_response.access_token.clone());
    
    Ok(auth_response)
}
```

#### Token Refresh

```rust
pub async fn refresh_token() -> Result<String, AuthError> {
    let refresh_token = get_refresh_token().await?
        .ok_or(AuthError::NoRefreshToken)?;
    
    let client = reqwest::Client::new();
    let response = client
        .post(&format!("{}/api/auth/refresh", server_url))
        .bearer_auth(&refresh_token)
        .send()
        .await?;
    
    if !response.status().is_success() {
        // Refresh token expired or invalid
        clear_tokens().await?;
        return Err(AuthError::TokenExpired);
    }
    
    let refresh_response: RefreshResponse = response.json().await?;
    
    // Update access token
    set_access_token(refresh_response.access_token.clone());
    
    Ok(refresh_response.access_token)
}
```

#### Automatic Token Refresh

```rust
pub async fn authenticated_request<T>(
    request_builder: reqwest::RequestBuilder,
) -> Result<T, Error> {
    let mut request = request_builder;
    
    // Try with current access token
    if let Some(token) = get_access_token() {
        request = request.bearer_auth(&token);
    }
    
    let response = request.send().await?;
    
    // If unauthorized, try refreshing token
    if response.status() == 401 {
        let new_token = refresh_token().await?;
        let retry_response = request_builder
            .bearer_auth(&new_token)
            .send()
            .await?;
        
        return Ok(retry_response.json().await?);
    }
    
    Ok(response.json().await?)
}
```

## Machine Registration

### OS Machine ID Retrieval

```rust
// Windows
fn get_os_machine_id_windows() -> Result<String, Error> {
    use winreg::enums::*;
    use winreg::RegKey;
    
    let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);
    let key = hklm.open_subkey("SOFTWARE\\Microsoft\\Cryptography")?;
    let machine_guid: String = key.get_value("MachineGuid")?;
    
    Ok(machine_guid)
}

// macOS
fn get_os_machine_id_macos() -> Result<String, Error> {
    use std::process::Command;
    
    let output = Command::new("system_profiler")
        .arg("SPHardwareDataType")
        .output()?;
    
    // Parse hardware UUID from output
    // Implementation details...
}

// Linux
fn get_os_machine_id_linux() -> Result<String, Error> {
    std::fs::read_to_string("/etc/machine-id")
        .map_err(|_| Error::MachineIdNotFound)
}
```

### Registration Flow

```rust
pub async fn register_machine(
    user_id: String,
    machine_name: String,
) -> Result<String, Error> {
    let os_machine_id = get_os_machine_id()?;
    
    // Check if already registered locally
    if let Some(machine) = get_local_machine().await? {
        return Ok(machine.id);
    }
    
    let machine_id = generate_ulid();
    
    // Register with server
    let client = reqwest::Client::new();
    let response = client
        .post(&format!("{}/api/machines/register", server_url))
        .bearer_auth(get_access_token().unwrap())
        .json(&MachineRegisterRequest {
            os_machine_id: os_machine_id.clone(),
            user_id: user_id.clone(),
            name: machine_name.clone(),
        })
        .send()
        .await?;
    
    let register_response: MachineRegisterResponse = response.json().await?;
    
    // Store locally
    store_local_machine(LocalMachine {
        id: register_response.machine_id.clone(),
        os_machine_id,
        user_id,
        name: machine_name,
        registered_at: Utc::now().to_rfc3339(),
        last_seen_at: Utc::now().to_rfc3339(),
        // ... other fields
    }).await?;
    
    Ok(register_response.machine_id)
}
```

## Sync Implementation

### Upstream Sync (Sending Changes)

```rust
pub async fn sync_upstream(workspace_id: &str) -> Result<(), Error> {
    // Query unsynced events
    let unsynced_events = query_unsynced_events(workspace_id, 1000).await?;
    
    if unsynced_events.is_empty() {
        return Ok(());
    }
    
    // Get machine info
    let machine = get_local_machine().await?.ok_or(Error::MachineNotRegistered)?;
    
    // Send to server
    let client = reqwest::Client::new();
    let response = client
        .post(&format!("{}/api/sync/upstream", server_url))
        .bearer_auth(get_access_token().unwrap())
        .json(&UpstreamSyncRequest {
            workspace_id: workspace_id.to_string(),
            machine_id: machine.id.clone(),
            os_machine_id: machine.os_machine_id.clone(),
            events: unsynced_events,
        })
        .send()
        .await?;
    
    let sync_response: UpstreamSyncResponse = response.json().await?;
    
    // Update synced_at for successfully synced events
    if sync_response.status == "success" {
        mark_events_synced(&sync_response.processed_event_ids).await?;
        update_sync_state(workspace_id, SyncUpdate {
            last_upstream_sync_at: Some(Utc::now().to_rfc3339()),
            upstream_cursor: sync_response.last_event_id,
        }).await?;
    }
    
    Ok(())
}
```

### Downstream Sync (Receiving Changes)

```rust
pub async fn sync_downstream(workspace_id: &str) -> Result<(), Error> {
    let sync_state = get_sync_state(workspace_id).await?;
    let machine = get_local_machine().await?.ok_or(Error::MachineNotRegistered)?;
    
    let since = sync_state
        .last_downstream_sync_at
        .unwrap_or_else(|| "1970-01-01T00:00:00Z".to_string());
    
    // Request changes from server
    let client = reqwest::Client::new();
    let mut url = format!("{}/api/sync/downstream", server_url);
    url.push_str(&format!("?workspace_id={}&machine_id={}&since={}", 
        workspace_id, machine.id, since));
    
    let response = client
        .get(&url)
        .bearer_auth(get_access_token().unwrap())
        .send()
        .await?;
    
    let sync_response: DownstreamSyncResponse = response.json().await?;
    
    // Process events
    process_downstream_events(workspace_id, &sync_response.events).await?;
    
    // Update sync state
    update_sync_state(workspace_id, SyncUpdate {
        last_downstream_sync_at: Some(Utc::now().to_rfc3339()),
        downstream_cursor: sync_response.last_event_id,
    }).await?;
    
    Ok(())
}
```

### Processing Downstream Events

```rust
async fn process_downstream_events(
    workspace_id: &str,
    events: &[Event],
) -> Result<(), Error> {
    let db = get_workspace_db(workspace_id).await?;
    
    db.transaction(|tx| {
        // Insert events into event_streams
        for event in events {
            tx.execute(
                "INSERT INTO event_streams (id, machine_id, entity_type, entity_id, operation, payload, created_at, applied_at) VALUES (?, ?, ?, ?, ?, ?, ?, NULL)
                 ON CONFLICT(id) DO NOTHING",
                params![
                    event.id,
                    event.machine_id,
                    event.entity_type,
                    event.entity_id,
                    event.operation,
                    event.payload,
                    event.created_at,
                ]
            )?;
        }
        
        // Apply events to local tables
        apply_events_to_tables(tx, events)?;
        
        Ok(())
    })?;
    
    Ok(())
}
```

## Periodic Sync

### Sync Scheduler

```rust
use tokio::time::{interval, Duration};

pub async fn start_sync_scheduler() {
    let mut interval = interval(Duration::from_secs(30));
    
    loop {
        interval.tick().await;
        
        // Get active workspaces
        let workspaces = get_active_workspaces().await.unwrap_or_default();
        
        for workspace_id in workspaces {
            // Sync upstream
            if let Err(e) = sync_upstream(&workspace_id).await {
                log::error!("Upstream sync failed for {}: {}", workspace_id, e);
            }
            
            // Sync downstream
            if let Err(e) = sync_downstream(&workspace_id).await {
                log::error!("Downstream sync failed for {}: {}", workspace_id, e);
            }
        }
    }
}
```

## Error Handling

### Retry Strategy

```rust
pub async fn sync_with_retry<F, T>(
    operation: F,
    max_retries: u32,
) -> Result<T, Error>
where
    F: Fn() -> std::pin::Pin<Box<dyn Future<Output = Result<T, Error>> + Send>>,
{
    let mut attempt = 0;
    let mut delay = Duration::from_secs(1);
    
    loop {
        match operation().await {
            Ok(result) => return Ok(result),
            Err(e) => {
                attempt += 1;
                
                if attempt >= max_retries {
                    return Err(e);
                }
                
                // Exponential backoff
                tokio::time::sleep(delay).await;
                delay = std::cmp::min(delay * 2, Duration::from_secs(60));
            }
        }
    }
}
```

### Network Error Handling

```rust
pub enum SyncError {
    NetworkError(String),
    AuthenticationError,
    ServerError(u16, String),
    ValidationError(String),
    Unknown(String),
}

impl From<reqwest::Error> for SyncError {
    fn from(err: reqwest::Error) -> Self {
        if err.is_timeout() || err.is_connect() {
            SyncError::NetworkError(err.to_string())
        } else if let Some(status) = err.status() {
            match status.as_u16() {
                401 => SyncError::AuthenticationError,
                400..=499 => SyncError::ValidationError(err.to_string()),
                500..=599 => SyncError::ServerError(status.as_u16(), err.to_string()),
                _ => SyncError::Unknown(err.to_string()),
            }
        } else {
            SyncError::Unknown(err.to_string())
        }
    }
}
```

## Workspace Management

### Workspace Selection

```rust
pub async fn load_workspace(workspace_id: &str) -> Result<(), Error> {
    // Check if workspace database exists
    let workspace_path = get_workspace_path(workspace_id)?;
    
    if !workspace_path.exists() {
        // Create new workspace database
        create_workspace_database(workspace_id).await?;
    }
    
    // Open database connection
    let db = open_workspace_db(workspace_id).await?;
    
    // Initialize sync if server is configured
    if is_server_configured() {
        register_machine_if_needed().await?;
        start_sync_for_workspace(workspace_id).await?;
    }
    
    Ok(())
}
```

### Workspace Creation

```rust
pub async fn create_workspace(name: String) -> Result<String, Error> {
    let workspace_id = generate_ulid();
    
    // Create workspace database
    create_workspace_database(&workspace_id).await?;
    
    // If server is configured, create workspace on server
    if is_server_configured() {
        create_workspace_on_server(&workspace_id, &name).await?;
    }
    
    Ok(workspace_id)
}
```

## Configuration

### Server Configuration

```rust
pub struct ServerConfig {
    pub base_url: String,
    pub enabled: bool,
}

pub async fn load_server_config() -> Result<ServerConfig, Error> {
    let config_path = get_config_path()?;
    
    if !config_path.exists() {
        return Ok(ServerConfig {
            base_url: String::new(),
            enabled: false,
        });
    }
    
    let config_str = std::fs::read_to_string(config_path)?;
    let config: ServerConfig = serde_json::from_str(&config_str)?;
    
    Ok(config)
}

pub async fn save_server_config(config: &ServerConfig) -> Result<(), Error> {
    let config_path = get_config_path()?;
    let config_str = serde_json::to_string_pretty(config)?;
    std::fs::write(config_path, config_str)?;
    Ok(())
}
```

## Security Considerations

### Token Security

1. **Access Tokens**: Store in memory only, never persist
2. **Refresh Tokens**: Encrypt before storing on disk
3. **HTTPS Only**: Always use HTTPS for API communication
4. **Token Rotation**: Implement automatic refresh token rotation

### Data Privacy

1. **Local Machine Data**: Never sync `local_machine` table
2. **OS Machine ID**: Keep private, only send during registration
3. **IP Address**: Keep private, never sync
4. **Sensitive Fields**: Mark clearly and exclude from sync

### Input Validation

1. **Validate All Inputs**: Validate before sending to server
2. **Sanitize Data**: Sanitize user inputs
3. **Type Safety**: Use strong types for all API requests/responses

## Testing

### Unit Tests

- Database operations
- Event creation and processing
- Token management
- Error handling

### Integration Tests

- Authentication flows
- Sync operations (with mock server)
- Workspace management
- Offline functionality

### Test Utilities

```rust
// Mock server for testing
pub struct MockServer {
    pub base_url: String,
}

impl MockServer {
    pub fn new() -> Self {
        // Start mock HTTP server
        // Return base URL
    }
    
    pub fn expect_request(&self, method: &str, path: &str) -> MockResponse {
        // Set up expectation
    }
}
```

## Migration & Compatibility

### Database Migrations

- Use migration system for schema changes
- Version database schemas
- Support rollback if needed

### API Versioning

- Support multiple API versions if needed
- Gracefully handle API changes
- Maintain backward compatibility where possible

## Performance Considerations

### Batch Sizes

- **Standard Entities**: 1,000 events per batch
- **Attachments**: 100 events per batch
- **Sync Frequency**: Every 30 seconds (configurable)

### Database Optimization

- Use WAL mode for better concurrency
- Index frequently queried columns
- Batch database operations in transactions

### Memory Management

- Clear access tokens on app close
- Limit in-memory event cache
- Stream large attachments

## Error Recovery

### Sync Failure Recovery

- Retry failed syncs with exponential backoff
- Mark failed events for manual review
- Continue syncing other events

### Database Recovery

- Regular backups
- Transaction rollback on errors
- Corrupted database detection and recovery

## Logging & Monitoring

### Logging Strategy

- Log sync operations
- Log authentication events
- Log errors with context
- Never log sensitive data (passwords, tokens)

### Monitoring

- Track sync success/failure rates
- Monitor token refresh frequency
- Track workspace load times
- Monitor database performance

