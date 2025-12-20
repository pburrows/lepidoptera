import { ProjectTemplate } from './types';

/**
 * ITIL (Infrastructure & Operations) Template
 * 
 * Service > Service Offering > Change > Work Item > Task
 * 
 * Note: Consider using separate Workspaces (different SQLite databases) to organize
 * different Services or Service Groups. Each workspace can represent a different
 * service domain, and service offerings within that workspace belong to that domain.
 * This provides better data isolation and organization. If you need to track work
 * across services, you can keep Service as a work item type.
 */
export const itilTemplate: ProjectTemplate = {
  metadata: {
    id: 'itil',
    name: 'ITIL (Infrastructure & Operations)',
    description: 'ITIL template with Service, Service Offering, Change, Work Item, and Task levels. Consider using separate Workspaces for different Services or Service Groups.',
    category: 'IT Operations, DevOps, Infrastructure',
  },
  workItemTypes: [
    {
      name: 'service',
      displayName: 'Service',
      allowedChildrenTypeNames: ['service-offering'],
      allowedStatuses: [
        { id: 'design', label: 'Design', color: '#6366f1' },
        { id: 'transition', label: 'Transition', color: '#3b82f6' },
        { id: 'operation', label: 'Operation', color: '#10b981' },
        { id: 'retired', label: 'Retired', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
        { id: 'critical', label: 'Critical', value: 4, color: '#dc2626' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'service-owner',
          label: 'Service Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaServer',
        color: '#6366f1',
        description: 'An IT service',
      },
      workItemFields: [
        {
          id: 'service-level-agreement',
          label: 'Service Level Agreement',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'service-offering',
      displayName: 'Service Offering',
      allowedChildrenTypeNames: ['change'],
      allowedStatuses: [
        { id: 'available', label: 'Available', color: '#10b981' },
        { id: 'withdrawn', label: 'Withdrawn', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'service-manager',
          label: 'Service Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaBoxOpen',
        color: '#8b5cf6',
        description: 'A service offering',
      },
      workItemFields: [],
    },
    {
      name: 'change',
      displayName: 'Change',
      allowedChildrenTypeNames: ['work-item'],
      allowedStatuses: [
        { id: 'requested', label: 'Requested', color: '#6366f1' },
        { id: 'assessment', label: 'Assessment', color: '#3b82f6' },
        { id: 'authorized', label: 'Authorized', color: '#10b981' },
        { id: 'in-progress', label: 'In Progress', color: '#f59e0b' },
        { id: 'completed', label: 'Completed', color: '#059669' },
        { id: 'closed', label: 'Closed', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
        { id: 'emergency', label: 'Emergency', value: 4, color: '#dc2626' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'change-manager',
          label: 'Change Manager',
          field_type: 'person',
          required: false,
        },
        {
          id: 'change-advisory-board',
          label: 'Change Advisory Board',
          field_type: 'team',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaExchangeAlt',
        color: '#3b82f6',
        description: 'An ITIL change request',
      },
      workItemFields: [
        {
          id: 'change-type',
          label: 'Change Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'normal', label: 'Normal' },
            { value: 'standard', label: 'Standard' },
            { value: 'emergency', label: 'Emergency' },
          ],
        },
        {
          id: 'risk-level',
          label: 'Risk Level',
          field_type: 'select',
          required: false,
          options: [
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ],
        },
      ],
    },
    {
      name: 'work-item',
      displayName: 'Work Item',
      allowedChildrenTypeNames: ['task'],
      allowedStatuses: [
        { id: 'planned', label: 'Planned', color: '#6366f1' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'completed', label: 'Completed', color: '#10b981' },
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
        description: 'A work item within a change',
      },
      workItemFields: [],
    },
    {
      name: 'task',
      displayName: 'Task',
      allowedChildrenTypeNames: [],
      allowedStatuses: [
        { id: 'not-started', label: 'Not Started', color: '#6b7280' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'completed', label: 'Completed', color: '#10b981' },
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
        description: 'A specific task',
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

