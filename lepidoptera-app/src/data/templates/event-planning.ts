import { ProjectTemplate } from './types';

/**
 * Event Planning Template
 * 
 * Event > Milestones > Workstream > Deliverable > Task
 * 
 * Workstreams: Catering, Venue, A/V, Guest Management
 */
export const eventPlanningTemplate: ProjectTemplate = {
  metadata: {
    id: 'event-planning',
    name: 'Event Planning',
    description: 'Event planning template with Event, Milestones, Workstream (Catering, Venue, A/V, Guest Mgmt), Deliverable, and Task levels.',
    category: 'Event Planning & Media Production',
  },
  workItemTypes: [
    {
      name: 'event',
      displayName: 'Event',
      allowedChildrenTypeNames: ['milestone'],
      allowedStatuses: [
        { id: 'planning', label: 'Planning', color: '#6366f1' },
        { id: 'execution', label: 'Execution', color: '#10b981' },
        { id: 'completed', label: 'Completed', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'event-manager',
          label: 'Event Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaCalendarAlt',
        color: '#6366f1',
        description: 'An event',
      },
      workItemFields: [
        {
          id: 'event-name',
          label: 'Event Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'event-date',
          label: 'Event Date',
          field_type: 'date',
          required: false,
        },
        {
          id: 'event-location',
          label: 'Event Location',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'milestone',
      displayName: 'Milestone',
      allowedChildrenTypeNames: ['workstream'],
      allowedStatuses: [
        { id: 'upcoming', label: 'Upcoming', color: '#6366f1' },
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
        icon: 'FaFlag',
        color: '#8b5cf6',
        description: 'An event milestone',
      },
      workItemFields: [
        {
          id: 'milestone-date',
          label: 'Milestone Date',
          field_type: 'date',
          required: false,
        },
      ],
    },
    {
      name: 'workstream',
      displayName: 'Workstream',
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
        icon: 'FaStream',
        color: '#3b82f6',
        description: 'A workstream (Catering, Venue, A/V, Guest Management)',
      },
      workItemFields: [
        {
          id: 'workstream-type',
          label: 'Workstream Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'catering', label: 'Catering' },
            { value: 'venue', label: 'Venue' },
            { value: 'av', label: 'A/V' },
            { value: 'guest-management', label: 'Guest Management' },
            { value: 'marketing', label: 'Marketing' },
            { value: 'logistics', label: 'Logistics' },
          ],
        },
      ],
    },
    {
      name: 'deliverable',
      displayName: 'Deliverable',
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
          id: 'deliverable-owner',
          label: 'Deliverable Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaGift',
        color: '#10b981',
        description: 'A deliverable within a workstream',
      },
      workItemFields: [
        {
          id: 'due-date',
          label: 'Due Date',
          field_type: 'date',
          required: false,
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

