import { ProjectTemplate } from './types';

/**
 * Management Consulting Template
 * 
 * Engagement > Workstream/Track > Deliverable > Analysis/Work Package > Task
 * 
 * Note: Consider using separate Workspaces (different SQLite databases) to organize
 * different Clients. Each workspace can represent a different client, and engagements
 * within that workspace belong to that client. This provides better data isolation
 * and organization. The Engagement level in this template represents work for a
 * specific client engagement.
 */
export const managementConsultingTemplate: ProjectTemplate = {
  metadata: {
    id: 'management-consulting',
    name: 'Management Consulting',
    description: 'Management consulting template with Engagement, Workstream/Track, Deliverable, Analysis/Work Package, and Task levels. Consider using separate Workspaces for different Clients.',
    category: 'Consulting, Professional Services, and Agencies',
  },
  workItemTypes: [
    {
      name: 'engagement',
      displayName: 'Engagement',
      allowedChildrenTypeNames: ['workstream-track'],
      allowedStatuses: [
        { id: 'proposal', label: 'Proposal', color: '#6366f1' },
        { id: 'active', label: 'Active', color: '#10b981' },
        { id: 'wrapping-up', label: 'Wrapping Up', color: '#f59e0b' },
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
          id: 'engagement-manager',
          label: 'Engagement Manager',
          field_type: 'person',
          required: false,
        },
        {
          id: 'partner',
          label: 'Partner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaHandshake',
        color: '#6366f1',
        description: 'A consulting engagement',
      },
      workItemFields: [
        {
          id: 'client-name',
          label: 'Client Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'engagement-type',
          label: 'Engagement Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'strategy', label: 'Strategy' },
            { value: 'operations', label: 'Operations' },
            { value: 'digital-transformation', label: 'Digital Transformation' },
            { value: 'organizational-change', label: 'Organizational Change' },
          ],
        },
      ],
    },
    {
      name: 'workstream-track',
      displayName: 'Workstream / Track',
      allowedChildrenTypeNames: ['deliverable'],
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
          id: 'workstream-lead',
          label: 'Workstream Lead',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaProjectDiagram',
        color: '#8b5cf6',
        description: 'A workstream or track within an engagement',
      },
      workItemFields: [],
    },
    {
      name: 'deliverable',
      displayName: 'Deliverable',
      allowedChildrenTypeNames: ['analysis-work-package'],
      allowedStatuses: [
        { id: 'planned', label: 'Planned', color: '#6366f1' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'review', label: 'Review', color: '#f59e0b' },
        { id: 'approved', label: 'Approved', color: '#10b981' },
        { id: 'delivered', label: 'Delivered', color: '#059669' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'deliverable-owner',
          label: 'Deliverable Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaGift',
        color: '#3b82f6',
        description: 'A deliverable',
      },
      workItemFields: [
        {
          id: 'deliverable-type',
          label: 'Deliverable Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'report', label: 'Report' },
            { value: 'presentation', label: 'Presentation' },
            { value: 'workshop', label: 'Workshop' },
            { value: 'analysis', label: 'Analysis' },
            { value: 'recommendation', label: 'Recommendation' },
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
    {
      name: 'analysis-work-package',
      displayName: 'Analysis / Work Package',
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
          id: 'consultant',
          label: 'Consultant',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaChartLine',
        color: '#10b981',
        description: 'An analysis or work package',
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

