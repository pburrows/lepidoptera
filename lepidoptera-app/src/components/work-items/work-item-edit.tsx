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
import type { AllowedStatus, AllowedPriority, AssignmentFieldDefinition } from "../../data/templates/types";

interface WorkItemType {
    id: string | null;
    name: string;
    display_name: string;
    project_id: string;
    is_active: boolean;
    allowed_statuses: AllowedStatus[];
    allowed_priorities: AllowedPriority[];
    assignment_field_definitions: AssignmentFieldDefinition[];
}

export interface WorkItemData {
    title: string;
    description: string;
    type: string;
    priority: string;
    status: string;
    assignmentFields: Record<string, string>; // Map of assignment field ID to value
    project: string;
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
        formState: { errors },
    } = useForm<WorkItemData>({
        defaultValues: {
            title: workItem?.title || "",
            description: workItem?.description || "",
            type: workItem?.type || "",
            priority: workItem?.priority || "",
            status: workItem?.status || "",
            assignmentFields: workItem?.assignmentFields || {},
            project: workItem?.project || "",
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
    
    // Get the currently selected work item type
    const selectedType = workItemTypes.find(
        t => (t.id || t.name) === watchedType
    );
    
    // Get allowed priorities and statuses from selected type
    const allowedPriorities = selectedType?.allowed_priorities || [];
    const allowedStatuses = selectedType?.allowed_statuses || [];
    const assignmentFieldDefinitions = selectedType?.assignment_field_definitions || [];
    
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
        const updatedFields = { ...assignmentFields };
        let hasChanges = false;
        
        assignmentFieldDefinitions.forEach(fieldDef => {
            if (!(fieldDef.id in updatedFields)) {
                updatedFields[fieldDef.id] = fieldDef.default_value || "";
                hasChanges = true;
            }
        });
        
        // Remove assignment fields that are no longer in the definition
        Object.keys(updatedFields).forEach(fieldId => {
            if (!assignmentFieldDefinitions.some(f => f.id === fieldId)) {
                delete updatedFields[fieldId];
                hasChanges = true;
            }
        });
        
        if (hasChanges) {
            setValue("assignmentFields", updatedFields, { shouldValidate: false });
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

    const onSubmit = (data: WorkItemData) => {
        onSave?.(data);
    };

    return (
        <Box p="4">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Flex direction="column" gap="4">
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

                    {/* Main Content Grid */}
                    <Grid columns={{ initial: "1", md: "2" }} gap="4">
                        {/* Left Column - Main Fields */}
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

                        {/* Right Column - Metadata */}
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

                            {/* Project */}
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
                            </Flex>

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

                    <Separator size="4" />

                    {/* Action Buttons */}
                    <Flex justify="end" gap="3">
                        {onCancel && (
                            <Button type="button" variant="soft" onClick={onCancel} size="3">
                                Cancel
                            </Button>
                        )}
                        <Button type="submit" size="3">
                            {workItem ? "Update Work Item" : "Create Work Item"}
                        </Button>
                    </Flex>
                </Flex>
            </form>
        </Box>
    );
}

