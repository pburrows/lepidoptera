import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import {
    Box,
    Button,
    Flex,
    Separator,
    Text,
    TextArea,
    TextField,
} from '@radix-ui/themes';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import './project-general-settings.styles.scss';

interface ProjectGeneralSettingsProps {
    projectId: string;
}

interface ProjectData {
    id?: string;
    name: string;
    description?: string | null;
    created_at?: string;
    updated_at?: string | null;
    is_active?: boolean;
}

interface FormValues {
    name: string;
    description: string;
    iconAttachmentId: string | null;
    color: string;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif'];

export default function ProjectGeneralSettings({ projectId }: ProjectGeneralSettingsProps) {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
        reset,
    } = useForm<FormValues>({
        defaultValues: {
            name: '',
            description: '',
            iconAttachmentId: null,
            color: '#3B82F6',
        },
    });

    const iconAttachmentId = watch('iconAttachmentId');
    const [iconPreview, setIconPreview] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [project, setProject] = React.useState<ProjectData | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const iconContainerRef = useRef<HTMLDivElement>(null);

    // Default icon path
    const defaultIconPath = '/default-project.png';
    const currentIconSrc = iconPreview || defaultIconPath;

    useEffect(() => {
        loadProjectData();
    }, [projectId]);

    // Set up Tauri native drag-and-drop events for Windows Explorer support
    useEffect(() => {
        let unlistenDragOver: (() => void) | null = null;
        let unlistenDragDrop: (() => void) | null = null;

        const setupTauriDragDrop = async () => {
            // Listen for drag-over events
            unlistenDragOver = await listen<{ x: number; y: number }>('tauri://drag-over', (event) => {
                const { x, y } = event.payload;
                if (iconContainerRef.current && document.elementFromPoint(x, y) === iconContainerRef.current) {
                    setIsDragOver(true);
                } else {
                    setIsDragOver(false);
                }
            });

            // Listen for drag-drop events
            unlistenDragDrop = await listen<{ paths: string[]; position: { x: number; y: number } }>('tauri://drag-drop', async (event) => {
                const { paths, position } = event.payload;
                const { x, y } = position;

                // Check if drop is on our icon container
                if (iconContainerRef.current && document.elementFromPoint(x, y) === iconContainerRef.current) {
                    if (paths && paths.length > 0) {
                        await handleTauriFileDrop(paths[0]);
                    }
                }
                setIsDragOver(false);
            });
        };

        setupTauriDragDrop();

        return () => {
            if (unlistenDragOver) unlistenDragOver();
            if (unlistenDragDrop) unlistenDragDrop();
        };
    }, [projectId]);

    const loadProjectData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Load project data
            const projectData = await invoke<ProjectData | null>('get_project_by_id', {
                projectId,
            });

            if (!projectData) {
                setError('Project not found');
                setIsLoading(false);
                return;
            }

            setProject(projectData);

            // Load project settings
            const iconIdResult = await invoke<any>('get_project_setting', {
                projectId,
                settingKey: 'ICON_ATTACHMENT_ID',
            });
            const colorResult = await invoke<any>('get_project_setting', {
                projectId,
                settingKey: 'COLOR',
            });

            const iconId = iconIdResult 
                ? (typeof iconIdResult === 'string' ? iconIdResult : iconIdResult.toString())
                : null;
            const color = colorResult 
                ? (typeof colorResult === 'string' ? colorResult : colorResult.toString())
                : '#3B82F6';

            // Reset form with loaded data
            reset({
                name: projectData.name || '',
                description: projectData.description || '',
                iconAttachmentId: iconId,
                color: color,
            });

