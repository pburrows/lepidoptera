use std::sync::Arc;
use db::connection_pool::ConnectionPool;
use crate::work_item_number_ranges_repository::WorkItemNumberRangesRepository;
use crate::entities::WorkItemNumberRange;
use anyhow::{Result, Context};
use ulid::Ulid;
use chrono::Utc;

const RANGE_SIZE: i64 = 1000; // Each range contains 1000 numbers
const RANGE_EXHAUSTION_THRESHOLD: i64 = 800; // Claim new range when 80% exhausted

/// Manages sequential number ranges for work items.
/// 
/// Each machine gets a range of sequential numbers per project.
/// When a range is exhausted, a new range is claimed.
pub struct NumberRangeManager {
    repository: Arc<dyn WorkItemNumberRangesRepository>,
    pool: Arc<ConnectionPool>,
}

impl NumberRangeManager {
    pub fn new(
        repository: Arc<dyn WorkItemNumberRangesRepository>,
        pool: Arc<ConnectionPool>,
    ) -> Self {
        Self {
            repository,
            pool,
        }
    }

    /// Get the next sequential number for a project and machine.
    /// 
    /// If no active range exists, claims a new range.
    /// If the current range is exhausted, claims a new range.
    pub fn get_next_number(
        &self,
        project_id: &str,
        machine_id: &str,
    ) -> Result<i64> {
        // Try to find an active range
        let mut active_range = self.repository.find_active_range(project_id, machine_id)?;

        // If no active range or range is exhausted, claim a new one
        let needs_new_range = match &active_range {
            Some(range) => {
                // Check if range is exhausted (within threshold)
                let used = range.current_number - range.range_start;
                used >= RANGE_EXHAUSTION_THRESHOLD
            }
            None => true,
        };

        if needs_new_range {
            active_range = Some(self.claim_range(project_id, machine_id)?);
        }

        let range = active_range.ok_or_else(|| {
            anyhow::anyhow!("Failed to get or claim a number range")
        })?;

        // Increment and update current_number
        let next_number = range.current_number + 1;
        
        if next_number > range.range_end {
            // Range is exhausted, claim a new one
            let new_range = self.claim_range(project_id, machine_id)?;
            let next_number = new_range.current_number + 1;
            self.repository.update_current_number(
                new_range.id.as_ref().unwrap(),
                next_number,
            )?;
            Ok(next_number)
        } else {
            // Update current_number in existing range
            self.repository.update_current_number(
                range.id.as_ref().unwrap(),
                next_number,
            )?;
            Ok(next_number)
        }
    }

    /// Claim a new range for a machine and project.
    /// 
    /// Finds the highest range_end for the project and claims the next range.
    /// If no ranges exist, starts at 1000.
    fn claim_range(
        &self,
        project_id: &str,
        machine_id: &str,
    ) -> Result<WorkItemNumberRange> {
        // Find all existing ranges for this project
        let existing_ranges = self.repository.find_ranges_by_project(project_id)?;

        // Determine the next range_start
        let range_start = if existing_ranges.is_empty() {
            // First range starts at 1000
            RANGE_SIZE
        } else {
            // Find the highest range_end and start the next range after it
            let max_range_end = existing_ranges
                .iter()
                .map(|r| r.range_end)
                .max()
                .unwrap_or(RANGE_SIZE - 1);
            max_range_end + 1
        };

        let range_end = range_start + RANGE_SIZE - 1;

        // Create the new range
        let new_range = WorkItemNumberRange {
            id: Some(Ulid::new().to_string()),
            project_id: project_id.to_string(),
            machine_id: machine_id.to_string(),
            range_start,
            range_end,
            current_number: range_start - 1, // Will be incremented to range_start on first use
            created_at: Utc::now().to_rfc3339(),
            updated_at: None,
        };

        // Save the range
        let created_range = self.repository.create_range(new_range)
            .context("Failed to create number range")?;

        Ok(created_range)
    }
}

