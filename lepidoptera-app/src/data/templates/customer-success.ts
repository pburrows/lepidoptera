import { ProjectTemplate } from './types';

/**
 * Customer Success Template
 * 
 * Customer Account > Success Plan > Engagement > Task
 * 
 * Designed for customer success teams to track customer health, engagement,
 * renewals, and expansion opportunities.
 */
export const customerSuccessTemplate: ProjectTemplate = {
  metadata: {
    id: 'customer-success',
    name: 'Customer Success',
    description: 'Customer success template with Customer Account, Success Plan, Engagement, and Task levels. Includes health scores, renewal tracking, and expansion opportunities.',
    category: 'Customer Support & Service Management',
  },
  workItemTypes: [
    {
      name: 'customer-account',
      displayName: 'Customer Account',
      allowedChildrenTypeNames: ['success-plan'],
      allowedStatuses: [
        { id: 'onboarding', label: 'Onboarding', color: '#6366f1' },
        { id: 'active', label: 'Active', color: '#10b981' },
        { id: 'at-risk', label: 'At Risk', color: '#f59e0b' },
        { id: 'churned', label: 'Churned', color: '#ef4444' },
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
        {
          id: 'customer-success-manager',
          label: 'Customer Success Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaBuilding',
        color: '#6366f1',
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
          id: 'contract-value',
          label: 'Contract Value',
          field_type: 'number',
          required: false,
          validation: { min: 0 },
        },
        {
          id: 'renewal-date',
          label: 'Renewal Date',
          field_type: 'date',
          required: false,
        },
        {
          id: 'health-score',
          label: 'Health Score',
          field_type: 'number',
          required: false,
          validation: { min: 0, max: 100 },
        },
        {
          id: 'churn-risk',
          label: 'Churn Risk',
          field_type: 'select',
          required: false,
          options: [
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
            { value: 'critical', label: 'Critical' },
          ],
        },
      ],
    },
    {
      name: 'success-plan',
      displayName: 'Success Plan',
      allowedChildrenTypeNames: ['engagement'],
      allowedStatuses: [
        { id: 'draft', label: 'Draft', color: '#9ca3af' },
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
          id: 'plan-owner',
          label: 'Plan Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaBullseye',
        color: '#8b5cf6',
        description: 'A customer success plan with goals and milestones',
      },
      workItemFields: [
        {
          id: 'plan-goals',
          label: 'Plan Goals',
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
        {
          id: 'expansion-opportunity',
          label: 'Expansion Opportunity',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'engagement',
      displayName: 'Engagement',
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
          id: 'engagement-owner',
          label: 'Engagement Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaHandshake',
        color: '#3b82f6',
        description: 'A customer engagement (touchpoint, check-in, QBR)',
      },
      workItemFields: [
        {
          id: 'engagement-type',
          label: 'Engagement Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'check-in', label: 'Check-in' },
            { value: 'qbr', label: 'Quarterly Business Review' },
            { value: 'training', label: 'Training' },
            { value: 'onboarding', label: 'Onboarding' },
            { value: 'support', label: 'Support' },
          ],
        },
        {
          id: 'engagement-date',
          label: 'Engagement Date',
          field_type: 'date',
          required: false,
        },
        {
          id: 'notes',
          label: 'Notes',
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
        color: '#10b981',
        description: 'An action item from an engagement',
      },
      workItemFields: [
        {
          id: 'due-date',
          label: 'Due Date',
          field_type: 'date',
          required: false,
        },
        {
          id: 'task-type',
          label: 'Task Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'follow-up', label: 'Follow-up' },
            { value: 'documentation', label: 'Documentation' },
            { value: 'training', label: 'Training' },
            { value: 'renewal', label: 'Renewal' },
            { value: 'expansion', label: 'Expansion' },
          ],
        },
      ],
    },
  ],
};

