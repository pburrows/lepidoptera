import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    Box,
    Button,
    Flex,
    Grid,
    Select,
    Separator,
    Text,
    TextArea,
    TextField,
} from "@radix-ui/themes";
import { FaXmark } from "react-icons/fa6";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import {RichTextEditor} from "../editor";
import type { AllowedStatus, AllowedPriority, AssignmentFieldDefinition, WorkItemField } from "../../data/templates/types";

interface WorkItemType {
    id: string | null;
    name: string;
    display_name: string;
    project_id: string;
    is_active: boolean;
    allowed_statuses: AllowedStatus[];
    allowed_priorities: AllowedPriority[];
    assignment_field_definitions: AssignmentFieldDefinition[];
    work_item_fields: WorkItemField[];
}

export interface WorkItemData {
    title: string;
    description: string;
    type: string;
    priority: string;
    status: string;
    assignmentFields: Record<string, string>; // Map of assignment field ID to value
    customFields: Record<string, any>; // Map of custom field ID to value
    // project: string;
    labels: string[];
    dueDate: string;
}

interface WorkItemEditProps {
    workItem?: WorkItemData;
    activeProjectId?: string;
    onSave?: (workItem: WorkItemData) => void;
    onCancel?: () => void;
}

export default function WorkItemEdit({ workItem, activeProjectId, onSave, onCancel }: WorkItemEditProps) {
    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        trigger,
        reset,
        getValues,
        formState: { errors },
    } = useForm<WorkItemData>({
        defaultValues: {
            title: workItem?.title || "",
            description: workItem?.description || "",
            type: workItem?.type || "",
            priority: workItem?.priority || "",
            status: workItem?.status || "",
            assignmentFields: workItem?.assignmentFields || {},
            customFields: workItem?.customFields || {},
            // project: workItem?.project || "",
            labels: workItem?.labels || [],
            dueDate: workItem?.dueDate || "",
        },
    });

    const [newLabel, setNewLabel] = useState("");
    const [workItemTypes, setWorkItemTypes] = useState<WorkItemType[]>([]);
    const [isLoadingTypes, setIsLoadingTypes] = useState(false);
    
    const watchedLabels = watch("labels");
    const watchedType = watch("type");
    const watchedAssignmentFields = watch("assignmentFields");
    const watchedCustomFields = watch("customFields");
    
    // Get the currently selected work item type
    const selectedType = workItemTypes.find(
        t => (t.id || t.name) === watchedType
    );
    
    // Get allowed priorities and statuses from selected type
    const allowedPriorities = selectedType?.allowed_priorities || [];
    const allowedStatuses = selectedType?.allowed_statuses || [];
    const assignmentFieldDefinitions = selectedType?.assignment_field_definitions || [];
    const workItemFields = selectedType?.work_item_fields || [];
    
    // Update window title when project is loaded
    useEffect(() => {
        const updateWindowTitle = async () => {
            if (!activeProjectId) {
                return;
            }
            
            try {
                const project = await invoke<{ id: string | null; name: string; description: string | null; created_at: string; updated_at: string | null; is_active: boolean } | null>('get_project_by_id', {
                    projectId: activeProjectId,
                });
                
                if (project) {
                    const window = getCurrentWindow();
                    await window.setTitle(`Create Work Item in ${project.name}`);
                }
            } catch (error) {
                console.error('Failed to update window title:', error);
            }
        };
        
        updateWindowTitle();
    }, [activeProjectId]);

    // Fetch work item types for the current project
    useEffect(() => {
        const fetchWorkItemTypes = async () => {
            console.log('Fetching work item types for project:', activeProjectId);
            if (!activeProjectId) {
                setWorkItemTypes([]);
                return;
            }

            setIsLoadingTypes(true);
            try {
                const types = await invoke<WorkItemType[]>('get_work_item_types_by_project', {
                    projectId: activeProjectId,
                });
                console.log('Work item types:', types);
                // Filter to only active types
                const activeTypes = types.filter(type => type.is_active);
                setWorkItemTypes(activeTypes);
                
                // Always set the first type as default if no type is currently selected
                if (activeTypes.length > 0) {
                    const currentType = watchedType || "";
                    const typeExists = activeTypes.some(t => (t.id || t.name) === currentType);
                    
                    // If current type is empty or doesn't exist in the available types, use the first one
                    if (!currentType || !typeExists) {
                        const firstType = activeTypes[0];
                        const firstTypeValue = firstType.id || firstType.name || "";
                        console.log('Setting default type:', firstTypeValue, 'from type:', firstType);
                        setValue("type", firstTypeValue, { shouldValidate: false });
                        
                        // Set default priority and status from the first type
                        if (firstType.allowed_priorities.length > 0) {
                            const firstPriority = firstType.allowed_priorities[0];
                            setValue("priority", firstPriority.id, { shouldValidate: false });
                        }
                        if (firstType.allowed_statuses.length > 0) {
                            const firstStatus = firstType.allowed_statuses[0];
                            setValue("status", firstStatus.id, { shouldValidate: false });
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch work item types:', error);
                setWorkItemTypes([]);
            } finally {
                setIsLoadingTypes(false);
            }
        };

        fetchWorkItemTypes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeProjectId]);

    // Update priority and status when type changes
    useEffect(() => {
        if (!selectedType) return;
        
        const currentPriority = watch("priority");
        const currentStatus = watch("status");
        
        // Check if current priority is valid for the new type
        const priorityExists = allowedPriorities.some(p => p.id === currentPriority);
        if (!priorityExists && allowedPriorities.length > 0) {
            setValue("priority", allowedPriorities[0].id, { shouldValidate: false });
        }
        
        // Check if current status is valid for the new type
        const statusExists = allowedStatuses.some(s => s.id === currentStatus);
        if (!statusExists && allowedStatuses.length > 0) {
            setValue("status", allowedStatuses[0].id, { shouldValidate: false });
        }
        
        // Initialize assignment fields with default values if they don't exist
        const assignmentFields = watchedAssignmentFields || {};
        const updatedAssignmentFields = { ...assignmentFields };
        let hasAssignmentChanges = false;
        
        assignmentFieldDefinitions.forEach(fieldDef => {
            if (!(fieldDef.id in updatedAssignmentFields)) {
                updatedAssignmentFields[fieldDef.id] = fieldDef.default_value || "";
                hasAssignmentChanges = true;
            }
        });
        
        // Remove assignment fields that are no longer in the definition
        Object.keys(updatedAssignmentFields).forEach(fieldId => {
            if (!assignmentFieldDefinitions.some(f => f.id === fieldId)) {
                delete updatedAssignmentFields[fieldId];
                hasAssignmentChanges = true;
            }
        });
        
        if (hasAssignmentChanges) {
            setValue("assignmentFields", updatedAssignmentFields, { shouldValidate: false });
        }

        // Initialize custom fields with default values if they don't exist
        const customFields = watchedCustomFields || {};
        const updatedCustomFields = { ...customFields };
        let hasCustomChanges = false;
        
        workItemFields.forEach(fieldDef => {
            if (!(fieldDef.id in updatedCustomFields)) {
                // Set default value based on field type
                if (fieldDef.default_value !== undefined && fieldDef.default_value !== null) {
                    // Use the default value as-is (could be string, number, etc.)
                    updatedCustomFields[fieldDef.id] = fieldDef.default_value;
                } else {
                    // Set empty default based on field type
                    updatedCustomFields[fieldDef.id] = "";
                }
                hasCustomChanges = true;
            }
        });
        
        // Remove custom fields that are no longer in the definition
        Object.keys(updatedCustomFields).forEach(fieldId => {
            if (!workItemFields.some(f => f.id === fieldId)) {
                delete updatedCustomFields[fieldId];
                hasCustomChanges = true;
            }
        });
        
        if (hasCustomChanges) {
            setValue("customFields", updatedCustomFields, { shouldValidate: false });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchedType, selectedType]);

    const handleAddLabel = () => {
        if (newLabel.trim() && !watchedLabels.includes(newLabel.trim())) {
            setValue("labels", [...watchedLabels, newLabel.trim()]);
            setNewLabel("");
        }
    };

    const handleRemoveLabel = (labelToRemove: string) => {
        setValue("labels", watchedLabels.filter((label) => label !== labelToRemove));
    };

    // Helper function to build validation rules for custom fields
    const buildFieldValidationRules = (field: WorkItemField) => {
        const rules: any = {
            required: field.required ? `${field.label} is required` : false,
        };

        if (field.validation) {
            if (field.validation.min !== undefined) {
                rules.min = {
                    value: field.validation.min,
                    message: `${field.label} must be at least ${field.validation.min}`,
                };
            }
            if (field.validation.max !== undefined) {
                rules.max = {
                    value: field.validation.max,
                    message: `${field.label} must be at most ${field.validation.max}`,
                };
            }
            if (field.validation.min_length !== undefined) {
                rules.minLength = {
                    value: field.validation.min_length,
                    message: `${field.label} must be at least ${field.validation.min_length} characters`,
                };
            }
            if (field.validation.max_length !== undefined) {
                rules.maxLength = {
                    value: field.validation.max_length,
                    message: `${field.label} must be at most ${field.validation.max_length} characters`,
                };
            }
            if (field.validation.pattern) {
                rules.pattern = {
                    value: new RegExp(field.validation.pattern),
                    message: `${field.label} format is invalid`,
                };
            }
        }

        return rules;
    };

    const onSubmit = (data: WorkItemData) => {
        onSave?.(data);
    };

    const handleSaveAndAddAnother = async () => {
        const isValid = await trigger();
        if (isValid) {
            const formData = getValues();
            // Save the current form data
            await onSubmit(formData);
            // Reset form after successful save, keeping type, priority, status, and assignmentFields
            reset({
                ...formData,
                title: "",
                description: "",
                labels: [],
                dueDate: "",
                customFields: {},
            });
        }
    };

    const handleMove = () => {
        // TODO: Implement move functionality
        console.log("Move clicked");
    };

    const handleStatusChange = () => {
        // TODO: Implement status change functionality
        console.log("Status change clicked");
    };

    return (
        <Box p="4">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Flex direction="column" gap="4">
                    {/* Toolbar */}
                    <Flex justify="between" align="center" gap="3" style={{ paddingBottom: "8px", borderBottom: "1px solid var(--gray-6)" }}>
                        <Flex gap="2">
                            <Button type="submit" size="2">
                                Save
                            </Button>
                            <Button type="button" variant="soft" onClick={handleSaveAndAddAnother} size="2">
                                Save and Add Another
                            </Button>
                        </Flex>
                        <Flex gap="2">
                            <Button type="button" variant="soft" onClick={handleMove} size="2">
                                Move
                            </Button>
                            <Button type="button" variant="soft" onClick={handleStatusChange} size="2">
                                Status
                            </Button>
                            {onCancel && (
                                <Button type="button" variant="soft" onClick={onCancel} size="2">
                                    Cancel
                                </Button>
                            )}
                        </Flex>
                    </Flex>

                    {/* Title Section */}
                    <Flex align="start" gap="4">
                        <Box style={{ width: "120px", flexShrink: 0, paddingTop: "8px" }}>
                            <Text size="2" weight="medium" as="label" htmlFor="title">
                                Title *
                            </Text>
                        </Box>
                        <Box style={{ flex: 1 }}>
                            <TextField.Root
                                id="title"
                                placeholder="Enter work item title..."
                                {...register("title", { required: true })}
                                size="3"
                            />
                        </Box>
                    </Flex>

                    {/* Type Section */}
                    <Flex align="start" gap="4">
                        <Box style={{ width: "120px", flexShrink: 0, paddingTop: "8px" }}>
                            <Text size="2" weight="medium" as="label" htmlFor="type">
                                Type *
                            </Text>
                        </Box>
                        <Box style={{ flex: 1 }}>
                            <Controller
                                name="type"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select.Root
                                        value={field.value && workItemTypes.some(t => (t.id || t.name) === field.value) ? field.value : undefined}
                                        onValueChange={(value) => {
                                            if (value) {
                                                field.onChange(value);
                                            }
                                        }}
                                        disabled={isLoadingTypes || workItemTypes.length === 0}
                                    >
                                        <Select.Trigger id="type" placeholder={isLoadingTypes ? "Loading..." : workItemTypes.length === 0 ? "No types available" : undefined} />
                                        <Select.Content>
                                            {workItemTypes.map((type) => (
                                                <Select.Item key={type.id || type.name} value={type.id || type.name}>
                                                    {type.display_name || type.name}
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Root>
                                )}
                            />
                        </Box>
                    </Flex>

                    <Separator size="4" />

                    {/* Main Content */}
                    <Grid columns="1" gap="4">
                        {/* Main Fields Section */}
                        <Flex direction="column" gap="4">
                            {/* Description */}
                            <Flex align="start" gap="4">
                                <Box style={{ width: "120px", flexShrink: 0, paddingTop: "8px" }}>
                                    <Text size="2" weight="medium" as="label" htmlFor="description">
                                        Description
                                    </Text>
                                </Box>
                                <Box style={{ flex: 1 }}>
                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({ field }) => (
                                            <RichTextEditor
                                                id={"description"}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Enter work item description..."
                                                minHeight="150px"
                                                showToolbar={true}
                                                showCount={false}
                                            />
                                        )}
                                    />
                                </Box>
                            </Flex>

                            {/* Labels */}
                            <Flex align="start" gap="4">
                                <Box style={{ width: "120px", flexShrink: 0, paddingTop: "8px" }}>
                                    <Text size="2" weight="medium" as="label" htmlFor="labels">
                                        Labels
                                    </Text>
                                </Box>
                                <Box style={{ flex: 1 }}>
                                    <Flex gap="2" align="start" wrap="wrap" mb="2">
                                        {watchedLabels.map((label) => (
                                            <Flex
                                                key={label}
                                                align="center"
                                                gap="2"
                                                style={{
                                                    padding: "4px 8px",
                                                    backgroundColor: "var(--accent-3)",
                                                    borderRadius: "var(--radius-2)",
                                                    fontSize: "var(--font-size-1)",
                                                }}
                                            >
                                                <Text size="1">{label}</Text>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="1"
                                                    onClick={() => handleRemoveLabel(label)}
                                                    style={{ padding: 0, minWidth: "auto", height: "auto" }}
                                                >
                                                    <FaXmark size={12} />
                                                </Button>
                                            </Flex>
                                        ))}
                                    </Flex>
                                    <Flex gap="2">
                                        <TextField.Root
                                            id="labels"
                                            placeholder="Add label..."
                                            value={newLabel}
                                            onChange={(e) => setNewLabel(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    handleAddLabel();
                                                }
                                            }}
                                            size="2"
                                            style={{ flex: 1 }}
                                        />
                                        <Button
                                            type="button"
                                            variant="soft"
                                            onClick={handleAddLabel}
                                            size="2"
                                        >
                                            Add
                                        </Button>
                                    </Flex>
                                </Box>
                            </Flex>
                        </Flex>

                        {/* Metadata Section */}
                        <Flex direction="column" gap="4">
                            {/* Priority */}
                            <Flex align="start" gap="4">
                                <Box style={{ width: "120px", flexShrink: 0, paddingTop: "8px" }}>
                                    <Text size="2" weight="medium" as="label" htmlFor="priority">
                                        Priority *
                                    </Text>
                                </Box>
                                <Box style={{ flex: 1 }}>
                                    <Controller
                                        name="priority"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Select.Root
                                                value={field.value && allowedPriorities.some(p => p.id === field.value) ? field.value : undefined}
                                                onValueChange={field.onChange}
                                                disabled={allowedPriorities.length === 0}
                                            >
                                                <Select.Trigger id="priority" placeholder={allowedPriorities.length === 0 ? "No priorities available" : undefined} />
                                                <Select.Content>
                                                    {allowedPriorities.map((priority) => (
                                                        <Select.Item key={priority.id} value={priority.id}>
                                                            {priority.label}
                                                        </Select.Item>
                                                    ))}
                                                </Select.Content>
                                            </Select.Root>
                                        )}
                                    />
                                </Box>
                            </Flex>

                            {/* Status */}
                            <Flex align="start" gap="4">
                                <Box style={{ width: "120px", flexShrink: 0, paddingTop: "8px" }}>
                                    <Text size="2" weight="medium" as="label" htmlFor="status">
                                        Status *
                                    </Text>
                                </Box>
                                <Box style={{ flex: 1 }}>
                                    <Controller
                                        name="status"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Select.Root
                                                value={field.value && allowedStatuses.some(s => s.id === field.value) ? field.value : undefined}
                                                onValueChange={field.onChange}
                                                disabled={allowedStatuses.length === 0}
                                            >
                                                <Select.Trigger id="status" placeholder={allowedStatuses.length === 0 ? "No statuses available" : undefined} />
                                                <Select.Content>
                                                    {allowedStatuses.map((status) => (
                                                        <Select.Item key={status.id} value={status.id}>
                                                            {status.label}
                                                        </Select.Item>
                                                    ))}
                                                </Select.Content>
                                            </Select.Root>
                                        )}
                                    />
                                </Box>
                            </Flex>

                            {/* Assignment Fields */}
                            {assignmentFieldDefinitions.map((fieldDef) => (
                                <Flex key={fieldDef.id} align="start" gap="4">
                                    <Box style={{ width: "120px", flexShrink: 0, paddingTop: "8px" }}>
                                        <Text size="2" weight="medium" as="label" htmlFor={`assignment-${fieldDef.id}`}>
                                            {fieldDef.label}
                                            {fieldDef.required && " *"}
                                        </Text>
                                    </Box>
                                    <Box style={{ flex: 1 }}>
                                        <Controller
                                            name={`assignmentFields.${fieldDef.id}` as const}
                                            control={control}
                                            rules={{ required: fieldDef.required }}
                                            render={({ field }) => (
                                                <Select.Root
                                                    value={field.value || undefined}
                                                    onValueChange={(value) => field.onChange(value || "")}
                                                >
                                                    <Select.Trigger id={`assignment-${fieldDef.id}`} placeholder={`Select ${fieldDef.label.toLowerCase()}`} />
                                                    <Select.Content>
                                                        {/* TODO: Load actual options based on field_type */}
                                                        <Select.Item value="user1">John Doe</Select.Item>
                                                        <Select.Item value="user2">Jane Smith</Select.Item>
                                                        <Select.Item value="user3">Bob Johnson</Select.Item>
                                                    </Select.Content>
                                                </Select.Root>
                                            )}
                                        />
                                    </Box>
                                </Flex>
                            ))}

                            {/* Custom Fields */}
                            {workItemFields.map((fieldDef) => {
                                const fieldName = `customFields.${fieldDef.id}` as const;
                                const fieldError = errors.customFields?.[fieldDef.id];
                                const validationRules = buildFieldValidationRules(fieldDef);
                                
                                return (
                                    <Flex key={fieldDef.id} align="start" gap="4">
                                        <Box style={{ width: "120px", flexShrink: 0, paddingTop: "8px" }}>
                                            <Text size="2" weight="medium" as="label" htmlFor={`custom-${fieldDef.id}`}>
                                                {fieldDef.label}
                                                {fieldDef.required && " *"}
                                            </Text>
                                        </Box>
                                        <Box style={{ flex: 1 }}>
                                            {(() => {
                                                switch (fieldDef.field_type) {
                                                    case "text":
                                                        return (
                                                            <Controller
                                                                name={fieldName}
                                                                control={control}
                                                                rules={validationRules}
                                                                render={({ field: controllerField, fieldState }) => (
                                                                    <TextField.Root
                                                                        id={`custom-${fieldDef.id}`}
                                                                        placeholder={`Enter ${fieldDef.label.toLowerCase()}`}
                                                                        value={controllerField.value || ""}
                                                                        onChange={(e) => controllerField.onChange(e.target.value)}
                                                                        size="3"
                                                                        color={fieldState.error ? "red" : undefined}
                                                                    />
                                                                )}
                                                            />
                                                        );

                                                    case "textarea":
                                                        return (
                                                            <Controller
                                                                name={fieldName}
                                                                control={control}
                                                                rules={validationRules}
                                                                render={({ field: controllerField, fieldState }) => (
                                                                    <TextArea
                                                                        id={`custom-${fieldDef.id}`}
                                                                        placeholder={`Enter ${fieldDef.label.toLowerCase()}`}
                                                                        value={controllerField.value || ""}
                                                                        onChange={(e) => controllerField.onChange(e.target.value)}
                                                                        rows={4}
                                                                        size="3"
                                                                        color={fieldState.error ? "red" : undefined}
                                                                    />
                                                                )}
                                                            />
                                                        );

                                                    case "number":
                                                    case "integer":
                                                        return (
                                                            <Controller
                                                                name={fieldName}
                                                                control={control}
                                                                rules={validationRules}
                                                                render={({ field: controllerField, fieldState }) => (
                                                                    <TextField.Root
                                                                        id={`custom-${fieldDef.id}`}
                                                                        type="number"
                                                                        placeholder={`Enter ${fieldDef.label.toLowerCase()}`}
                                                                        value={controllerField.value !== undefined && controllerField.value !== null ? String(controllerField.value) : ""}
                                                                        onChange={(e) => {
                                                                            const value = e.target.value;
                                                                            // Allow empty string or valid number
                                                                            if (value === "") {
                                                                                controllerField.onChange("");
                                                                            } else if (!isNaN(Number(value))) {
                                                                                controllerField.onChange(fieldDef.field_type === "integer" ? parseInt(value, 10) : Number(value));
                                                                            }
                                                                        }}
                                                                        size="3"
                                                                        color={fieldState.error ? "red" : undefined}
                                                                    />
                                                                )}
                                                            />
                                                        );

                                                    case "date":
                                                    case "datetime":
                                                        return (
                                                            <Controller
                                                                name={fieldName}
                                                                control={control}
                                                                rules={validationRules}
                                                                render={({ field: controllerField, fieldState }) => (
                                                                    <TextField.Root
                                                                        id={`custom-${fieldDef.id}`}
                                                                        type={fieldDef.field_type === "datetime" ? "datetime-local" : "date"}
                                                                        placeholder={`Select ${fieldDef.label.toLowerCase()}`}
                                                                        value={controllerField.value || ""}
                                                                        onChange={(e) => controllerField.onChange(e.target.value)}
                                                                        size="3"
                                                                        color={fieldState.error ? "red" : undefined}
                                                                    />
                                                                )}
                                                            />
                                                        );

                                                    case "select":
                                                        return (
                                                            <Controller
                                                                name={fieldName}
                                                                control={control}
                                                                rules={validationRules}
                                                                render={({ field: controllerField, fieldState }) => (
                                                                    <Select.Root
                                                                        value={controllerField.value || undefined}
                                                                        onValueChange={(value) => controllerField.onChange(value || "")}
                                                                    >
                                                                        <Select.Trigger 
                                                                            id={`custom-${fieldDef.id}`} 
                                                                            placeholder={`Select ${fieldDef.label.toLowerCase()}`}
                                                                            color={fieldState.error ? "red" : undefined}
                                                                        />
                                                                        <Select.Content>
                                                                            {fieldDef.options && fieldDef.options.length > 0 ? (
                                                                                fieldDef.options.map((option) => (
                                                                                    <Select.Item key={option.value} value={option.value}>
                                                                                        {option.label}
                                                                                    </Select.Item>
                                                                                ))
                                                                            ) : (
                                                                                <Select.Item value="" disabled>No options available</Select.Item>
                                                                            )}
                                                                        </Select.Content>
                                                                    </Select.Root>
                                                                )}
                                                            />
                                                        );

                                                    case "radio":
                                                        return (
                                                            <Controller
                                                                name={fieldName}
                                                                control={control}
                                                                rules={validationRules}
                                                                render={({ field: controllerField, fieldState }) => (
                                                                    <Flex direction="column" gap="2">
                                                                        {fieldDef.options && fieldDef.options.length > 0 ? (
                                                                            fieldDef.options.map((option) => (
                                                                                <Flex key={option.value} align="center" gap="2">
                                                                                    <input
                                                                                        type="radio"
                                                                                        id={`custom-${fieldDef.id}-${option.value}`}
                                                                                        name={`custom-${fieldDef.id}`}
                                                                                        value={option.value}
                                                                                        checked={controllerField.value === option.value}
                                                                                        onChange={(e) => controllerField.onChange(e.target.value)}
                                                                                    />
                                                                                    <Text size="2" as="label" htmlFor={`custom-${fieldDef.id}-${option.value}`}>
                                                                                        {option.label}
                                                                                    </Text>
                                                                                </Flex>
                                                                            ))
                                                                        ) : (
                                                                            <Text size="2" color="gray">No options available</Text>
                                                                        )}
                                                                    </Flex>
                                                                )}
                                                            />
                                                        );

                                                    default:
                                                        // Fallback to text input for unknown field types
                                                        return (
                                                            <Controller
                                                                name={fieldName}
                                                                control={control}
                                                                rules={validationRules}
                                                                render={({ field: controllerField, fieldState }) => (
                                                                    <TextField.Root
                                                                        id={`custom-${fieldDef.id}`}
                                                                        placeholder={`Enter ${fieldDef.label.toLowerCase()}`}
                                                                        value={controllerField.value || ""}
                                                                        onChange={(e) => controllerField.onChange(e.target.value)}
                                                                        size="3"
                                                                        color={fieldState.error ? "red" : undefined}
                                                                    />
                                                                )}
                                                            />
                                                        );
                                                }
                                            })()}
                                            {fieldError && (
                                                <Text size="1" color="red" mt="1" as="p">
                                                    {fieldError.message as string}
                                                </Text>
                                            )}
                                        </Box>
                                    </Flex>
                                );
                            })}

                            {/* Project
                            <Flex align="start" gap="4">
                                <Box style={{ width: "120px", flexShrink: 0, paddingTop: "8px" }}>
                                    <Text size="2" weight="medium" as="label" htmlFor="project">
                                        Project
                                    </Text>
                                </Box>
                                <Box style={{ flex: 1 }}>
                                    <Controller
                                        name="project"
                                        control={control}
                                        render={({ field }) => (
                                            <Select.Root
                                                value={field.value || undefined}
                                                onValueChange={(value) => field.onChange(value || "")}
                                            >
                                                <Select.Trigger id="project" placeholder="Select project" />
                                                <Select.Content>
                                                    <Select.Item value="project1">Project Alpha</Select.Item>
                                                    <Select.Item value="project2">Project Beta</Select.Item>
                                                    <Select.Item value="project3">Project Gamma</Select.Item>
                                                </Select.Content>
                                            </Select.Root>
                                        )}
                                    />
                                </Box>
                            </Flex> */}

                            {/* Due Date */}
                            <Flex align="start" gap="4">
                                <Box style={{ width: "120px", flexShrink: 0, paddingTop: "8px" }}>
                                    <Text size="2" weight="medium" as="label" htmlFor="dueDate">
                                        Due Date
                                    </Text>
                                </Box>
                                <Box style={{ flex: 1 }}>
                                    <TextField.Root
                                        id="dueDate"
                                        type="date"
                                        {...register("dueDate")}
                                        size="3"
                                    />
                                </Box>
                            </Flex>
                        </Flex>
                    </Grid>
                </Flex>
            </form>
        </Box>
    );
}

