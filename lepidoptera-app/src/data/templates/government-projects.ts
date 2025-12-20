import { ProjectTemplate } from './types';

/**
 * Government Project Delivery Template
 * 
 * Initiative > Program > Project > Phase > Work Package > Task
 * 
 * Note: The "Project" work item type in this template represents a government project.
 * Consider using separate Projects in the database for each government project instead
 * of making it a work item type. Each Project in the database can contain the Phase,
 * Work Package, and Task work items. This provides better data isolation and aligns with
 * how government projects are typically managed.
 */
export const governmentProjectsTemplate: ProjectTemplate = {
  metadata: {
    id: 'government-projects',
    name: 'Government Project Delivery',
    description: 'Government project delivery template with Initiative, Program, Project, Phase, Work Package, and Task levels. Consider using separate Projects in the database for each government project.',
    category: 'Government, Policy, & Nonprofits',
  },
  workItemTypes: [
    {
      name: 'initiative',
      displayName: 'Initiative',
      allowedChildrenTypeNames: ['program'],
      allowedStatuses: [
        { id: 'proposed', label: 'Proposed', color: '#6366f1' },
        { id: 'approved', label: 'Approved', color: '#10b981' },
        { id: 'active', label: 'Active', color: '#3b82f6' },
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
          id: 'initiative-sponsor',
          label: 'Initiative Sponsor',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaFlag',
        color: '#6366f1',
        description: 'A government initiative',
      },
      workItemFields: [
        {
          id: 'initiative-number',
          label: 'Initiative Number',
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
          id: 'program-manager',
          label: 'Program Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaBuilding',
        color: '#8b5cf6',
        description: 'A government program',
      },
      workItemFields: [
        {
          id: 'program-budget',
          label: 'Program Budget',
          field_type: 'number',
          required: false,
          validation: { min: 0 },
        },
      ],
    },
    {
      name: 'project',
      displayName: 'Project',
      allowedChildrenTypeNames: ['phase'],
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
        color: '#3b82f6',
        description: 'A government project',
      },
      workItemFields: [
        {
          id: 'project-number',
          label: 'Project Number',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'phase',
      displayName: 'Phase',
      allowedChildrenTypeNames: ['work-package'],
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
      assignmentFieldDefinitions: [],
      workItemDetails: {
        icon: 'FaLayerGroup',
        color: '#10b981',
        description: 'A project phase',
      },
      workItemFields: [
        {
          id: 'phase-name',
          label: 'Phase Name',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'work-package',
      displayName: 'Work Package',
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
          id: 'work-package-manager',
          label: 'Work Package Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaBox',
        color: '#f59e0b',
        description: 'A work package',
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
      ],
    },
  ],
};

