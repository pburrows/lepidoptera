import { useState, useEffect } from "react";
import {
    Box,
    Flex,
    Grid,
    Separator,
    Text,
} from "@radix-ui/themes";
import { invoke } from "@tauri-apps/api/core";
import type { AllowedStatus, AssignmentFieldDefinition, WorkItemField } from "../../data/templates/types";
import type {
    WorkItemTypeModel,
    WorkItemModel,
    WorkItemFieldValue,
    WorkItemViewProps,
} from "../../types/work-item.types";
import "./work-item-view.styles.scss";

export default function WorkItemView({ workItemId }: WorkItemViewProps) {
    const [workItem, setWorkItem] = useState<WorkItemModel | null>(null);
    const [workItemType, setWorkItemType] = useState<WorkItemTypeModel | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadWorkItem = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                // Load work item data
                const workItemData = await invoke<WorkItemModel | null>('get_work_item', { id: workItemId });
                
                if (!workItemData) {
                    setError('Work item not found');
                    setIsLoading(false);
                    return;
                }
                
                setWorkItem(workItemData);
                
                // Load work item type to get field definitions
                if (workItemData.type_id) {
                    try {
                        const types = await invoke<WorkItemTypeModel[]>('get_work_item_types_by_project', {
                            projectId: workItemData.project_id,
                        });
                        const type = types.find(t => (t.id || t.name) === workItemData.type_id);
                        if (type) {
                            setWorkItemType(type);
                        }
                    } catch (err) {
                        console.error('Failed to load work item type:', err);
                    }
                }
            } catch (err) {
                console.error('Failed to load work item:', err);
                setError('Failed to load work item');
            } finally {
                setIsLoading(false);
            }
        };

        if (workItemId) {
            loadWorkItem();
        }
    }, [workItemId]);

    if (isLoading) {
        return (
            <Box p="4">
                <Text>Loading work item...</Text>
            </Box>
        );
    }

    if (error || !workItem) {
        return (
            <Box p="4">
                <Text color="red">{error || 'Work item not found'}</Text>
            </Box>
        );
    }

    // Get allowed priorities and statuses from work item type
    const allowedPriorities = workItemType?.allowed_priorities || [];
    const allowedStatuses = workItemType?.allowed_statuses || [];
    const assignmentFieldDefinitions = workItemType?.assignment_field_definitions || [];
    const workItemFields = workItemType?.work_item_fields || [];

    // Find the display labels for priority and status
    const priorityLabel = allowedPriorities.find(p => p.id === String(workItem.priority))?.label || String(workItem.priority);
    const statusLabel = allowedStatuses.find(s => s.id === workItem.status)?.label || workItem.status;
    const typeDisplayName = workItemType?.display_name || workItemType?.name || workItem.type_id;

    // Organize field values
    const assignmentFields: Record<string, string> = {};
    const customFields: Record<string, any> = {};

    workItem.field_values.forEach(fieldValue => {
        if (fieldValue.is_assignment_field) {
            assignmentFields[fieldValue.field_id] = fieldValue.value;
        } else {
            customFields[fieldValue.field_id] = fieldValue.value;
        }
    });

    // Extract labels and dueDate if they exist as custom fields or as direct properties
    // Labels might be stored as a JSON array in a field_value or as a direct property
    let labels: string[] = workItem.labels || [];
    const labelsFieldValue = workItem.field_values.find(fv => 
        !fv.is_assignment_field && (fv.field_id === 'labels' || fv.field_id.toLowerCase().includes('label'))
    );
    if (labelsFieldValue && !labels.length) {
        try {
            const parsed = JSON.parse(labelsFieldValue.value);
            if (Array.isArray(parsed)) {
                labels = parsed;
            }
        } catch {
            // If not JSON, treat as comma-separated or single value
            if (labelsFieldValue.value) {
                labels = labelsFieldValue.value.split(',').map(l => l.trim()).filter(l => l);
            }
        }
    }

    // Extract dueDate if it exists as a custom field or as a direct property
    let dueDate: string | undefined = workItem.dueDate;
    if (!dueDate) {
        const dueDateFieldValue = workItem.field_values.find(fv => 
            !fv.is_assignment_field && (fv.field_id === 'dueDate' || fv.field_id === 'due_date' || fv.field_id.toLowerCase().includes('due'))
        );
        if (dueDateFieldValue) {
            dueDate = dueDateFieldValue.value;
        }
    }

    // Helper function to format field value based on field type
    const formatFieldValue = (value: any, fieldDef: WorkItemField | AssignmentFieldDefinition | undefined): string => {
        if (value === null || value === undefined || value === '') {
            return '—';
        }

        if (!fieldDef) {
            return String(value);
        }

        // For select/radio fields, try to find the option label
        if ('field_type' in fieldDef && (fieldDef.field_type === 'select' || fieldDef.field_type === 'radio')) {
            if ('options' in fieldDef && fieldDef.options) {
                const option = fieldDef.options.find(opt => opt.value === String(value));
                if (option) {
                    return option.label;
                }
            }
        }

        // For date/datetime fields, format the date
        if ('field_type' in fieldDef && (fieldDef.field_type === 'date' || fieldDef.field_type === 'datetime')) {
            try {
                const date = new Date(String(value));
                if (!isNaN(date.getTime())) {
                    return fieldDef.field_type === 'datetime' 
                        ? date.toLocaleString()
                        : date.toLocaleDateString();
                }
            } catch (e) {
                // If parsing fails, return as-is
            }
        }

        return String(value);
    };

    return (
        <Flex direction="column" gap="4">
            {/* Main Layout: Content on left, Sidebar on right */}
            <Grid columns="1fr 300px" gap="6">
                {/* Main Content Area */}
                <Flex direction="column" gap="4">
                    {/* Description */}
                    <Flex direction="column" gap="1">
                        <Text size="1" weight="medium" color="gray">
                            Description
                        </Text>
                        {workItem.description ? (
                            <Box
                                className="work-item-description"
                                dangerouslySetInnerHTML={{ __html: workItem.description }}
                            />
                        ) : (
                            <Text size="3" color="gray" style={{ fontStyle: 'italic' }}>
                                No description
                            </Text>
                        )}
                    </Flex>

                    {/* Labels */}
                    {labels && labels.length > 0 && (
                        <Flex gap="2" wrap="wrap">
                            {labels.map((label) => (
                                <Box
                                    key={label}
                                    style={{
                                        padding: "4px 8px",
                                        backgroundColor: "var(--accent-3)",
                                        borderRadius: "var(--radius-2)",
                                        fontSize: "var(--font-size-1)",
                                    }}
                                >
                                    <Text size="1">{label}</Text>
                                </Box>
                            ))}
                        </Flex>
                    )}
                </Flex>

                {/* Right Sidebar - Metadata */}
                <Box>
                    <Flex direction="column" gap="4">
                        <Separator size="4" />
                        
                        {/* Priority */}
                        <Flex direction="column" gap="1">
                            <Text size="2" weight="medium" color="gray">
                                Priority
                            </Text>
                            <Text size="3">{priorityLabel}</Text>
                        </Flex>

                        {/* Status */}
                        <Flex direction="column" gap="1">
                            <Text size="2" weight="medium" color="gray">
                                Status
                            </Text>
                            <Text size="3">{statusLabel}</Text>
                        </Flex>

                        {/* Assignment Fields */}
                        {assignmentFieldDefinitions.map((fieldDef) => {
                            const value = assignmentFields[fieldDef.id];
                            return (
                                <Flex key={fieldDef.id} direction="column" gap="1">
                                    <Text size="2" weight="medium" color="gray">
                                        {fieldDef.label}
                                    </Text>
                                    <Text size="3">{formatFieldValue(value, fieldDef) || '—'}</Text>
                                </Flex>
                            );
                        })}

                        {/* Custom Fields */}
                        {workItemFields.map((fieldDef) => {
                            const value = customFields[fieldDef.id];
                            return (
                                <Flex key={fieldDef.id} direction="column" gap="1">
                                    <Text size="2" weight="medium" color="gray">
                                        {fieldDef.label}
                                    </Text>
                                    {fieldDef.field_type === 'textarea' ? (
                                        <Text size="3" style={{ whiteSpace: 'pre-wrap' }}>
                                            {formatFieldValue(value, fieldDef)}
                                        </Text>
                                    ) : (
                                        <Text size="3">{formatFieldValue(value, fieldDef)}</Text>
                                    )}
                                </Flex>
                            );
                        })}

                        {/* Due Date */}
                        {dueDate && (
                            <Flex direction="column" gap="1">
                                <Text size="2" weight="medium" color="gray">
                                    Due Date
                                </Text>
                                <Text size="3">
                                    {new Date(dueDate).toLocaleDateString()}
                                </Text>
                            </Flex>
                        )}
                    </Flex>
                </Box>
            </Grid>
        </Flex>
    );
}

