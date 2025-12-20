import { ProjectTemplate } from './types';

/**
 * Sales Operation Template
 * 
 * Territory/Segment > Account > Opportunity > Stage > Task
 * 
 * Note: Consider using separate Workspaces (different SQLite databases) to organize
 * different Territories/Segments. Each workspace can represent a different territory
 * or market segment, and accounts within that workspace belong to that territory.
 * This provides better data isolation and organization. If you need to track work
 * across territories, you can keep Territory/Segment as a work item type.
 */
export const salesOpsTemplate: ProjectTemplate = {
  metadata: {
    id: 'sales-ops',
    name: 'Sales Operation',
    description: 'Sales operations template with Territory/Segment, Account, Opportunity, Stage, and Task levels. Consider using separate Workspaces for different Territories/Segments.',
    category: 'Marketing, Sales, CRM, and GTM',
  },
  workItemTypes: [
    {
      name: 'territory-segment',
      displayName: 'Territory / Segment',
      allowedChildrenTypeNames: ['account'],
      allowedStatuses: [
        { id: 'active', label: 'Active', color: '#10b981' },
        { id: 'inactive', label: 'Inactive', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'territory-manager',
          label: 'Territory Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaMap',
        color: '#6366f1',
        description: 'A sales territory or market segment',
      },
      workItemFields: [
        {
          id: 'territory-name',
          label: 'Territory Name',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'account',
      displayName: 'Account',
      allowedChildrenTypeNames: ['opportunity'],
      allowedStatuses: [
        { id: 'prospect', label: 'Prospect', color: '#6366f1' },
        { id: 'active', label: 'Active', color: '#10b981' },
        { id: 'inactive', label: 'Inactive', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'account-manager',
          label: 'Account Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaBuilding',
        color: '#8b5cf6',
        description: 'A customer account',
      },
      workItemFields: [
        {
          id: 'account-name',
          label: 'Account Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'industry',
          label: 'Industry',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'opportunity',
      displayName: 'Opportunity',
      allowedChildrenTypeNames: ['stage'],
      allowedStatuses: [
        { id: 'qualification', label: 'Qualification', color: '#6366f1' },
        { id: 'needs-analysis', label: 'Needs Analysis', color: '#3b82f6' },
        { id: 'proposal', label: 'Proposal', color: '#8b5cf6' },
        { id: 'negotiation', label: 'Negotiation', color: '#f59e0b' },
        { id: 'closed-won', label: 'Closed Won', color: '#10b981' },
        { id: 'closed-lost', label: 'Closed Lost', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'sales-rep',
          label: 'Sales Rep',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaHandshake',
        color: '#3b82f6',
        description: 'A sales opportunity',
      },
      workItemFields: [
        {
          id: 'opportunity-value',
          label: 'Opportunity Value',
          field_type: 'number',
          required: false,
          validation: { min: 0 },
        },
        {
          id: 'close-date',
          label: 'Close Date',
          field_type: 'date',
          required: false,
        },
      ],
    },
    {
      name: 'stage',
      displayName: 'Stage',
      allowedChildrenTypeNames: ['task'],
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
      assignmentFieldDefinitions: [],
      workItemDetails: {
        icon: 'FaLayerGroup',
        color: '#10b981',
        description: 'A stage within the sales process',
      },
      workItemFields: [
        {
          id: 'stage-name',
          label: 'Stage Name',
          field_type: 'text',
          required: false,
        },
      ],
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
          id: 'task-type',
          label: 'Task Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'call', label: 'Call' },
            { value: 'email', label: 'Email' },
            { value: 'meeting', label: 'Meeting' },
            { value: 'demo', label: 'Demo' },
            { value: 'proposal', label: 'Proposal' },
            { value: 'follow-up', label: 'Follow-up' },
          ],
        },
        {
          id: 'due-date',
          label: 'Due Date',
          field_type: 'date',
          required: false,
        },
      ],
    },
  ],
};

