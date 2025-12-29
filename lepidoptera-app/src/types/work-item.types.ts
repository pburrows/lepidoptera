/**
 * TypeScript types for Work Items
 * 
 * These types match the Rust models defined in:
 * - lepidoptera-app/src-tauri/work_items/src/models/
 *
 */

import type { AllowedStatus, AllowedPriority, AssignmentFieldDefinition, WorkItemField } from '../data/templates/types';

/**
 * Work Item Type Model
 * Matches Rust WorkItemTypeModel
 */
export interface WorkItemTypeModel {
    id?: string | null;
    project_id: string;
    created_at: string;
    updated_at?: string | null;
    is_active: boolean;
    name: string;
    display_name: string;
    allowed_children_type_ids: string[];
    allowed_statuses: AllowedStatus[];
    allowed_priorities: AllowedPriority[];
    assignment_field_definitions: AssignmentFieldDefinition[];
    work_item_details: {
        icon?: string;
        color?: string;
        description?: string;
        default_fields?: string[];
        [key: string]: any;
    };
    work_item_fields: WorkItemField[];
}

/**
 * Simplified Work Item Type (alias for backward compatibility)
 * Used in components that don't need all fields
 */
export type WorkItemType = WorkItemTypeModel;

/**
 * Work Item Field Value Model
 * Represents a custom field value for a work item
 */
export interface WorkItemFieldValue {
    id?: string | null;
    project_id: string;
    work_item_id: string;
    field_id: string;
    is_assignment_field: boolean;
    value: string;
    created_at: string;
    updated_at?: string | null;
    created_by: string;
    updated_by?: string | null;
    is_active: boolean;
    field_definition?: {
        type: "work_item_field" | "assignment_field";
        field?: WorkItemField;
        assignment_field?: AssignmentFieldDefinition;
    };
}

/**
 * Work Item Model
 * Matches Rust WorkItemModel
 */
export interface WorkItemModel {
    id?: string | null;
    title: string;
    description?: string | null;
    status: string;
    created_at: string;
    updated_at?: string | null;
    priority: number;
    created_by: string;
    assigned_to?: string | null;
    project_id: string;
    type_id: string;
    sequential_number?: string | null;
    field_values: WorkItemFieldValue[];
    // Optional fields that might be stored separately or in field_values
    labels?: string[];
    dueDate?: string;
}

/**
 * Work Item Data (for form editing)
 * Used in WorkItemEdit component
 */
export interface WorkItemData {
    title: string;
    description: string;
    type: string;
    priority: string;
    status: string;
    assignmentFields: Record<string, string>; // Map of assignment field ID to value
    customFields: Record<string, any>; // Map of custom field ID to value
    labels: string[];
    dueDate: string;
}

/**
 * Work Item Query
 * Used for filtering work items in list queries
 */
export interface WorkItemQuery {
    project_id: string;
    statuses?: string[];
    type_ids?: string[];
    assigned_to?: string;
    title_contains?: string;
    page?: number;
    page_size?: number;
}

/**
 * Work Item List Request
 * Request payload for listing work items
 */
export interface WorkItemListRequest {
    query: WorkItemQuery;
    include_fields?: string[];
}

/**
 * Priority Detail
 * Extended priority information with display details
 */
export interface PriorityDetail {
    id: string;
    label: string;
    value: number;
    color?: string;
}

/**
 * Work Item List Item
 * Represents a work item in a list view
 */
export interface WorkItemListItem {
    id?: string;
    title: string;
    description?: string;
    status: string;
    created_at: string;
    updated_at?: string;
    priority: number;
    created_by: string;
    assigned_to?: string;
    project_id: string;
    type_id: string;
    sequential_number?: string;
    status_detail?: AllowedStatus;
    priority_detail?: PriorityDetail;
    field_values: any[];
}

/**
 * Work Item List Response
 * Response from listing work items
 */
export interface WorkItemListResponse {
    items: WorkItemListItem[];
    total: number;
    page?: number;
    page_size?: number;
    total_pages?: number;
}

/**
 * Work Item Edit Component Props
 */
export interface WorkItemEditProps {
    workItem?: WorkItemData;
    activeProjectId?: string;
    onSave?: (workItem: WorkItemData) => void;
    onCancel?: () => void;
}

/**
 * Work Item View Component Props
 */
export interface WorkItemViewProps {
    workItemId: string;
}

