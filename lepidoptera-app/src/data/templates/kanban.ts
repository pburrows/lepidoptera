import { ProjectTemplate } from './types';

/**
 * Kanban Project Template
 * 
 * Simple flow-based template: Epics > Features > Work Items > Tasks
 */
export const kanbanTemplate: ProjectTemplate = {
  metadata: {
    id: 'kanban',
    name: 'Kanban Project',
    description: 'A flow-based project template with Epics, Features, Work Items, and Tasks.',
    category: 'Software Development',
  },
  workItemTypes: [
    {
      name: 'epic',
      displayName: 'Epic',
      allowedChildrenTypeNames: ['feature'],
      allowedStatuses: [
        { id: 'backlog', label: 'Backlog', color: '#6b7280' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'done', label: 'Done', color: '#10b981' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'product-owner',
          label: 'Product Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaRocket',
        color: '#8b5cf6',
        description: 'Large feature or initiative',
      },
      workItemFields: [
        {
          id: 'business-value',
          label: 'Business Value',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'feature',
      displayName: 'Feature',
      allowedChildrenTypeNames: ['work-item'],
      allowedStatuses: [
        { id: 'backlog', label: 'Backlog', color: '#6b7280' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'review', label: 'In Review', color: '#f59e0b' },
        { id: 'done', label: 'Done', color: '#10b981' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'assignee',
          label: 'Assignee',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaStar',
        color: '#3b82f6',
        description: 'A deliverable feature',
      },
      workItemFields: [
        {
          id: 'acceptance-criteria',
          label: 'Acceptance Criteria',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'work-item',
      displayName: 'Work Item',
      allowedChildrenTypeNames: ['task'],
      allowedStatuses: [
        { id: 'backlog', label: 'Backlog', color: '#6b7280' },
        { id: 'to-do', label: 'To Do', color: '#9ca3af' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'done', label: 'Done', color: '#10b981' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'assignee',
          label: 'Assignee',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaClipboardList',
        color: '#10b981',
        description: 'A work item within a feature',
      },
      workItemFields: [],
    },
    {
      name: 'task',
      displayName: 'Task',
      allowedChildrenTypeNames: [],
      allowedStatuses: [
        { id: 'to-do', label: 'To Do', color: '#9ca3af' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'done', label: 'Done', color: '#10b981' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'assignee',
          label: 'Assignee',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaCheckSquare',
        color: '#6b7280',
        description: 'A specific task to complete',
      },
      workItemFields: [
        {
          id: 'estimated-hours',
          label: 'Estimated Hours',
          field_type: 'number',
          required: false,
          validation: { min: 0, max: 1000 },
        },
      ],
    },
  ],
};

