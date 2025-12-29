import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
    Box,
    Button,
    Flex,
    Grid,
    Separator,
    Text,
    TextArea,
    TextField,
} from '@radix-ui/themes';
import { invoke } from '@tauri-apps/api/core';
import { getAllTemplates, type ProjectTemplate } from '../../data/templates';
import { useNavigationStore, type Project } from '../../stores/navigation-store';
import './project-edit.styles.scss';

interface ProjectFormData {
    name: string;
    description: string;
    selectedTemplateId: string;
    sequencePrefix: string;
}

// Popular templates that appear in the "Popular" category
const POPULAR_TEMPLATE_IDS = ['scrum', 'kanban', 'customer-support', 'bug-tracking'];

export default function ProjectEdit() {
    const navigate = useNavigate();
    const { fetchProjects } = useNavigationStore();
    const templates = getAllTemplates();
    
    const [formData, setFormData] = useState<ProjectFormData>({
        name: '',
        description: '',
        selectedTemplateId: '',
        sequencePrefix: '',
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('Popular');

    const handleFieldChange = (field: keyof ProjectFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setError(null);
    };

    const handleTemplateSelect = (templateId: string) => {
        setFormData((prev) => ({ ...prev, selectedTemplateId: templateId }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.name.trim()) {
            setError('Project name is required');
            return;
        }

        if (!formData.selectedTemplateId) {
            setError('Please select a project template');
            return;
        }

        if (!formData.sequencePrefix.trim()) {
            setError('Sequence prefix is required');
            return;
        }

        setIsSubmitting(true);

        try {
            // Create the project
            const project = await invoke<Project>('create_project', {
                project: {
                    name: formData.name.trim(),
                    description: formData.description.trim() || null,
                    is_active: true,
                },
            });

            if (!project.id) {
                throw new Error('Failed to create project: project ID is missing');
            }

            // Set the SEQUENCE_PREFIX setting
            await invoke('set_project_setting', {
                projectId: project.id,
                settingKey: 'SEQUENCE_PREFIX',
                settingValue: formData.sequencePrefix.trim().toUpperCase(),
                updatedBy: 'user',
            });

            // Apply the selected template
            const selectedTemplate = templates.find(
                (t) => t.metadata.id === formData.selectedTemplateId
            );

            if (selectedTemplate) {
                await invoke('apply_project_template', {
                    projectId: project.id,
                    workItemTypes: selectedTemplate.workItemTypes,
                });
            }

            // Refresh projects list
            await fetchProjects();

            // Navigate back to projects list
            navigate({ to: '/projects-manage', search: { dialog: false } });
        } catch (err) {
            console.error('Failed to create project:', err);
            setError(err instanceof Error ? err.message : 'Failed to create project');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate({ to: '/projects-manage', search: { dialog: false } });
    };

    // Get all unique categories (excluding Popular which is special)
    const categories = Array.from(
        new Set(templates.map((t) => t.metadata.category || 'Other'))
    ).sort();

    // Add "Popular" as the first category
    const allCategories = ['Popular', ...categories];

    // Get templates for the selected category
    const getTemplatesForCategory = (category: string): ProjectTemplate[] => {
        if (category === 'Popular') {
            return templates.filter((t) => POPULAR_TEMPLATE_IDS.includes(t.metadata.id));
        }
        return templates.filter((t) => (t.metadata.category || 'Other') === category);
    };

    const filteredTemplates = getTemplatesForCategory(selectedCategory);

    return (
        <div className="project-edit">
            <div className="project-edit-header">
                <h1 className="project-edit-title">Create New Project</h1>
            </div>

            <form onSubmit={handleSubmit} className="project-edit-form">
                <Box p="4" className="project-edit-content">
                    <Flex direction="column" gap="4">
                        {/* Project Name */}
                        <Box>
                            <Text size="2" weight="medium" mb="2" as="label" htmlFor="name">
                                Project Name *
                            </Text>
                            <TextField.Root
                                id="name"
                                placeholder="Enter project name..."
                                value={formData.name}
                                onChange={(e) => handleFieldChange('name', e.target.value)}
                                required
                                size="3"
                            />
                        </Box>

                        {/* Description */}
                        <Box>
                            <Text size="2" weight="medium" mb="2" as="label" htmlFor="description">
                                Description
                            </Text>
                            <TextArea
                                id="description"
                                placeholder="Enter project description..."
                                value={formData.description}
                                onChange={(e) => handleFieldChange('description', e.target.value)}
                                rows={4}
                                size="3"
                            />
                        </Box>

                        {/* Sequence Prefix */}
                        <Box>
                            <Text size="2" weight="medium" mb="2" as="label" htmlFor="sequencePrefix">
                                Sequence Prefix *
                            </Text>
                            <TextField.Root
                                id="sequencePrefix"
                                placeholder="e.g., MAIN, PROJ, DEV"
                                value={formData.sequencePrefix}
                                onChange={(e) => handleFieldChange('sequencePrefix', e.target.value.toUpperCase())}
                                required
                                size="3"
                                maxLength={10}
                            />
                            <Text size="1" color="gray" mt="1" as="p">
                                Used for work item numbering (e.g., MAIN-001, PROJ-002)
                            </Text>
                        </Box>

                        <Separator size="4" />

                        {/* Template Selection */}
                        <Box>
                            <Text size="2" weight="medium" mb="3" as="label">
                                Project Template *
                            </Text>
                            <div className="project-edit-template-selection">
                                {/* Categories List */}
                                <div className="project-edit-categories">
                                    {allCategories.map((category) => (
                                        <button
                                            key={category}
                                            type="button"
                                            className={`project-edit-category-item ${
                                                selectedCategory === category ? 'selected' : ''
                                            }`}
                                            onClick={() => setSelectedCategory(category)}
                                        >
                                            <Text size="2" weight="regular">
                                                {category}
                                            </Text>
                                        </button>
                                    ))}
                                </div>

                                {/* Templates Grid */}
                                <div className="project-edit-templates-grid">
                                    {filteredTemplates.length > 0 ? (
                                        <Grid columns={{ initial: '1', md: '2', lg: '2' }} gap="3">
                                            {filteredTemplates.map((template) => (
                                                <button
                                                    key={template.metadata.id}
                                                    type="button"
                                                    className={`project-edit-template-card ${
                                                        formData.selectedTemplateId === template.metadata.id
                                                            ? 'selected'
                                                            : ''
                                                    }`}
                                                    onClick={() => handleTemplateSelect(template.metadata.id)}
                                                >
                                                    <div className="project-edit-template-header">
                                                        <Text size="4" weight="bold" as="div">
                                                            {template.metadata.name}
                                                        </Text>
                                                    </div>
                                                    <Text size="2" color="gray" as="p" mt="2">
                                                        {template.metadata.description}
                                                    </Text>
                                                    {template.metadata.icon && (
                                                        <div className="project-edit-template-icon">
                                                            {template.metadata.icon}
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </Grid>
                                    ) : (
                                        <Box py="6">
                                            <Text size="2" color="gray" as="p">
                                                No templates found in this category.
                                            </Text>
                                        </Box>
                                    )}
                                </div>
                            </div>
                        </Box>

                        {/* Error Message */}
                        {error && (
                            <Box>
                                <Text size="2" color="red" as="p">
                                    {error}
                                </Text>
                            </Box>
                        )}

                        <Separator size="4" />

                        {/* Action Buttons */}
                        <Flex justify="end" gap="3">
                            <Button
                                type="button"
                                variant="soft"
                                onClick={handleCancel}
                                size="3"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" size="3" disabled={isSubmitting}>
                                {isSubmitting ? 'Creating...' : 'Create Project'}
                            </Button>
                        </Flex>
                    </Flex>
                </Box>
            </form>
        </div>
    );
}

