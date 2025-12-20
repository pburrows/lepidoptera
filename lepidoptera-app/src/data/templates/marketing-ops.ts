import { ProjectTemplate } from './types';

/**
 * Marketing Ops Template
 * 
 * Campaign > Channel Plan > Asset Group > Asset > Task
 */
export const marketingOpsTemplate: ProjectTemplate = {
  metadata: {
    id: 'marketing-ops',
    name: 'Marketing Ops',
    description: 'Marketing operations template with Campaign, Channel Plan, Asset Group, Asset, and Task levels.',
    category: 'Marketing, Sales, CRM, and GTM',
  },
  workItemTypes: [
    {
      name: 'campaign',
      displayName: 'Campaign',
      allowedChildrenTypeNames: ['channel-plan'],
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
        color: '#6366f1',
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
      name: 'channel-plan',
      displayName: 'Channel Plan',
      allowedChildrenTypeNames: ['asset-group'],
      allowedStatuses: [
        { id: 'planned', label: 'Planned', color: '#6366f1' },
        { id: 'executing', label: 'Executing', color: '#3b82f6' },
        { id: 'completed', label: 'Completed', color: '#10b981' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'channel-manager',
          label: 'Channel Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaChartLine',
        color: '#8b5cf6',
        description: 'A channel plan within a campaign',
      },
      workItemFields: [
        {
          id: 'channel-type',
          label: 'Channel Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'email', label: 'Email' },
            { value: 'social-media', label: 'Social Media' },
            { value: 'paid-advertising', label: 'Paid Advertising' },
            { value: 'content-marketing', label: 'Content Marketing' },
            { value: 'web', label: 'Web' },
          ],
        },
      ],
    },
    {
      name: 'asset-group',
      displayName: 'Asset Group',
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
          id: 'asset-group-owner',
          label: 'Asset Group Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaFolder',
        color: '#3b82f6',
        description: 'A group of related assets',
      },
      workItemFields: [],
    },
    {
      name: 'asset',
      displayName: 'Asset',
      allowedChildrenTypeNames: ['task'],
      allowedStatuses: [
        { id: 'planned', label: 'Planned', color: '#6366f1' },
        { id: 'draft', label: 'Draft', color: '#9ca3af' },
        { id: 'review', label: 'Review', color: '#f59e0b' },
        { id: 'approved', label: 'Approved', color: '#10b981' },
        { id: 'published', label: 'Published', color: '#059669' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'asset-owner',
          label: 'Asset Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaImage',
        color: '#10b981',
        description: 'A marketing asset',
      },
      workItemFields: [
        {
          id: 'asset-type',
          label: 'Asset Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'landing-page', label: 'Landing Page' },
            { value: 'email-template', label: 'Email Template' },
            { value: 'social-post', label: 'Social Post' },
            { value: 'ad-creative', label: 'Ad Creative' },
            { value: 'blog-post', label: 'Blog Post' },
            { value: 'whitepaper', label: 'Whitepaper' },
          ],
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

