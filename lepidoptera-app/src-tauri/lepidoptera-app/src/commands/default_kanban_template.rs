use work_items::models::WorkItemTypeTemplate;
use serde_json::json;

/// Returns the default Kanban template work item types
/// This matches the kanban.ts template definition
pub fn get_default_kanban_template() -> Vec<WorkItemTypeTemplate> {
    vec![
        WorkItemTypeTemplate {
            name: "epic".to_string(),
            display_name: "Epic".to_string(),
            allowed_children_type_names: vec!["feature".to_string()],
            allowed_statuses: vec![
                json!({"id": "backlog", "label": "Backlog", "color": "#6b7280"}),
                json!({"id": "in-progress", "label": "In Progress", "color": "#3b82f6"}),
                json!({"id": "done", "label": "Done", "color": "#10b981"}),
            ],
            allowed_priorities: vec![
                json!({"id": "low", "label": "Low", "value": 1, "color": "#6b7280"}),
                json!({"id": "medium", "label": "Medium", "value": 2, "color": "#f59e0b"}),
                json!({"id": "high", "label": "High", "value": 3, "color": "#ef4444"}),
            ],
            assignment_field_definitions: vec![
                json!({"id": "product-owner", "label": "Product Owner", "field_type": "person", "required": false}),
            ],
            work_item_details: json!({
                "icon": "FaRocket",
                "color": "#8b5cf6",
                "description": "Large feature or initiative"
            }),
            work_item_fields: vec![
                json!({"id": "business-value", "label": "Business Value", "field_type": "text", "required": false}),
            ],
        },
        WorkItemTypeTemplate {
            name: "feature".to_string(),
            display_name: "Feature".to_string(),
            allowed_children_type_names: vec!["work-item".to_string()],
            allowed_statuses: vec![
                json!({"id": "backlog", "label": "Backlog", "color": "#6b7280"}),
                json!({"id": "in-progress", "label": "In Progress", "color": "#3b82f6"}),
                json!({"id": "review", "label": "In Review", "color": "#f59e0b"}),
                json!({"id": "done", "label": "Done", "color": "#10b981"}),
            ],
            allowed_priorities: vec![
                json!({"id": "low", "label": "Low", "value": 1, "color": "#6b7280"}),
                json!({"id": "medium", "label": "Medium", "value": 2, "color": "#f59e0b"}),
                json!({"id": "high", "label": "High", "value": 3, "color": "#ef4444"}),
            ],
            assignment_field_definitions: vec![
                json!({"id": "assignee", "label": "Assignee", "field_type": "person", "required": false}),
            ],
            work_item_details: json!({
                "icon": "FaStar",
                "color": "#3b82f6",
                "description": "A deliverable feature"
            }),
            work_item_fields: vec![
                json!({"id": "acceptance-criteria", "label": "Acceptance Criteria", "field_type": "text", "required": false}),
            ],
        },
        WorkItemTypeTemplate {
            name: "work-item".to_string(),
            display_name: "Work Item".to_string(),
            allowed_children_type_names: vec!["task".to_string()],
            allowed_statuses: vec![
                json!({"id": "backlog", "label": "Backlog", "color": "#6b7280"}),
                json!({"id": "to-do", "label": "To Do", "color": "#9ca3af"}),
                json!({"id": "in-progress", "label": "In Progress", "color": "#3b82f6"}),
                json!({"id": "done", "label": "Done", "color": "#10b981"}),
            ],
            allowed_priorities: vec![
                json!({"id": "low", "label": "Low", "value": 1, "color": "#6b7280"}),
                json!({"id": "medium", "label": "Medium", "value": 2, "color": "#f59e0b"}),
                json!({"id": "high", "label": "High", "value": 3, "color": "#ef4444"}),
            ],
            assignment_field_definitions: vec![
                json!({"id": "assignee", "label": "Assignee", "field_type": "person", "required": false}),
            ],
            work_item_details: json!({
                "icon": "FaClipboardList",
                "color": "#10b981",
                "description": "A work item within a feature"
            }),
            work_item_fields: vec![],
        },
        WorkItemTypeTemplate {
            name: "task".to_string(),
            display_name: "Task".to_string(),
            allowed_children_type_names: vec![],
            allowed_statuses: vec![
                json!({"id": "to-do", "label": "To Do", "color": "#9ca3af"}),
                json!({"id": "in-progress", "label": "In Progress", "color": "#3b82f6"}),
                json!({"id": "done", "label": "Done", "color": "#10b981"}),
            ],
            allowed_priorities: vec![
                json!({"id": "low", "label": "Low", "value": 1, "color": "#6b7280"}),
                json!({"id": "medium", "label": "Medium", "value": 2, "color": "#f59e0b"}),
                json!({"id": "high", "label": "High", "value": 3, "color": "#ef4444"}),
            ],
            assignment_field_definitions: vec![
                json!({"id": "assignee", "label": "Assignee", "field_type": "person", "required": false}),
            ],
            work_item_details: json!({
                "icon": "FaCheckSquare",
                "color": "#6b7280",
                "description": "A specific task to complete"
            }),
            work_item_fields: vec![
                json!({"id": "estimated-hours", "label": "Estimated Hours", "field_type": "number", "required": false, "validation": {"min": 0, "max": 1000}}),
            ],
        },
    ]
}