            if (iconId) {
                loadIconPreview(iconId);
            }
        } catch (err) {
            console.error('Failed to load project data:', err);
            setError(err instanceof Error ? err.message : 'Failed to load project data');
        } finally {
            setIsLoading(false);
        }
    };

    const loadIconPreview = async (attachmentId: string) => {
        try {
            const attachment = await invoke<{
                id?: string;
                file_content: number[];
                file_type: string;
            }>('get_attachment', {
                attachmentId,
            });

            if (attachment && attachment.file_content) {
                const bytes = new Uint8Array(attachment.file_content);
                const blob = new Blob([bytes], { type: attachment.file_type });
                const reader = new FileReader();
                reader.onloadend = () => {
                    setIconPreview(reader.result as string);
                };
                reader.readAsDataURL(blob);
            }
        } catch (err) {
            console.error('Failed to load icon preview:', err);
        }
    };

    const onDrop = async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setError(null);

        try {
            // Read file as array buffer
            const arrayBuffer = await file.arrayBuffer();
            const fileContent = Array.from(new Uint8Array(arrayBuffer));

            // Create attachment
            const attachment = await invoke<{ id?: string }>('create_attachment', {
                projectId,
                fileName: file.name,
                fileType: file.type || `image/${file.name.split('.').pop()?.toLowerCase()}`,
                fileContent,
                createdBy: 'user',
            });

            if (attachment.id) {
                setValue('iconAttachmentId', attachment.id);
                
                // Update preview
                const reader = new FileReader();
                reader.onloadend = () => {
                    setIconPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            }
        } catch (err) {
            console.error('Failed to upload icon:', err);
            setError(err instanceof Error ? err.message : 'Failed to upload icon');
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/gif': ['.gif'],
        },
        maxSize: MAX_FILE_SIZE,
        multiple: false,
        onDropRejected: (fileRejections) => {
            const rejection = fileRejections[0];
            if (rejection.errors.some(e => e.code === 'file-too-large')) {
                setError(`File size exceeds 2MB limit. File size: ${(rejection.file.size / 1024 / 1024).toFixed(2)}MB`);
            } else if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
                setError('File type not allowed. Please upload a PNG, JPG, or GIF image.');
            } else {
                setError('Failed to upload file. Please try again.');
            }
        },
    });

    const handleTauriFileDrop = async (filePath: string) => {
        setError(null);

        try {
            // Read file info to validate
            const fileName = filePath.split(/[/\\]/).pop() || 'image';
            const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
            
            // Validate file extension
            if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
                setError('File type not allowed. Please upload a PNG, JPG, or GIF image.');
                return;
            }

            // Read file as binary using Tauri command
            const fileContent = await invoke<number[]>('read_file_binary', {
                path: filePath,
            });

            // Validate file size
            if (fileContent.length > MAX_FILE_SIZE) {
                setError(`File size exceeds 2MB limit. File size: ${(fileContent.length / 1024 / 1024).toFixed(2)}MB`);
                return;
            }

            // Determine MIME type
            const mimeTypes: Record<string, string> = {
                'png': 'image/png',
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'gif': 'image/gif',
            };
            const fileType = mimeTypes[fileExtension] || 'image/png';

            // Convert number array to Uint8Array
            const uint8Array = new Uint8Array(fileContent);

            // Create attachment
            const attachment = await invoke<{ id?: string }>('create_attachment', {
                projectId,
                fileName,
                fileType,
                fileContent: Array.from(uint8Array),
                createdBy: 'user',
            });

            if (attachment.id) {
                setValue('iconAttachmentId', attachment.id);
                
                // Update preview
                const blob = new Blob([uint8Array], { type: fileType });
                const reader = new FileReader();
                reader.onloadend = () => {
                    setIconPreview(reader.result as string);
                };
                reader.readAsDataURL(blob);
            }
        } catch (err) {
            console.error('Failed to handle file drop:', err);
            setError(err instanceof Error ? err.message : 'Failed to upload icon');
        }
    };

    const handleRemoveIcon = () => {
        setValue('iconAttachmentId', null);
        setIconPreview(null);
    };

    const onSubmit = async (data: FormValues) => {
        setError(null);

        if (!project) {
            setError('Project data not loaded');
            return;
        }

        try {
            // Update project name and description
            const updatedProject = {
                ...project,
                name: data.name.trim(),
                description: data.description.trim() || null,
            };

            await invoke('update_project', {
                project: updatedProject,
            });

            // Save icon attachment ID setting
            await invoke('set_project_setting', {
                projectId,
                settingKey: 'ICON_ATTACHMENT_ID',
                settingValue: data.iconAttachmentId || null,
                updatedBy: 'user',
            });

            // Save color setting
            await invoke('set_project_setting', {
                projectId,
                settingKey: 'COLOR',
                settingValue: data.color,
                updatedBy: 'user',
            });

            // Reload project data
            await loadProjectData();
        } catch (err) {
            console.error('Failed to save project settings:', err);
            setError(err instanceof Error ? err.message : 'Failed to save project settings');
        }
    };

    if (isLoading) {
        return (
            <div className="project-general-settings">
                <div className="project-general-settings-loading">Loading project settings...</div>
            </div>
        );
    }

    if (error && !project) {
        return (
            <div className="project-general-settings">
                <div className="project-general-settings-error">{error}</div>
            </div>
        );
    }

    return (
        <div className="project-general-settings">
            <form onSubmit={handleSubmit(onSubmit)} className="project-general-settings-form">
                <Box p="4" className="project-general-settings-content">
                    <Flex direction="column" gap="4">
                        {/* Project Name */}
                        <Box>
                            <Text size="2" weight="medium" mb="2" as="label" htmlFor="name">
                                Project Name *
                            </Text>
                            <TextField.Root
                                id="name"
                                placeholder="Enter project name..."
                                {...register('name', {
                                    required: 'Project name is required',
                                    validate: (value) => value.trim().length > 0 || 'Project name cannot be empty',
                                })}
                                size="3"
                                color={errors.name ? 'red' : undefined}
                            />
                            {errors.name && (
                                <Text size="1" color="red" mt="1" as="p">
                                    {errors.name.message}
                                </Text>
                            )}
                        </Box>

                        {/* Description */}
                        <Box>
                            <Text size="2" weight="medium" mb="2" as="label" htmlFor="description">
                                Description
                            </Text>
                            <TextArea
                                id="description"
                                placeholder="Enter project description..."
                                {...register('description')}
                                rows={4}
                                size="3"
                            />
                        </Box>

                        <Separator size="4" />

                        {/* Icon Upload */}
                        <Box>
                            <Text size="2" weight="medium" mb="2" as="label">
                                Project Icon
                            </Text>
                            <Text size="1" color="gray" mb="3" as="p">
                                Click the icon or drag & drop to replace (PNG, JPG, or GIF, max 2MB). Square icons work best.
                            </Text>
                            <Flex direction="column" gap="3" align="start">
                                <div
                                    ref={iconContainerRef}
                                    {...getRootProps()}
                                    className={`project-general-settings-icon-container ${
                                        isDragActive || isDragOver ? 'drag-active' : ''
                                    }`}
                                >
                                    <input {...getInputProps()} />
                                    <img
                                        src={currentIconSrc}
                                        alt="Project icon"
                                        className="project-general-settings-icon-preview"
                                    />
                                    {(isDragActive || isDragOver) && (
                                        <div className="project-general-settings-icon-overlay">
                                            <Text size="3" weight="bold" style={{ color: 'white' }}>
                                                Drop to replace icon
                                            </Text>
                                        </div>
                                    )}
                                </div>
                                {iconAttachmentId && (
                                    <Button
                                        type="button"
                                        variant="soft"
                                        color="red"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveIcon();
                                        }}
                                        size="2"
                                    >
                                        Remove Custom Icon
                                    </Button>
                                )}
                            </Flex>
                        </Box>

                        <Separator size="4" />

                        {/* Color Setting */}
                        <Box>
                            <Text size="2" weight="medium" mb="2" as="label" htmlFor="color">
                                Project Color
                            </Text>
                            <Controller
                                name="color"
                                control={control}
                                render={({ field }) => (
                                    <Flex align="center" gap="3">
                                        <input
                                            type="color"
                                            id="color"
                                            {...field}
                                            className="project-general-settings-color-input"
                                        />
                                        <TextField.Root
                                            placeholder="#3B82F6"
                                            {...field}
                                            size="3"
                                            style={{ width: '120px' }}
                                        />
                                    </Flex>
                                )}
                            />
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
                                type="submit"
                                size="3"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : 'Save Settings'}
                            </Button>
                        </Flex>
                    </Flex>
                </Box>
            </form>
        </div>
    );
}
