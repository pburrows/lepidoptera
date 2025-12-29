import { ProjectTemplate } from './types';

/**
 * Technical Support / Tiered Support Template
 * 
 * Support Tier > Incident > Investigation > Resolution Task
 * 
 * Designed for technical support teams with tiered escalation (L1/L2/L3)
 * and structured incident investigation and resolution workflows.
 */
export const technicalSupportTemplate: ProjectTemplate = {
  metadata: {
    id: 'technical-support',
    name: 'Technical Support / Tiered Support',
    description: 'Technical support template with Support Tier, Incident, Investigation, and Resolution Task levels. Includes tiered escalation paths (L1/L2/L3).',
    category: 'Customer Support & Service Management',
  },
  workItemTypes: [
    {
      name: 'support-tier',
      displayName: 'Support Tier',
      allowedChildrenTypeNames: ['incident'],
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
          id: 'tier-manager',
          label: 'Tier Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaLayerGroup',
        color: '#6366f1',
        description: 'A support tier level (L1/L2/L3)',
      },
      workItemFields: [
        {
          id: 'tier-level',
          label: 'Tier Level',
          field_type: 'select',
          required: false,
          options: [
            { value: 'l1', label: 'L1 - First Line' },
            { value: 'l2', label: 'L2 - Second Line' },
            { value: 'l3', label: 'L3 - Third Line' },
            { value: 'escalation', label: 'Escalation' },
          ],
        },
        {
          id: 'escalation-time',
          label: 'Escalation Time (hours)',
          field_type: 'number',
          required: false,
          validation: { min: 0, max: 168 },
        },
      ],
    },
    {
      name: 'incident',
      displayName: 'Incident',
      allowedChildrenTypeNames: ['investigation', 'resolution-task'],
      allowedStatuses: [
        { id: 'reported', label: 'Reported', color: '#6366f1' },
        { id: 'assigned', label: 'Assigned', color: '#3b82f6' },
        { id: 'in-progress', label: 'In Progress', color: '#f59e0b' },
        { id: 'escalated', label: 'Escalated', color: '#8b5cf6' },
        { id: 'resolved', label: 'Resolved', color: '#10b981' },
        { id: 'closed', label: 'Closed', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
        { id: 'critical', label: 'Critical', value: 4, color: '#dc2626' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'assignee',
          label: 'Assignee',
          field_type: 'person',
          required: false,
        },
        {
          id: 'reporter',
          label: 'Reporter',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaExclamationTriangle',
        color: '#ef4444',
        description: 'A technical incident requiring investigation and resolution',
      },
      workItemFields: [
        {
          id: 'severity',
          label: 'Severity',
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
          id: 'affected-systems',
          label: 'Affected Systems',
          field_type: 'text',
          required: false,
        },
        {
          id: 'impact-description',
          label: 'Impact Description',
          field_type: 'text',
          required: false,
        },
        {
          id: 'affected-users',
          label: 'Affected Users',
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
        {
          id: 'knowledge-base-link',
          label: 'Knowledge Base Link',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'investigation',
      displayName: 'Investigation',
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
          id: 'investigator',
          label: 'Investigator',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaSearch',
        color: '#3b82f6',
        description: 'Root cause analysis and diagnostic activities',
      },
      workItemFields: [
        {
          id: 'investigation-notes',
          label: 'Investigation Notes',
          field_type: 'text',
          required: false,
        },
        {
          id: 'root-cause',
          label: 'Root Cause',
          field_type: 'text',
          required: false,
        },
        {
          id: 'diagnostic-steps',
          label: 'Diagnostic Steps',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'resolution-task',
      displayName: 'Resolution Task',
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
        icon: 'FaWrench',
        color: '#10b981',
        description: 'Steps to resolve an incident',
      },
      workItemFields: [
        {
          id: 'resolution-steps',
          label: 'Resolution Steps',
          field_type: 'text',
          required: false,
        },
        {
          id: 'verification',
          label: 'Verification',
          field_type: 'text',
          required: false,
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

