import { ProjectTemplate } from './types';

/**
 * Customer Support / Help Desk Template
 * 
 * Support Queue > Ticket > Thread > Follow-up Task
 * 
 * Designed for customer support teams managing tickets across different queues,
 * channels, and priorities with SLA tracking and customer satisfaction metrics.
 */
export const customerSupportTemplate: ProjectTemplate = {
  metadata: {
    id: 'customer-support',
    name: 'Customer Support / Help Desk',
    description: 'Customer support template with Support Queue, Ticket, Thread, and Follow-up Task levels. Includes SLA tracking and customer satisfaction metrics.',
    category: 'Customer Support & Service Management',
  },
  workItemTypes: [
    {
      name: 'support-queue',
      displayName: 'Support Queue',
      allowedChildrenTypeNames: ['ticket'],
      allowedStatuses: [
        { id: 'active', label: 'Active', color: '#10b981' },
        { id: 'paused', label: 'Paused', color: '#f59e0b' },
        { id: 'archived', label: 'Archived', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'queue-manager',
          label: 'Queue Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaInbox',
        color: '#6366f1',
        description: 'A support queue for organizing tickets by team, product, or priority',
      },
      workItemFields: [
        {
          id: 'queue-name',
          label: 'Queue Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'sla-target',
          label: 'SLA Target (hours)',
          field_type: 'number',
          required: false,
          validation: { min: 0, max: 168 },
        },
      ],
    },
    {
      name: 'ticket',
      displayName: 'Ticket',
      allowedChildrenTypeNames: ['thread', 'follow-up-task'],
      allowedStatuses: [
        { id: 'new', label: 'New', color: '#6366f1' },
        { id: 'open', label: 'Open', color: '#3b82f6' },
        { id: 'in-progress', label: 'In Progress', color: '#f59e0b' },
        { id: 'waiting-customer', label: 'Waiting for Customer', color: '#8b5cf6' },
        { id: 'resolved', label: 'Resolved', color: '#10b981' },
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
          id: 'assignee',
          label: 'Assignee',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaTicketAlt',
        color: '#3b82f6',
        description: 'A customer support ticket',
      },
      workItemFields: [
        {
          id: 'customer-name',
          label: 'Customer Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'customer-email',
          label: 'Customer Email',
          field_type: 'text',
          required: false,
        },
        {
          id: 'channel',
          label: 'Channel',
          field_type: 'select',
          required: false,
          options: [
            { value: 'email', label: 'Email' },
            { value: 'chat', label: 'Chat' },
            { value: 'phone', label: 'Phone' },
            { value: 'web', label: 'Web Form' },
            { value: 'social', label: 'Social Media' },
          ],
        },
        {
          id: 'sla-deadline',
          label: 'SLA Deadline',
          field_type: 'date',
          required: false,
        },
        {
          id: 'satisfaction-score',
          label: 'Satisfaction Score',
          field_type: 'number',
          required: false,
          validation: { min: 1, max: 5 },
        },
        {
          id: 'first-response-time',
          label: 'First Response Time (minutes)',
          field_type: 'number',
          required: false,
          validation: { min: 0 },
        },
        {
          id: 'resolution-time',
          label: 'Resolution Time (minutes)',
          field_type: 'number',
          required: false,
          validation: { min: 0 },
        },
      ],
    },
    {
      name: 'thread',
      displayName: 'Thread',
      allowedChildrenTypeNames: [],
      allowedStatuses: [
        { id: 'active', label: 'Active', color: '#3b82f6' },
        { id: 'closed', label: 'Closed', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [],
      workItemDetails: {
        icon: 'FaComments',
        color: '#8b5cf6',
        description: 'A conversation thread within a ticket',
      },
      workItemFields: [
        {
          id: 'message-count',
          label: 'Message Count',
          field_type: 'number',
          required: false,
          validation: { min: 0 },
        },
        {
          id: 'last-message-date',
          label: 'Last Message Date',
          field_type: 'date',
          required: false,
        },
      ],
    },
    {
      name: 'follow-up-task',
      displayName: 'Follow-up Task',
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
        description: 'An internal task to resolve a ticket',
      },
      workItemFields: [
        {
          id: 'task-type',
          label: 'Task Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'research', label: 'Research' },
            { value: 'escalation', label: 'Escalation' },
            { value: 'follow-up', label: 'Follow-up' },
            { value: 'documentation', label: 'Documentation' },
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

