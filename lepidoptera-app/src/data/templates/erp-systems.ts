import { ProjectTemplate } from './types';

/**
 * ERP Systems (SAP, Oracle, NetSuite) Template
 * 
 * Program > Project > WBS Element (Work Breakdown Structure) > Activity > Task
 * 
 * Note: The "Project" work item type in this template represents an ERP implementation project.
 * Consider using separate Projects in the database for each ERP project instead of making
 * it a work item type. Each Project in the database can contain the WBS Element, Activity,
 * and Task work items. This provides better data isolation and aligns with how ERP projects
 * are typically managed in systems like SAP, Oracle, and NetSuite.
 */
export const erpSystemsTemplate: ProjectTemplate = {
  metadata: {
    id: 'erp-systems',
    name: 'ERP Systems (SAP, Oracle, NetSuite)',
    description: 'ERP systems template with Program, Project, WBS Element (Work Breakdown Structure), Activity, and Task levels. Consider using separate Projects in the database for each ERP project.',
    category: 'Manufacturing Project/Operations Management (ISO / ERP-worked)',
  },
  workItemTypes: [
    {
      name: 'program',
      displayName: 'Program',
      allowedChildrenTypeNames: ['project'],
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
          id: 'program-manager',
          label: 'Program Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaBuilding',
        color: '#6366f1',
        description: 'An ERP program',
      },
      workItemFields: [
        {
          id: 'erp-system',
          label: 'ERP System',
          field_type: 'select',
          required: false,
          options: [
            { value: 'sap', label: 'SAP' },
            { value: 'oracle', label: 'Oracle' },
            { value: 'netsuite', label: 'NetSuite' },
            { value: 'microsoft-dynamics', label: 'Microsoft Dynamics' },
            { value: 'other', label: 'Other' },
          ],
        },
      ],
    },
    {
      name: 'project',
      displayName: 'Project',
      allowedChildrenTypeNames: ['wbs-element'],
      allowedStatuses: [
        { id: 'initiating', label: 'Initiating', color: '#6366f1' },
        { id: 'planning', label: 'Planning', color: '#3b82f6' },
        { id: 'executing', label: 'Executing', color: '#10b981' },
        { id: 'monitoring', label: 'Monitoring & Controlling', color: '#f59e0b' },
        { id: 'closing', label: 'Closing', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'project-manager',
          label: 'Project Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaProjectDiagram',
        color: '#8b5cf6',
        description: 'An ERP project',
      },
      workItemFields: [
        {
          id: 'project-code',
          label: 'Project Code',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'wbs-element',
      displayName: 'WBS Element',
      allowedChildrenTypeNames: ['activity'],
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
          id: 'wbs-owner',
          label: 'WBS Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaSitemap',
        color: '#3b82f6',
        description: 'A Work Breakdown Structure element',
      },
      workItemFields: [
        {
          id: 'wbs-code',
          label: 'WBS Code',
          field_type: 'text',
          required: false,
        },
        {
          id: 'budget',
          label: 'Budget',
          field_type: 'number',
          required: false,
          validation: { min: 0 },
        },
      ],
    },
    {
      name: 'activity',
      displayName: 'Activity',
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
          id: 'activity-owner',
          label: 'Activity Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaTasks',
        color: '#10b981',
        description: 'An activity within a WBS element',
      },
      workItemFields: [
        {
          id: 'activity-code',
          label: 'Activity Code',
          field_type: 'text',
          required: false,
        },
        {
          id: 'duration-days',
          label: 'Duration (days)',
          field_type: 'number',
          required: false,
          validation: { min: 0, max: 1000 },
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

