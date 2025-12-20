import { ProjectTemplate } from './types';

/**
 * PMBOK (Project Management Body of Knowledge) Template
 * 
 * Program > Project > Phase > Work Package > Activity > Task > Subtask
 * 
 * Note: This is a very deep hierarchy (7 levels). Consider if Program might be
 * better as a Project-level metadata or Workspace-level entity.
 * 
 * Also note: The "Project" work item type in this template represents a PMBOK project.
 * Consider using separate Projects in the database for each project instead of making
 * it a work item type. Each Project in the database can contain the Phase, Work Package,
 * Activity, Task, and Subtask work items. This provides better data isolation and aligns
 * with PMBOK's definition of a project as a temporary endeavor with specific objectives.
 */
export const pmbokTemplate: ProjectTemplate = {
  metadata: {
    id: 'pmbok',
    name: 'PMBOK',
    description: 'PMBOK template with Program, Project, Phase, Work Package, Activity, Task, and Subtask levels. Consider using separate Projects in the database for each project.',
    category: 'Software Development',
  },
  workItemTypes: [
    {
      name: 'program',
      displayName: 'Program',
      allowedChildrenTypeNames: ['project'],
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
        description: 'A group of related projects',
      },
      workItemFields: [
        {
          id: 'program-objective',
          label: 'Program Objective',
          field_type: 'text',
          required: false,
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
        color: '#8b5cf6',
        description: 'A temporary endeavor with specific objectives',
      },
      workItemFields: [
        {
          id: 'project-charter',
          label: 'Project Charter Reference',
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
        color: '#3b82f6',
        description: 'A project phase',
      },
      workItemFields: [
        {
          id: 'phase-gate',
          label: 'Phase Gate',
          field_type: 'select',
          required: false,
          options: [
            { value: 'go', label: 'Go' },
            { value: 'go-with-conditions', label: 'Go with Conditions' },
            { value: 'hold', label: 'Hold' },
            { value: 'no-go', label: 'No Go' },
          ],
        },
      ],
    },
    {
      name: 'work-package',
      displayName: 'Work Package',
      allowedChildrenTypeNames: ['activity'],
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
          id: 'work-package-owner',
          label: 'Work Package Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaBox',
        color: '#10b981',
        description: 'A deliverable at the lowest level of WBS',
      },
      workItemFields: [],
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
        color: '#f59e0b',
        description: 'An activity within a work package',
      },
      workItemFields: [
        {
          id: 'duration',
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
      allowedChildrenTypeNames: ['subtask'],
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
    {
      name: 'subtask',
      displayName: 'Subtask',
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
        icon: 'FaList',
        color: '#9ca3af',
        description: 'A subtask within a task',
      },
      workItemFields: [],
    },
  ],
};

