import { ProjectTemplate } from './types';

/**
 * Legal Firms Template
 * 
 * Client > Matter/Case > Phase > Work Item > Task
 * 
 * Phases: Discovery, Motions, Trial Prep, etc.
 * Tasks: Drafting, filings, research
 * 
 * Note: Consider using separate Workspaces (different SQLite databases) to organize
 * different Clients. Each workspace can represent a different client, and matters/cases
 * within that workspace belong to that client. This provides better data isolation,
 * confidentiality, and organization. If you need to track work across clients, you can
 * keep Client as a work item type.
 */
export const legalFirmsTemplate: ProjectTemplate = {
  metadata: {
    id: 'legal-firms',
    name: 'Legal Firms',
    description: 'Legal firm template with Client, Matter/Case, Phase, Work Item, and Task levels. Consider using separate Workspaces for different Clients.',
    category: 'Consulting, Professional Services, and Agencies',
  },
  workItemTypes: [
    {
      name: 'client',
      displayName: 'Client',
      allowedChildrenTypeNames: ['matter-case'],
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
          id: 'client-manager',
          label: 'Client Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaUserTie',
        color: '#6366f1',
        description: 'Client account',
      },
      workItemFields: [
        {
          id: 'client-number',
          label: 'Client Number',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'matter-case',
      displayName: 'Matter / Case',
      allowedChildrenTypeNames: ['phase'],
      allowedStatuses: [
        { id: 'open', label: 'Open', color: '#3b82f6' },
        { id: 'active', label: 'Active', color: '#10b981' },
        { id: 'settled', label: 'Settled', color: '#f59e0b' },
        { id: 'closed', label: 'Closed', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
        { id: 'urgent', label: 'Urgent', value: 4, color: '#dc2626' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'attorney',
          label: 'Attorney',
          field_type: 'person',
          required: false,
        },
        {
          id: 'paralegal',
          label: 'Paralegal',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaGavel',
        color: '#8b5cf6',
        description: 'A legal matter or case',
      },
      workItemFields: [
        {
          id: 'matter-number',
          label: 'Matter Number',
          field_type: 'text',
          required: false,
        },
        {
          id: 'case-type',
          label: 'Case Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'litigation', label: 'Litigation' },
            { value: 'transaction', label: 'Transaction' },
            { value: 'compliance', label: 'Compliance' },
            { value: 'advisory', label: 'Advisory' },
          ],
        },
      ],
    },
    {
      name: 'phase',
      displayName: 'Phase',
      allowedChildrenTypeNames: ['work-item'],
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
        color: '#3b82f6',
        description: 'Case phase (Discovery, Motions, Trial Prep, etc.)',
      },
      workItemFields: [
        {
          id: 'phase-type',
          label: 'Phase Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'discovery', label: 'Discovery' },
            { value: 'motions', label: 'Motions' },
            { value: 'trial-prep', label: 'Trial Prep' },
            { value: 'trial', label: 'Trial' },
            { value: 'appeal', label: 'Appeal' },
            { value: 'settlement', label: 'Settlement' },
          ],
        },
        {
          id: 'deadline',
          label: 'Deadline',
          field_type: 'date',
          required: false,
        },
      ],
    },
    {
      name: 'work-item',
      displayName: 'Work Item',
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
        description: 'A work item within a phase',
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
        description: 'A specific task (drafting, filings, research)',
      },
      workItemFields: [
        {
          id: 'task-type',
          label: 'Task Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'drafting', label: 'Drafting' },
            { value: 'filing', label: 'Filing' },
            { value: 'research', label: 'Research' },
            { value: 'meeting', label: 'Meeting' },
            { value: 'review', label: 'Review' },
          ],
        },
        {
          id: 'billable-hours',
          label: 'Billable Hours',
          field_type: 'number',
          required: false,
          validation: { min: 0, max: 1000 },
        },
      ],
    },
  ],
};

