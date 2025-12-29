import { ProjectTemplate } from './types';

/**
 * IT Incident Management Template
 * 
 * Service > Incident > Investigation > Resolution
 * 
 * Designed for IT operations teams managing unplanned service interruptions
 * with impact assessment, urgency classification, and resolution tracking.
 */
export const itIncidentManagementTemplate: ProjectTemplate = {
  metadata: {
    id: 'it-incident-management',
    name: 'IT Incident Management',
    description: 'IT incident management template with Service, Incident, Investigation, and Resolution levels. Includes impact assessment and urgency classification.',
    category: 'IT Operations, DevOps, Infrastructure',
  },
  workItemTypes: [
    {
      name: 'service',
      displayName: 'Service',
      allowedChildrenTypeNames: ['incident'],
      allowedStatuses: [
        { id: 'operational', label: 'Operational', color: '#10b981' },
        { id: 'degraded', label: 'Degraded', color: '#f59e0b' },
        { id: 'down', label: 'Down', color: '#ef4444' },
        { id: 'maintenance', label: 'Maintenance', color: '#6366f1' },
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
        description: 'An IT service that may be affected by incidents',
      },
      workItemFields: [
        {
          id: 'service-name',
          label: 'Service Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'service-level-agreement',
          label: 'Service Level Agreement',
          field_type: 'text',
          required: false,
        },
        {
          id: 'uptime-target',
          label: 'Uptime Target (%)',
          field_type: 'number',
          required: false,
          validation: { min: 0, max: 100 },
        },
      ],
    },
    {
      name: 'incident',
      displayName: 'Incident',
      allowedChildrenTypeNames: ['investigation', 'resolution'],
      allowedStatuses: [
        { id: 'logged', label: 'Logged', color: '#6366f1' },
        { id: 'assigned', label: 'Assigned', color: '#3b82f6' },
        { id: 'in-progress', label: 'In Progress', color: '#f59e0b' },
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
          id: 'incident-manager',
          label: 'Incident Manager',
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
        icon: 'FaExclamationCircle',
        color: '#ef4444',
        description: 'An unplanned interruption to an IT service',
      },
      workItemFields: [
        {
          id: 'impact',
          label: 'Impact',
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
          id: 'urgency',
          label: 'Urgency',
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
          id: 'affected-users',
          label: 'Affected Users',
          field_type: 'number',
          required: false,
          validation: { min: 0 },
        },
        {
          id: 'downtime-duration',
          label: 'Downtime Duration (minutes)',
          field_type: 'number',
          required: false,
          validation: { min: 0 },
        },
        {
          id: 'detection-time',
          label: 'Detection Time',
          field_type: 'date',
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
        description: 'Diagnostic activities to understand the incident',
      },
      workItemFields: [
        {
          id: 'investigation-notes',
          label: 'Investigation Notes',
          field_type: 'text',
          required: false,
        },
        {
          id: 'symptoms',
          label: 'Symptoms',
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
      name: 'resolution',
      displayName: 'Resolution',
      allowedChildrenTypeNames: [],
      allowedStatuses: [
        { id: 'not-started', label: 'Not Started', color: '#6b7280' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'completed', label: 'Completed', color: '#10b981' },
        { id: 'verified', label: 'Verified', color: '#059669' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'resolver',
          label: 'Resolver',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaCheckCircle',
        color: '#10b981',
        description: 'Steps taken to restore service',
      },
      workItemFields: [
        {
          id: 'resolution-steps',
          label: 'Resolution Steps',
          field_type: 'text',
          required: false,
        },
        {
          id: 'resolution-time',
          label: 'Resolution Time',
          field_type: 'date',
          required: false,
        },
        {
          id: 'verification-notes',
          label: 'Verification Notes',
          field_type: 'text',
          required: false,
        },
      ],
    },
  ],
};

