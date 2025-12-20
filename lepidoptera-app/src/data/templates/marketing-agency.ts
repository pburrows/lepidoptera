import { ProjectTemplate } from './types';

/**
 * Marketing and Creative Agency Project Template
 * 
 * Client > Campaign > Initiative > Asset > Production Task
 * 
 * Note: Consider using separate Workspaces (different SQLite databases) to organize
 * different Clients. Each workspace can represent a different client, and campaigns
 * within that workspace belong to that client. This provides better data isolation
 * and organization. If you need to track work across clients, you can keep Client
 * as a work item type.
 */
export const marketingAgencyTemplate: ProjectTemplate = {
  metadata: {
    id: 'marketing-agency',
    name: 'Marketing and Creative Agency Project',
    description: 'Marketing agency template with Client, Campaign, Initiative, Asset, and Production Task levels. Consider using separate Workspaces for different Clients.',
    category: 'Consulting, Professional Services, and Agencies',
  },
  workItemTypes: [
    {
      name: 'client',
      displayName: 'Client',
      allowedChildrenTypeNames: ['campaign'],
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
          id: 'account-manager',
          label: 'Account Manager',
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
          id: 'client-industry',
          label: 'Client Industry',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'campaign',
      displayName: 'Campaign',
      allowedChildrenTypeNames: ['initiative'],
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
          id: 'campaign-manager',
          label: 'Campaign Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaBullhorn',
        color: '#8b5cf6',
        description: 'A marketing campaign',
      },
      workItemFields: [
        {
          id: 'campaign-objective',
          label: 'Campaign Objective',
          field_type: 'text',
          required: false,
        },
        {
          id: 'start-date',
          label: 'Start Date',
          field_type: 'date',
          required: false,
        },
        {
          id: 'end-date',
          label: 'End Date',
          field_type: 'date',
          required: false,
        },
      ],
    },
    {
      name: 'initiative',
      displayName: 'Initiative',
      allowedChildrenTypeNames: ['asset'],
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
          id: 'initiative-lead',
          label: 'Initiative Lead',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaLightbulb',
        color: '#3b82f6',
        description: 'An initiative within a campaign',
      },
      workItemFields: [
        {
          id: 'channel',
          label: 'Channel',
          field_type: 'select',
          required: false,
          options: [
            { value: 'social-media', label: 'Social Media' },
            { value: 'email', label: 'Email' },
            { value: 'web', label: 'Web' },
            { value: 'print', label: 'Print' },
            { value: 'video', label: 'Video' },
            { value: 'radio', label: 'Radio' },
          ],
        },
      ],
    },
    {
      name: 'asset',
      displayName: 'Asset',
      allowedChildrenTypeNames: ['production-task'],
      allowedStatuses: [
        { id: 'brief', label: 'Brief', color: '#6366f1' },
        { id: 'concept', label: 'Concept', color: '#8b5cf6' },
        { id: 'production', label: 'Production', color: '#3b82f6' },
        { id: 'review', label: 'Review', color: '#f59e0b' },
        { id: 'approved', label: 'Approved', color: '#10b981' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'creative-director',
          label: 'Creative Director',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaImage',
        color: '#10b981',
        description: 'A creative asset',
      },
      workItemFields: [
        {
          id: 'asset-type',
          label: 'Asset Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'graphic', label: 'Graphic' },
            { value: 'video', label: 'Video' },
            { value: 'copy', label: 'Copy' },
            { value: 'photography', label: 'Photography' },
            { value: 'illustration', label: 'Illustration' },
          ],
        },
      ],
    },
    {
      name: 'production-task',
      displayName: 'Production Task',
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
        description: 'A production task',
      },
      workItemFields: [
        {
          id: 'estimated-hours',
          label: 'Estimated Hours',
          field_type: 'number',
          required: false,
          validation: { min: 0, max: 1000 },
        },
        {
          id: 'deadline',
          label: 'Deadline',
          field_type: 'date',
          required: false,
        },
      ],
    },
  ],
};

