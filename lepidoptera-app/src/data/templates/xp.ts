import { ProjectTemplate } from './types';

/**
 * Extreme Programming (XP) Template
 * 
 * Iteration > Story > Task
 */
export const xpTemplate: ProjectTemplate = {
  metadata: {
    id: 'xp',
    name: 'Extreme Programming (XP)',
    description: 'Extreme Programming template with Iterations, Stories, and Tasks.',
    category: 'Software Development',
  },
  workItemTypes: [
    {
      name: 'iteration',
      displayName: 'Iteration',
      allowedChildrenTypeNames: ['story'],
      allowedStatuses: [
        { id: 'planned', label: 'Planned', color: '#6366f1' },
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
          id: 'coach',
          label: 'XP Coach',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaSync',
        color: '#6366f1',
        description: 'A time-boxed iteration (typically 1-2 weeks)',
      },
      workItemFields: [
        {
          id: 'iteration-goal',
          label: 'Iteration Goal',
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
      name: 'story',
      displayName: 'Story',
      allowedChildrenTypeNames: ['task'],
      allowedStatuses: [
        { id: 'backlog', label: 'Backlog', color: '#6b7280' },
        { id: 'to-do', label: 'To Do', color: '#9ca3af' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'done', label: 'Done', color: '#10b981' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'customer',
          label: 'Customer',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaBook',
        color: '#3b82f6',
        description: 'User story with customer value',
      },
      workItemFields: [
        {
          id: 'story-points',
          label: 'Story Points',
          field_type: 'number',
          required: false,
          validation: { min: 1, max: 100 },
        },
        {
          id: 'acceptance-tests',
          label: 'Acceptance Tests',
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
        { id: 'to-do', label: 'To Do', color: '#9ca3af' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'done', label: 'Done', color: '#10b981' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'pair-programmer',
          label: 'Pair Programmer',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaCheckSquare',
        color: '#10b981',
        description: 'Implementation task',
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

