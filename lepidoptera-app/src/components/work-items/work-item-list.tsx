import { useState, useEffect, useMemo } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { FaPlus } from 'react-icons/fa6';
import { useNavigate } from '@tanstack/react-router';
import { useNavigationStore } from '../../stores/navigation-store';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    type ColumnDef,
} from '@tanstack/react-table';
import {
    TextField,
    Select,
    Box,
    Flex,
} from '@radix-ui/themes';
import type { AllowedStatus, AssignmentFieldDefinition, WorkItemField } from '../../data/templates/types';

// TypeScript interface matching Rust WorkItemTypeModel
interface WorkItemTypeModel {
    id?: string | null;
    project_id: string;
    created_at: string;
    updated_at?: string | null;
    is_active: boolean;
    name: string;
    display_name: string;
    allowed_children_type_ids: string[];
    allowed_statuses: AllowedStatus[];
    allowed_priorities: Array<{
        id: string;
        label: string;
        value: number;
        color?: string;
    }>;
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
import './work-item-list.styles.scss';

// TypeScript types matching Rust models
interface WorkItemQuery {
    project_id: string;
    statuses?: string[];
    type_ids?: string[];
    assigned_to?: string;
    title_contains?: string;
    page?: number;
    page_size?: number;
}

interface WorkItemListRequest {
    query: WorkItemQuery;
    include_fields?: string[];
}

interface WorkItemListItem {
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
    priority_detail?: {
        id: string;
        label: string;
        value: number;
        color?: string;
    };
    field_values: any[];
}

interface WorkItemListResponse {
    items: WorkItemListItem[];
    total: number;
    page?: number;
    page_size?: number;
    total_pages?: number;
}

interface Person {
    id?: string;
    display_name: string;
    is_active: boolean;
}

export default function WorkItemList() {
    const { activeProjectId } = useNavigationStore();
    const navigate = useNavigate();
    
    // Filter states
    const [searchText, setSearchText] = useState('');
    const [selectedPersonId, setSelectedPersonId] = useState<string | undefined>(undefined);
    const [selectedTypeIds, setSelectedTypeIds] = useState<string[]>([]);
    const [selectedStatusIds, setSelectedStatusIds] = useState<string[]>([]);
    
    // Data states
    const [workItems, setWorkItems] = useState<WorkItemListItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [total, setTotal] = useState(0);
    
    // Filter options
    const [persons, setPersons] = useState<Person[]>([]);
    const [workItemTypes, setWorkItemTypes] = useState<WorkItemTypeModel[]>([]);
    const [allStatuses, setAllStatuses] = useState<AllowedStatus[]>([]);

    // Fetch persons
    useEffect(() => {
        const fetchPersons = async () => {
            try {
                const result = await invoke<Person[]>('get_persons');
                setPersons(result || []);
            } catch (error) {
                console.error('Failed to fetch persons:', error);
            }
        };
        fetchPersons();
    }, []);

    // Fetch work item types
    useEffect(() => {
        if (!activeProjectId) return;
        
        const fetchWorkItemTypes = async () => {
            try {
                const result = await invoke<WorkItemTypeModel[]>('get_work_item_types_by_project', {
                    projectId: activeProjectId,
                });
                setWorkItemTypes(result || []);
                
                // Collect all unique statuses from all types
                const statusMap = new Map<string, AllowedStatus>();
                result?.forEach(type => {
                    type.allowed_statuses?.forEach((status: AllowedStatus) => {
                        if (!statusMap.has(status.id)) {
                            statusMap.set(status.id, status);
                        }
                    });
                });
                setAllStatuses(Array.from(statusMap.values()));
            } catch (error) {
                console.error('Failed to fetch work item types:', error);
            }
        };
        fetchWorkItemTypes();
    }, [activeProjectId]);

    // Fetch work items when filters change
    useEffect(() => {
        if (!activeProjectId) return;
        
        const fetchWorkItems = async () => {
            setIsLoading(true);
            try {
                const request: WorkItemListRequest = {
                    query: {
                        project_id: activeProjectId,
                        page: 1,
                        page_size: 100,
                        ...(searchText && { title_contains: searchText }),
                        ...(selectedPersonId && { assigned_to: selectedPersonId }),
                        ...(selectedTypeIds.length > 0 && { type_ids: selectedTypeIds }),
                        ...(selectedStatusIds.length > 0 && { statuses: selectedStatusIds }),
                    },
                };
                
                const result = await invoke<WorkItemListResponse>('list_work_items', { request });
                setWorkItems(result.items || []);
                setTotal(result.total || 0);
            } catch (error) {
                console.error('Failed to fetch work items:', error);
                setWorkItems([]);
                setTotal(0);
            } finally {
                setIsLoading(false);
            }
        };
        
        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchWorkItems();
        }, searchText ? 300 : 0);
        
        return () => clearTimeout(timeoutId);
    }, [activeProjectId, searchText, selectedPersonId, selectedTypeIds, selectedStatusIds]);

    // Table columns
    const columns = useMemo<ColumnDef<WorkItemListItem>[]>(
        () => [
            {
                accessorKey: 'sequential_number',
                header: 'Number',
                size: 60,
                minSize: 60,
                maxSize: 150,
                cell: (info) => {
                    const sequentialNumber = info.getValue() as string | undefined;
                    const workItemId = info.row.original.id;
                    const displayValue = sequentialNumber || '-';
                    
                    if (!workItemId || displayValue === '-') {
                        return <span>{displayValue}</span>;
                    }
                    
                    return (
                        <span 
                            className="work-item-list-number-link"
                            onClick={(e) => {
                                e.stopPropagation();
                                // Delay navigation to allow double-click detection
                                const timeoutId = setTimeout(() => {
                                    navigate({
                                        to: '/work-items/$id',
                                        params: { id: workItemId },
                                        search: { dialog: false },
                                    });
                                }, 10); 
                                
                                // Store timeout ID on the element so we can clear it on double-click
                                (e.currentTarget as any)._clickTimeout = timeoutId;
                            }}
                            onDoubleClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Clear the single-click timeout
                                const timeoutId = (e.currentTarget as any)._clickTimeout;
                                if (timeoutId) {
                                    clearTimeout(timeoutId);
                                    delete (e.currentTarget as any)._clickTimeout;
                                }
                                // Open in dialog (same as row double-click)
                                invoke('open_new_window', {
                                    route: `/work-items/${workItemId}`,
                                    title: `Work Item ${displayValue}`,
                                    label: `work-item-${workItemId}`,
                                    activeProjectId: activeProjectId || undefined,
                                }).catch((error) => {
                                    console.error('Failed to open work item in dialog:', error);
                                });
                            }}
                        >
                            {displayValue}
                        </span>
                    );
                },
            },
            {
                accessorKey: 'title',
                header: 'Title',
                size: 200,
                minSize: 100,
                maxSize: 800,
                cell: (info) => info.getValue() as string,
            },
            {
                accessorKey: 'status_detail',
                header: 'Status',
                size: 60,
                minSize: 60,
                maxSize: 150,
                cell: (info) => {
                    const status = info.getValue() as AllowedStatus | undefined;
                    return status?.label || info.row.original.status;
                },
            },
            {
                accessorKey: 'type_id',
                header: 'Type',
                size: 60,
                minSize: 60,
                maxSize: 150,
                cell: (info) => {
                    const typeId = info.getValue() as string;
                    const type = workItemTypes.find(t => t.id === typeId);
                    return type?.display_name || typeId;
                },
            },
            {
                accessorKey: 'assigned_to',
                header: 'Assigned To',
                size: 80,
                minSize: 80,
                maxSize: 200,
                cell: (info) => {
                    const personId = info.getValue() as string | undefined;
                    if (!personId) return '-';
                    const person = persons.find(p => p.id === personId);
                    return person?.display_name || personId;
                },
            },
            {
                accessorKey: 'priority_detail',
                header: 'Priority',
                size: 60,
                minSize: 60,
                maxSize: 150,
                cell: (info) => {
                    const priority = info.getValue() as { label?: string; value?: number } | undefined;
                    return priority?.label || info.row.original.priority.toString();
                },
            },
            {
                accessorKey: 'created_at',
                header: 'Created',
                size: 80,
                minSize: 80,
                maxSize: 150,
                cell: (info) => {
                    const date = info.getValue() as string;
                    return date ? new Date(date).toLocaleDateString() : '-';
                },
            },
        ],
        [workItemTypes, persons, activeProjectId, navigate]
    );

    const table = useReactTable({
        data: workItems,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        enableColumnResizing: true,
        columnResizeMode: 'onChange',
        defaultColumn: {
            minSize: 50,
            maxSize: 250,
            size: 150,
        },
        initialState: {
            pagination: {
                pageSize: 100,
            },
        },
    });

    const handleCreateNew = async () => {
        try {
            await invoke('open_new_window', {
                route: '/work-items/new/edit',
                title: 'Create New Work Item',
                label: 'work-item-edit',
                activeProjectId: activeProjectId || undefined,
            });
        } catch (error) {
            console.error('Failed to open new window:', error);
        }
    };

    const handleTypeFilterChange = (typeId: string) => {
        setSelectedTypeIds(prev => {
            if (prev.includes(typeId)) {
                return prev.filter(id => id !== typeId);
            } else {
                return [...prev, typeId];
            }
        });
    };

    const handleStatusFilterChange = (statusId: string) => {
        setSelectedStatusIds(prev => {
            if (prev.includes(statusId)) {
                return prev.filter(id => id !== statusId);
            } else {
                return [...prev, statusId];
            }
        });
    };

    // Get assignment field definitions from all work item types
    const assignmentFieldDefinitions = useMemo(() => {
        const fieldMap = new Map<string, { id: string; label: string; field_type: string }>();
        workItemTypes.forEach(type => {
            type.assignment_field_definitions?.forEach((field: AssignmentFieldDefinition) => {
                if (field.field_type === 'person' && !fieldMap.has(field.id)) {
                    fieldMap.set(field.id, field);
                }
            });
        });
        return Array.from(fieldMap.values());
    }, [workItemTypes]);

    return (
        <div className="work-item-list">
            <div className="work-item-list-toolbar">
                <button 
                    className="work-item-list-create-button"
                    onClick={handleCreateNew}
                >
                    <FaPlus className="work-item-list-create-icon" />
                    <span>Create New</span>
                </button>
                
                <Box style={{ flex: 1 }} />
                
                <Flex gap="3" align="center" style={{ flexWrap: 'wrap' }}>
                    {/* Search */}
                    <TextField.Root
                        placeholder="Search work items..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ minWidth: '200px' }}
                    />
                    
                    {/* Assignment Filter */}
                    {assignmentFieldDefinitions.length > 0 && (
                        <Select.Root
                            value={selectedPersonId || undefined}
                            onValueChange={(value) => {
                                // If value is "all", clear the filter, otherwise set it
                                if (value === 'all') {
                                    setSelectedPersonId(undefined);
                                } else {
                                    setSelectedPersonId(value || undefined);
                                }
                            }}
                        >
                            <Select.Trigger placeholder="Filter by Person" style={{ minWidth: '150px' }} />
                            <Select.Content>
                                <Select.Item value="all">All Persons</Select.Item>
                                {persons.map((person) => {
                                    const personId = person.id || '';
                                    // Skip if personId is empty to avoid the error
                                    if (!personId) return null;
                                    return (
                                        <Select.Item key={personId} value={personId}>
                                            {person.display_name}
                                        </Select.Item>
                                    );
                                })}
                            </Select.Content>
                        </Select.Root>
                    )}
                    
                    {/* Type Filter */}
                    <Select.Root
                        value={undefined}
                        onValueChange={(value) => {
                            if (value && !selectedTypeIds.includes(value)) {
                                setSelectedTypeIds([...selectedTypeIds, value]);
                            }
                        }}
                    >
                        <Select.Trigger 
                            placeholder={selectedTypeIds.length > 0 ? `Add Type Filter (${selectedTypeIds.length} selected)` : "Filter by Type"} 
                            style={{ minWidth: '150px' }} 
                        />
                        <Select.Content>
                            {workItemTypes
                                .filter(type => !selectedTypeIds.includes(type.id || ''))
                                .map((type) => (
                                    <Select.Item key={type.id || ''} value={type.id || ''}>
                                        {type.display_name}
                                    </Select.Item>
                                ))}
                        </Select.Content>
                    </Select.Root>
                    
                    {/* Status Filter */}
                    <Select.Root
                        value={undefined}
                        onValueChange={(value) => {
                            if (value && !selectedStatusIds.includes(value)) {
                                setSelectedStatusIds([...selectedStatusIds, value]);
                            }
                        }}
                    >
                        <Select.Trigger 
                            placeholder={selectedStatusIds.length > 0 ? `Add Status Filter (${selectedStatusIds.length} selected)` : "Filter by Status"} 
                            style={{ minWidth: '150px' }} 
                        />
                        <Select.Content>
                            {allStatuses
                                .filter(status => !selectedStatusIds.includes(status.id))
                                .map((status) => (
                                    <Select.Item key={status.id} value={status.id}>
                                        {status.label}
                                    </Select.Item>
                                ))}
                        </Select.Content>
                    </Select.Root>
                </Flex>
                
                {/* Active filters display */}
                {(selectedTypeIds.length > 0 || selectedStatusIds.length > 0 || selectedPersonId) && (
                    <Flex gap="2" style={{ marginLeft: 'var(--space-3)', flexWrap: 'wrap' }}>
                        {selectedTypeIds.map((typeId) => {
                            const type = workItemTypes.find(t => t.id === typeId);
                            return (
                                <span key={typeId} className="work-item-list-filter-tag">
                                    Type: {type?.display_name || typeId}
                                    <button onClick={() => handleTypeFilterChange(typeId)}>×</button>
                                </span>
                            );
                        })}
                        {selectedStatusIds.map((statusId) => {
                            const status = allStatuses.find(s => s.id === statusId);
                            return (
                                <span key={statusId} className="work-item-list-filter-tag">
                                    Status: {status?.label || statusId}
                                    <button onClick={() => handleStatusFilterChange(statusId)}>×</button>
                                </span>
                            );
                        })}
                        {selectedPersonId && (
                            <span className="work-item-list-filter-tag">
                                Person: {persons.find(p => p.id === selectedPersonId)?.display_name || selectedPersonId}
                                <button onClick={() => setSelectedPersonId(undefined)}>×</button>
                            </span>
                        )}
                    </Flex>
                )}
            </div>

            <div className="work-item-list-content">
                {isLoading ? (
                    <div className="work-item-list-loading">Loading work items...</div>
                ) : workItems.length === 0 ? (
                    <div className="work-item-list-empty">No work items found</div>
                ) : (
                    <div className="work-item-list-table-container">
                        <table className="work-item-list-table">
                            <thead>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <th 
                                                key={header.id}
                                                style={{ 
                                                    width: header.getSize(),
                                                    position: 'relative',
                                                }}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column.columnDef.header,
                                                          header.getContext()
                                                      )}
                                                {header.column.getCanResize() && (
                                                    <div
                                                        onMouseDown={header.getResizeHandler()}
                                                        onTouchStart={header.getResizeHandler()}
                                                        className={`work-item-list-resizer ${
                                                            header.column.getIsResizing() ? 'isResizing' : ''
                                                        }`}
                                                    />
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {table.getRowModel().rows.map(row => {
                                    const workItemId = row.original.id;
                                    const sequentialNumber = row.original.sequential_number || '-';
                                    
                                    return (
                                        <tr 
                                            key={row.id}
                                            className="work-item-list-row"
                                            onDoubleClick={async (e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (workItemId) {
                                                    try {
                                                        await invoke('open_new_window', {
                                                            route: `/work-items/${workItemId}`,
                                                            title: `Work Item ${sequentialNumber}`,
                                                            label: `work-item-${workItemId}`,
                                                            activeProjectId: activeProjectId || undefined,
                                                        });
                                                    } catch (error) {
                                                        console.error('Failed to open work item in dialog:', error);
                                                    }
                                                }
                                            }}
                                        >
                                            {row.getVisibleCells().map(cell => (
                                                <td 
                                                    key={cell.id}
                                                    style={{ width: cell.column.getSize() }}
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div className="work-item-list-pagination">
                            <span>
                                Showing {workItems.length} of {total} work items
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
