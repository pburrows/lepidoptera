import { ProjectTemplate } from './types';

/**
 * Scrum Project Template
 * 
 * This template creates a standard Scrum project structure with:
 * - Sprint (container for work in a time-boxed iteration)
 * - Epic (large feature or initiative)
 * - User Story (feature from user perspective)
 * - Task (work item to complete a user story)
 * - Bug (defect to fix)
 * - Subtask (smaller work item under a task)
 */
export const scrumTemplate: ProjectTemplate = {
  metadata: {
    id: 'scrum',
    name: 'Scrum Project',
    description: 'A project template for Scrum-based software development with Sprints, Epics, User Stories, Tasks, Bugs, and Subtasks.',
    category: 'Software Development',
  },
  workItemTypes: [
    {
      name: 'sprint',
      displayName: 'Sprint',
      allowedChildrenTypeNames: ['epic', 'user-story', 'task', 'bug'],
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
          id: 'scrum-master',
          label: 'Scrum Master',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaRunning',
        color: '#6366f1',
        description: 'A time-boxed iteration in Scrum methodology',
      },
      workItemFields: [
        {
          id: 'sprint-goal',
          label: 'Sprint Goal',
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
      name: 'epic',
      displayName: 'Epic',
      allowedChildrenTypeNames: ['user-story', 'task'],
      allowedStatuses: [
        { id: 'backlog', label: 'Backlog', color: '#6b7280' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'done', label: 'Done', color: '#10b981' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
        { id: 'critical', label: 'Critical', value: 4, color: '#dc2626' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'product-owner',
          label: 'Product Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaRocket',
        color: '#8b5cf6',
        description: 'A large feature or initiative that spans multiple sprints',
      },
      workItemFields: [
        {
          id: 'business-value',
          label: 'Business Value',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'user-story',
      displayName: 'User Story',
      allowedChildrenTypeNames: ['task', 'subtask'],
      allowedStatuses: [
        { id: 'backlog', label: 'Backlog', color: '#6b7280' },
        { id: 'to-do', label: 'To Do', color: '#9ca3af' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'in-review', label: 'In Review', color: '#f59e0b' },
        { id: 'done', label: 'Done', color: '#10b981' },
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
        icon: 'FaBook',
        color: '#3b82f6',
        description: 'A feature described from the user\'s perspective',
      },
      workItemFields: [
        {
          id: 'story-points',
          label: 'Story Points',
          field_type: 'number',
          required: false,
          validation: {
            min: 1,
            max: 100,
          },
        },
        {
          id: 'acceptance-criteria',
          label: 'Acceptance Criteria',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'task',
      displayName: 'Task',
      allowedChildrenTypeNames: ['subtask'],
      allowedStatuses: [
        { id: 'to-do', label: 'To Do', color: '#9ca3af' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'blocked', label: 'Blocked', color: '#ef4444' },
        { id: 'done', label: 'Done', color: '#10b981' },
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
        color: '#10b981',
        description: 'A work item to complete a user story',
      },
      workItemFields: [
        {
          id: 'estimated-hours',
          label: 'Estimated Hours',
          field_type: 'number',
          required: false,
          validation: {
            min: 0,
            max: 1000,
          },
        },
      ],
    },
    {
      name: 'bug',
      displayName: 'Bug',
      allowedChildrenTypeNames: ['subtask'],
      allowedStatuses: [
        { id: 'reported', label: 'Reported', color: '#ef4444' },
        { id: 'confirmed', label: 'Confirmed', color: '#f59e0b' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'fixed', label: 'Fixed', color: '#10b981' },
        { id: 'verified', label: 'Verified', color: '#059669' },
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
        icon: 'FaBug',
        color: '#ef4444',
        description: 'A defect or issue that needs to be fixed',
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
          id: 'steps-to-reproduce',
          label: 'Steps to Reproduce',
          field_type: 'text',
          required: false,
        },
        {
          id: 'expected-behavior',
          label: 'Expected Behavior',
          field_type: 'text',
          required: false,
        },
        {
          id: 'actual-behavior',
          label: 'Actual Behavior',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'subtask',
      displayName: 'Subtask',
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
          id: 'assignee',
          label: 'Assignee',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaCheckSquare',
        color: '#6b7280',
        description: 'A smaller work item that is part of a task',
      },
      workItemFields: [],
    },
  ],
};

