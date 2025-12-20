import { ProjectTemplate } from './types';

/**
 * Scaled Agile Framework (SAFe) Template
 * 
 * Portfolio > Value Stream > Epic > Capability > Feature > Story > Task
 * 
 * Note: This is a deep hierarchy (7 levels). Consider if Portfolio and Value Stream
 * might be better as Project-level metadata or Workspace-level entities.
 */
export const safeTemplate: ProjectTemplate = {
  metadata: {
    id: 'safe',
    name: 'SAFe (Scaled Agile Framework)',
    description: 'Scaled Agile Framework template with Portfolio, Value Stream, Epic, Capability, Feature, Story, and Task levels.',
    category: 'Software Development',
  },
  workItemTypes: [
    {
      name: 'portfolio',
      displayName: 'Portfolio',
      allowedChildrenTypeNames: ['value-stream'],
      allowedStatuses: [
        { id: 'planning', label: 'Planning', color: '#6366f1' },
        { id: 'active', label: 'Active', color: '#10b981' },
        { id: 'completed', label: 'Completed', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
        { id: 'critical', label: 'Critical', value: 4, color: '#dc2626' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'portfolio-manager',
          label: 'Portfolio Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaBuilding',
        color: '#6366f1',
        description: 'Highest level portfolio item',
      },
      workItemFields: [
        {
          id: 'strategic-theme',
          label: 'Strategic Theme',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'value-stream',
      displayName: 'Value Stream',
      allowedChildrenTypeNames: ['epic'],
      allowedStatuses: [
        { id: 'planning', label: 'Planning', color: '#6366f1' },
        { id: 'active', label: 'Active', color: '#10b981' },
        { id: 'completed', label: 'Completed', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'value-stream-engineer',
          label: 'Value Stream Engineer',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaStream',
        color: '#8b5cf6',
        description: 'A value stream within a portfolio',
      },
      workItemFields: [],
    },
    {
      name: 'epic',
      displayName: 'Epic',
      allowedChildrenTypeNames: ['capability'],
      allowedStatuses: [
        { id: 'backlog', label: 'Backlog', color: '#6b7280' },
        { id: 'analysis', label: 'Analysis', color: '#6366f1' },
        { id: 'portfolio-backlog', label: 'Portfolio Backlog', color: '#9ca3af' },
        { id: 'implementing', label: 'Implementing', color: '#3b82f6' },
        { id: 'done', label: 'Done', color: '#10b981' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
        { id: 'critical', label: 'Critical', value: 4, color: '#dc2626' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'product-manager',
          label: 'Product Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaRocket',
        color: '#8b5cf6',
        description: 'Large initiative spanning multiple ARTs',
      },
      workItemFields: [
        {
          id: 'business-outcome',
          label: 'Business Outcome',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'capability',
      displayName: 'Capability',
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
        icon: 'FaCog',
        color: '#3b82f6',
        description: 'A solution capability',
      },
      workItemFields: [],
    },
    {
      name: 'feature',
      displayName: 'Feature',
      allowedChildrenTypeNames: ['story'],
      allowedStatuses: [
        { id: 'backlog', label: 'Backlog', color: '#6b7280' },
        { id: 'analysis', label: 'Analysis', color: '#6366f1' },
        { id: 'program-backlog', label: 'Program Backlog', color: '#9ca3af' },
        { id: 'implementing', label: 'Implementing', color: '#3b82f6' },
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
        icon: 'FaStar',
        color: '#3b82f6',
        description: 'A feature deliverable',
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
      name: 'story',
      displayName: 'Story',
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
        icon: 'FaBook',
        color: '#10b981',
        description: 'User story',
      },
      workItemFields: [
        {
          id: 'story-points',
          label: 'Story Points',
          field_type: 'number',
          required: false,
          validation: { min: 1, max: 100 },
        },
      ],
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
        description: 'Implementation task',
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

