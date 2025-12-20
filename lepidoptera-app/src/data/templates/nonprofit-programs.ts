import { ProjectTemplate } from './types';

/**
 * Nonprofit Programs Template
 * 
 * Mission Area > Program > Project > Activity > Task
 * 
 * Note: The "Project" work item type in this template represents a nonprofit project.
 * Consider using separate Projects in the database for each nonprofit project instead
 * of making it a work item type. Each Project in the database can contain the Activity
 * and Task work items. This provides better data isolation and aligns with how nonprofit
 * projects are typically managed.
 */
export const nonprofitProgramsTemplate: ProjectTemplate = {
  metadata: {
    id: 'nonprofit-programs',
    name: 'Nonprofit Programs',
    description: 'Nonprofit programs template with Mission Area, Program, Project, Activity, and Task levels. Consider using separate Projects in the database for each nonprofit project.',
    category: 'Government, Policy, & Nonprofits',
  },
  workItemTypes: [
    {
      name: 'mission-area',
      displayName: 'Mission Area',
      allowedChildrenTypeNames: ['program'],
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
          id: 'mission-director',
          label: 'Mission Director',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaHeart',
        color: '#6366f1',
        description: 'A mission area',
      },
      workItemFields: [
        {
          id: 'mission-statement',
          label: 'Mission Statement',
          field_type: 'text',
          required: false,
        },
      ],
    },
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
      ],
      assignmentFieldDefinitions: [
        {
          id: 'program-director',
          label: 'Program Director',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaHandsHelping',
        color: '#8b5cf6',
        description: 'A nonprofit program',
      },
      workItemFields: [
        {
          id: 'program-goal',
          label: 'Program Goal',
          field_type: 'text',
          required: false,
        },
        {
          id: 'target-audience',
          label: 'Target Audience',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'project',
      displayName: 'Project',
      allowedChildrenTypeNames: ['activity'],
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
          id: 'project-coordinator',
          label: 'Project Coordinator',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaProjectDiagram',
        color: '#3b82f6',
        description: 'A project within a program',
      },
      workItemFields: [
        {
          id: 'project-location',
          label: 'Project Location',
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
      name: 'activity',
      displayName: 'Activity',
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
          id: 'activity-lead',
          label: 'Activity Lead',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaTasks',
        color: '#10b981',
        description: 'An activity within a project',
      },
      workItemFields: [
        {
          id: 'activity-type',
          label: 'Activity Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'outreach', label: 'Outreach' },
            { value: 'education', label: 'Education' },
            { value: 'service-delivery', label: 'Service Delivery' },
            { value: 'advocacy', label: 'Advocacy' },
            { value: 'fundraising', label: 'Fundraising' },
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

