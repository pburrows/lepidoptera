use thiserror::Error;

/// Custom error type for field validation failures
#[derive(Debug, Error)]
pub enum FieldValidationError {
    #[error("Field '{field_label}' ({field_id}): {message}")]
    ValidationFailure {
        field_id: String,
        field_label: String,
        message: String,
    },
}

impl FieldValidationError {
    pub fn new(field_id: String, field_label: String, message: String) -> Self {
        Self::ValidationFailure {
            field_id,
            field_label,
            message,
        }
    }
}

