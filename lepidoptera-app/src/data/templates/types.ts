/**
 * TypeScript types matching the Rust WorkItemType schemas
 * These types correspond to the structures defined in:
 * lepidoptera-app/src-tauri/work_items/src/schemas/work_item_type_schemas.rs
 */

export interface AllowedStatus {
  id: string;
  label: string;
  description?: string;
  color?: string;
}

export interface AllowedPriority {
  id: string;
  label: string;
  value: number;
  color?: string;
}

export interface AssignmentFieldDefinition {
  id: string;
  label: string;
  field_type: string; // e.g., "person", "team", "custom"
  required: boolean;
  default_value?: string;
}

export interface FieldValidation {
  min?: number;
  max?: number;
  pattern?: string;
  min_length?: number;
  max_length?: number;
}

export interface FieldOption {
  value: string;
  label: string;
}

export interface WorkItemField {
  id: string;
  label: string;
  field_type: string; // e.g., "text", "number", "date", "select", etc.
  required: boolean;
  default_value?: any;
  validation?: FieldValidation;
  options?: FieldOption[]; // For select/radio fields
}

export interface WorkItemDetails {
  icon?: string;
  color?: string;
  description?: string;
  default_fields?: string[];
  [key: string]: any; // Allow additional custom fields
}

/**
 * Template definition for a single work item type
 * This represents a work item type that will be created when a template is applied
 */
export interface WorkItemTypeTemplate {
  // The name/identifier for this type (e.g., "sprint", "epic", "user-story")
  name: string;
  
  // Display name (e.g., "Sprint", "Epic", "User Story")
  displayName: string;
  
  // IDs of child types that can be created under this type
  // These should reference other types in the same template by their 'name' field
  allowedChildrenTypeNames: string[];
  
  // Allowed statuses for this work item type
  allowedStatuses: AllowedStatus[];
  
  // Allowed priorities for this work item type
  allowedPriorities: AllowedPriority[];
  
  // Assignment field definitions
  assignmentFieldDefinitions: AssignmentFieldDefinition[];
  
  // Work item details (icon, color, description, etc.)
  workItemDetails: WorkItemDetails;
  
  // Custom fields for this work item type
  workItemFields: WorkItemField[];
}

/**
 * Project template metadata
 */
export interface ProjectTemplateMetadata {
  id: string;
  name: string;
  description: string;
  icon?: string; // Path to icon/image
  category?: string; // e.g., "Software Development", "Construction", "Marketing"
}

/**
 * Complete project template definition
 */
export interface ProjectTemplate {
  metadata: ProjectTemplateMetadata;
  workItemTypes: WorkItemTypeTemplate[];
}

