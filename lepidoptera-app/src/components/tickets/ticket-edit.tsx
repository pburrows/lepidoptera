import { useState } from "react";
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
import {RichTextEditor} from "../editor";

export interface TicketData {
    title: string;
    description: string;
    type: string;
    priority: string;
    status: string;
    assignee: string;
    project: string;
    labels: string[];
    dueDate: string;
}

interface TicketEditProps {
    ticket?: TicketData;
    onSave?: (ticket: TicketData) => void;
    onCancel?: () => void;
}

export default function TicketEdit({ ticket, onSave, onCancel }: TicketEditProps) {
    const [formData, setFormData] = useState<TicketData>({
        title: ticket?.title || "",
        description: ticket?.description || "",
        type: ticket?.type || "task",
        priority: ticket?.priority || "medium",
        status: ticket?.status || "open",
        assignee: ticket?.assignee || "",
        project: ticket?.project || "",
        labels: ticket?.labels || [],
        dueDate: ticket?.dueDate || "",
    });

    const [newLabel, setNewLabel] = useState("");

    const handleFieldChange = (field: keyof TicketData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddLabel = () => {
        if (newLabel.trim() && !formData.labels.includes(newLabel.trim())) {
            setFormData((prev) => ({
                ...prev,
                labels: [...prev.labels, newLabel.trim()],
            }));
            setNewLabel("");
        }
    };

    const handleRemoveLabel = (labelToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            labels: prev.labels.filter((label) => label !== labelToRemove),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave?.(formData);
    };

    return (
        <Box p="4">
            <form onSubmit={handleSubmit}>
                <Flex direction="column" gap="4">
                    {/* Title Section */}
                    <Box>
                        <Text size="2" weight="medium" mb="2" as="label" htmlFor="title">
                            Title *
                        </Text>
                        <TextField.Root
                            id="title"
                            placeholder="Enter ticket title..."
                            value={formData.title}
                            onChange={(e) => handleFieldChange("title", e.target.value)}
                            required
                            size="3"
                        />
                    </Box>

                    <Separator size="4" />

                    {/* Main Content Grid */}
                    <Grid columns={{ initial: "1", md: "2" }} gap="4">
                        {/* Left Column - Main Fields */}
                        <Flex direction="column" gap="4">
                            {/* Description */}
                            <Box>
                                <Text size="2" weight="medium" mb="2" as="label" htmlFor="description">
                                    Description
                                </Text>
                                <RichTextEditor
                                    id={"description"}
                                    value={formData.description}
                                    onChange={(html) => handleFieldChange("description", html)}
                                    placeholder="Enter ticket description..."
                                    minHeight="150px"
                                    showToolbar={true}
                                    showCount={false}
                                />
                                {/*<TextArea*/}
                                {/*    id="description"*/}
                                {/*    placeholder="Enter ticket description..."*/}
                                {/*    value={formData.description}*/}
                                {/*    onChange={(e) => handleFieldChange("description", e.target.value)}*/}
                                {/*    rows={10}*/}
                                {/*    size="3"*/}
                                {/*/>*/}

                            </Box>

                            {/* Labels */}
                            <Box>
                                <Text size="2" weight="medium" mb="2" as="label" htmlFor="labels">
                                    Labels
                                </Text>
                                <Flex gap="2" align="start" wrap="wrap">
                                    {formData.labels.map((label) => (
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
                                <Flex gap="2" mt="2">
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

                        {/* Right Column - Metadata */}
                        <Flex direction="column" gap="4">
                            {/* Type */}
                            <Box>
                                <Text size="2" weight="medium" mb="2" as="label" htmlFor="type">
                                    Type *
                                </Text>
                                <Select.Root
                                    value={formData.type}
                                    onValueChange={(value) => handleFieldChange("type", value)}
                                >
                                    <Select.Trigger id="type" />
                                    <Select.Content>
                                        <Select.Item value="bug">Bug</Select.Item>
                                        <Select.Item value="feature">Feature</Select.Item>
                                        <Select.Item value="task">Task</Select.Item>
                                        <Select.Item value="epic">Epic</Select.Item>
                                        <Select.Item value="story">Story</Select.Item>
                                    </Select.Content>
                                </Select.Root>
                            </Box>

                            {/* Priority */}
                            <Box>
                                <Text size="2" weight="medium" mb="2" as="label" htmlFor="priority">
                                    Priority *
                                </Text>
                                <Select.Root
                                    value={formData.priority}
                                    onValueChange={(value) => handleFieldChange("priority", value)}
                                >
                                    <Select.Trigger id="priority" />
                                    <Select.Content>
                                        <Select.Item value="low">Low</Select.Item>
                                        <Select.Item value="medium">Medium</Select.Item>
                                        <Select.Item value="high">High</Select.Item>
                                        <Select.Item value="critical">Critical</Select.Item>
                                    </Select.Content>
                                </Select.Root>
                            </Box>

                            {/* Status */}
                            <Box>
                                <Text size="2" weight="medium" mb="2" as="label" htmlFor="status">
                                    Status *
                                </Text>
                                <Select.Root
                                    value={formData.status}
                                    onValueChange={(value) => handleFieldChange("status", value)}
                                >
                                    <Select.Trigger id="status" />
                                    <Select.Content>
                                        <Select.Item value="open">Open</Select.Item>
                                        <Select.Item value="in-progress">In Progress</Select.Item>
                                        <Select.Item value="review">Review</Select.Item>
                                        <Select.Item value="done">Done</Select.Item>
                                        <Select.Item value="closed">Closed</Select.Item>
                                    </Select.Content>
                                </Select.Root>
                            </Box>

                            {/* Assignee */}
                            <Box>
                                <Text size="2" weight="medium" mb="2" as="label" htmlFor="assignee">
                                    Assignee
                                </Text>
                                <Select.Root
                                    value={formData.assignee || undefined}
                                    onValueChange={(value) => handleFieldChange("assignee", value || "")}
                                >
                                    <Select.Trigger id="assignee" placeholder="Unassigned" />
                                    <Select.Content>
                                        <Select.Item value="user1">John Doe</Select.Item>
                                        <Select.Item value="user2">Jane Smith</Select.Item>
                                        <Select.Item value="user3">Bob Johnson</Select.Item>
                                    </Select.Content>
                                </Select.Root>
                            </Box>

                            {/* Project */}
                            <Box>
                                <Text size="2" weight="medium" mb="2" as="label" htmlFor="project">
                                    Project
                                </Text>
                                <Select.Root
                                    value={formData.project || undefined}
                                    onValueChange={(value) => handleFieldChange("project", value || "")}
                                >
                                    <Select.Trigger id="project" placeholder="Select project" />
                                    <Select.Content>
                                        <Select.Item value="project1">Project Alpha</Select.Item>
                                        <Select.Item value="project2">Project Beta</Select.Item>
                                        <Select.Item value="project3">Project Gamma</Select.Item>
                                    </Select.Content>
                                </Select.Root>
                            </Box>

                            {/* Due Date */}
                            <Box>
                                <Text size="2" weight="medium" mb="2" as="label" htmlFor="dueDate">
                                    Due Date
                                </Text>
                                <TextField.Root
                                    id="dueDate"
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => handleFieldChange("dueDate", e.target.value)}
                                    size="3"
                                />
                            </Box>
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
                            {ticket ? "Update Ticket" : "Create Ticket"}
                        </Button>
                    </Flex>
                </Flex>
            </form>
        </Box>
    );
}