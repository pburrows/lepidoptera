use crate::schemas::{WorkItemField, FieldValidation};
use crate::errors::FieldValidationError;
use chrono::{DateTime, NaiveDate, NaiveDateTime};

/// Validates a field value according to the field definition's validation rules
pub fn validate_field_value(
    field: &WorkItemField,
    value: &str,
) -> Result<(), FieldValidationError> {
    // Check required fields
    if field.required && value.is_empty() {
        return Err(FieldValidationError::new(
            field.id.clone(),
            field.label.clone(),
            format!("Field '{}' is required but no value was provided", field.label),
        ));
    }

    // Skip validation if value is empty and field is not required
    if value.is_empty() {
        return Ok(());
    }

    // Get validation rules if they exist
    let validation = match &field.validation {
        Some(v) => v,
        None => return Ok(()), // No validation rules, value is acceptable
    };

    // Validate based on field type
    match field.field_type.as_str() {
        "number" | "integer" => validate_number_field(field, value, validation)?,
        "date" | "datetime" => validate_date_field(field, value, validation)?,
        "text" | "textarea" | "select" | "radio" => validate_text_field(field, value, validation)?,
        _ => {
            // For unknown field types, only validate text-based rules
            validate_text_field(field, value, validation)?;
        }
    }

    Ok(())
}

fn validate_number_field(
    field: &WorkItemField,
    value: &str,
    validation: &FieldValidation,
) -> Result<(), FieldValidationError> {
    let num_value: f64 = value.parse().map_err(|_| {
        FieldValidationError::new(
            field.id.clone(),
            field.label.clone(),
            format!("Field '{}' must be a number, but got '{}'", field.label, value),
        )
    })?;

    // Check minimum value
    if let Some(min) = validation.min {
        if num_value < min {
            return Err(FieldValidationError::new(
                field.id.clone(),
                field.label.clone(),
                format!(
                    "Field '{}' value {} is below the minimum allowed value of {}",
                    field.label, num_value, min
                ),
            ));
        }
    }

    // Check maximum value
    if let Some(max) = validation.max {
        if num_value > max {
            return Err(FieldValidationError::new(
                field.id.clone(),
                field.label.clone(),
                format!(
                    "Field '{}' value {} exceeds the maximum allowed value of {}",
                    field.label, num_value, max
                ),
            ));
        }
    }

    Ok(())
}

fn validate_date_field(
    field: &WorkItemField,
    value: &str,
    validation: &FieldValidation,
) -> Result<(), FieldValidationError> {
    // Try parsing as ISO 8601 datetime first
    let date_time = DateTime::parse_from_rfc3339(value)
        .map(|dt| dt.with_timezone(&chrono::Utc))
        .or_else(|_| {
            // Try parsing as NaiveDateTime
            NaiveDateTime::parse_from_str(value, "%Y-%m-%d %H:%M:%S")
                .map(|dt| dt.and_utc())
        })
        .or_else(|_| {
            // Try parsing as date only
            NaiveDate::parse_from_str(value, "%Y-%m-%d")
                .map(|d| d.and_hms_opt(0, 0, 0).unwrap().and_utc())
        })
        .map_err(|_| {
            FieldValidationError::new(
                field.id.clone(),
                field.label.clone(),
                format!(
                    "Field '{}' must be a valid date or datetime, but got '{}'",
                    field.label, value
                ),
            )
        })?;

    let timestamp = date_time.timestamp_millis() as f64 / 1000.0;

    // Check minimum date
    if let Some(min) = validation.min {
        if timestamp < min {
            return Err(FieldValidationError::new(
                field.id.clone(),
                field.label.clone(),
                format!(
                    "Field '{}' date is before the minimum allowed date",
                    field.label
                ),
            ));
        }
    }

    // Check maximum date
    if let Some(max) = validation.max {
        if timestamp > max {
            return Err(FieldValidationError::new(
                field.id.clone(),
                field.label.clone(),
                format!(
                    "Field '{}' date is after the maximum allowed date",
                    field.label
                ),
            ));
        }
    }

    Ok(())
}

fn validate_text_field(
    field: &WorkItemField,
    value: &str,
    validation: &FieldValidation,
) -> Result<(), FieldValidationError> {
    // Check minimum length
    if let Some(min_length) = validation.min_length {
        if value.len() < min_length {
            return Err(FieldValidationError::new(
                field.id.clone(),
                field.label.clone(),
                format!(
                    "Field '{}' must be at least {} characters long, but got {} characters",
                    field.label, min_length, value.len()
                ),
            ));
        }
    }

    // Check maximum length
    if let Some(max_length) = validation.max_length {
        if value.len() > max_length {
            return Err(FieldValidationError::new(
                field.id.clone(),
                field.label.clone(),
                format!(
                    "Field '{}' must be no more than {} characters long, but got {} characters",
                    field.label, max_length, value.len()
                ),
            ));
        }
    }

    // Check pattern (regex)
    if let Some(pattern) = &validation.pattern {
        let regex = regex::Regex::new(pattern).map_err(|e| {
            FieldValidationError::new(
                field.id.clone(),
                field.label.clone(),
                format!(
                    "Invalid validation pattern for field '{}': {}",
                    field.label, e
                ),
            )
        })?;

        if !regex.is_match(value) {
            return Err(FieldValidationError::new(
                field.id.clone(),
                field.label.clone(),
                format!(
                    "Field '{}' value '{}' does not match the required pattern",
                    field.label, value
                ),
            ));
        }
    }

    // For select/radio fields, validate against options
    if (field.field_type == "select" || field.field_type == "radio") && field.options.is_some() {
        let options = field.options.as_ref().unwrap();
        let valid_values: Vec<&str> = options.iter().map(|opt| opt.value.as_str()).collect();
        if !valid_values.contains(&value) {
            return Err(FieldValidationError::new(
                field.id.clone(),
                field.label.clone(),
                format!(
                    "Field '{}' value '{}' is not one of the allowed options",
                    field.label, value
                ),
            ));
        }
    }

    Ok(())
}

