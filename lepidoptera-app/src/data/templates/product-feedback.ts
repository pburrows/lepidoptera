import { ProjectTemplate } from './types';

/**
 * Product Feedback Management Template
 * 
 * Product > Feature Request > Feedback > Implementation Task
 * 
 * Designed for product teams managing customer and user feedback, feature
 * requests, voting, and implementation tracking.
 */
export const productFeedbackTemplate: ProjectTemplate = {
  metadata: {
    id: 'product-feedback',
    name: 'Product Feedback Management',
    description: 'Product feedback management template with Product, Feature Request, Feedback, and Implementation Task levels. Manages customer feedback, feature requests, and roadmap planning.',
    category: 'Product Management',
  },
  workItemTypes: [
    {
      name: 'product',
      displayName: 'Product',
      allowedChildrenTypeNames: ['feature-request'],
      allowedStatuses: [
        { id: 'planning', label: 'Planning', color: '#6366f1' },
        { id: 'active', label: 'Active', color: '#10b981' },
        { id: 'maintenance', label: 'Maintenance', color: '#f59e0b' },
        { id: 'sunset', label: 'Sunset', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
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
        icon: 'FaBox',
        color: '#6366f1',
        description: 'A product line',
      },
      workItemFields: [
        {
          id: 'product-name',
          label: 'Product Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'product-version',
          label: 'Product Version',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'feature-request',
      displayName: 'Feature Request',
      allowedChildrenTypeNames: ['feedback', 'implementation-task'],
      allowedStatuses: [
        { id: 'submitted', label: 'Submitted', color: '#6366f1' },
        { id: 'under-review', label: 'Under Review', color: '#3b82f6' },
        { id: 'planned', label: 'Planned', color: '#10b981' },
        { id: 'in-progress', label: 'In Progress', color: '#f59e0b' },
        { id: 'completed', label: 'Completed', color: '#059669' },
        { id: 'rejected', label: 'Rejected', color: '#ef4444' },
        { id: 'duplicate', label: 'Duplicate', color: '#9ca3af' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'requester',
          label: 'Requester',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaLightbulb',
        color: '#3b82f6',
        description: 'Customer or product feedback',
      },
      workItemFields: [
        {
          id: 'request-title',
          label: 'Request Title',
          field_type: 'text',
          required: false,
        },
        {
          id: 'request-description',
          label: 'Request Description',
          field_type: 'text',
          required: false,
        },
        {
          id: 'request-source',
          label: 'Request Source',
          field_type: 'select',
          required: false,
          options: [
            { value: 'customer', label: 'Customer' },
            { value: 'user', label: 'User' },
            { value: 'internal', label: 'Internal' },
            { value: 'sales', label: 'Sales' },
            { value: 'support', label: 'Support' },
          ],
        },
        {
          id: 'votes',
          label: 'Votes',
          field_type: 'number',
          required: false,
          validation: { min: 0 },
        },
        {
          id: 'priority',
          label: 'Priority',
          field_type: 'select',
          required: false,
          options: [
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
            { value: 'critical', label: 'Critical' },
          ],
        },
        {
          id: 'status',
          label: 'Status',
          field_type: 'select',
          required: false,
          options: [
            { value: 'backlog', label: 'Backlog' },
            { value: 'roadmap', label: 'Roadmap' },
            { value: 'in-development', label: 'In Development' },
            { value: 'released', label: 'Released' },
          ],
        },
        {
          id: 'roadmap-quarter',
          label: 'Roadmap Quarter',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'feedback',
      displayName: 'Feedback',
      allowedChildrenTypeNames: [],
      allowedStatuses: [
        { id: 'submitted', label: 'Submitted', color: '#6366f1' },
        { id: 'acknowledged', label: 'Acknowledged', color: '#10b981' },
        { id: 'addressed', label: 'Addressed', color: '#059669' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'feedback-provider',
          label: 'Feedback Provider',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaComment',
        color: '#8b5cf6',
        description: 'User input and votes',
      },
      workItemFields: [
        {
          id: 'feedback-text',
          label: 'Feedback Text',
          field_type: 'text',
          required: false,
        },
        {
          id: 'feedback-type',
          label: 'Feedback Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'vote', label: 'Vote' },
            { value: 'comment', label: 'Comment' },
            { value: 'use-case', label: 'Use Case' },
            { value: 'bug-report', label: 'Bug Report' },
          ],
        },
        {
          id: 'submission-date',
          label: 'Submission Date',
          field_type: 'date',
          required: false,
        },
      ],
    },
    {
      name: 'implementation-task',
      displayName: 'Implementation Task',
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
        icon: 'FaCode',
        color: '#10b981',
        description: 'Development work',
      },
      workItemFields: [
        {
          id: 'task-description',
          label: 'Task Description',
          field_type: 'text',
          required: false,
        },
        {
          id: 'due-date',
          label: 'Due Date',
          field_type: 'date',
          required: false,
        },
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

