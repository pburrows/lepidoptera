use std::sync::Arc;
use crate::entities::LocalMachine;
use crate::local_machine_sqlite_repository::LocalMachineRepository;
use anyhow::{Result, Context};
use ulid::Ulid;
use chrono::Utc;
use machine_uuid::get as get_machine_id;
use hostname::get as get_hostname;

pub fn get_local_machine(repository: &Arc<dyn LocalMachineRepository>) -> Result<LocalMachine> {
    // Check if a record already exists
    if let Some(existing) = repository.find_first()? {
        return Ok(existing);
    }

    // Get OS machine ID
    let os_machine_id = get_machine_id();

    // Get hostname for machine name
    let machine_name = get_hostname()
        .map(|h| h.to_string_lossy().to_string())
        .unwrap_or_else(|_| "Unknown".to_string());

    // Generate ULID for the sync instance ID
    let id = Ulid::new().to_string();
    
    // Get current timestamp
    let now = Utc::now().to_rfc3339();

    // Create new LocalMachine entity
    // TODO: user_id should come from server authentication (JWT token)
    // For now, using empty string as placeholder - this must be set when auth is integrated
    let local_machine = LocalMachine {
        id: Some(id),
        os_machine_id,
        user_id: String::new(), // TODO: Get from authentication
        name: machine_name,
        registered_at: now.clone(),
        last_seen_at: now,
        last_upstream_sync_at: None,
        last_downstream_sync_at: None,
        last_ip_address: None,
        is_active: true,
        is_duplicate: false,
    };

    // Create in repository
    let created = repository.create(local_machine)
        .context("Failed to create local machine record")?;

    Ok(created)
}

