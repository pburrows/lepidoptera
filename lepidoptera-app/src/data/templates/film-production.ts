import { ProjectTemplate } from './types';

/**
 * Film / Video Production Template
 * 
 * Production > Department > Scene > Shot > Task
 */
export const filmProductionTemplate: ProjectTemplate = {
  metadata: {
    id: 'film-production',
    name: 'Film / Video Production',
    description: 'Film/video production template with Production, Department, Scene, Shot, and Task levels.',
    category: 'Event Planning & Media Production',
  },
  workItemTypes: [
    {
      name: 'production',
      displayName: 'Production',
      allowedChildrenTypeNames: ['department'],
      allowedStatuses: [
        { id: 'pre-production', label: 'Pre-Production', color: '#6366f1' },
        { id: 'production', label: 'Production', color: '#10b981' },
        { id: 'post-production', label: 'Post-Production', color: '#3b82f6' },
        { id: 'completed', label: 'Completed', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'producer',
          label: 'Producer',
          field_type: 'person',
          required: false,
        },
        {
          id: 'director',
          label: 'Director',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaVideo',
        color: '#6366f1',
        description: 'A film or video production',
      },
      workItemFields: [
        {
          id: 'production-title',
          label: 'Production Title',
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
      name: 'department',
      displayName: 'Department',
      allowedChildrenTypeNames: ['scene'],
      allowedStatuses: [
        { id: 'planning', label: 'Planning', color: '#6366f1' },
        { id: 'active', label: 'Active', color: '#10b981' },
        { id: 'wrapped', label: 'Wrapped', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'department-head',
          label: 'Department Head',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaUsers',
        color: '#8b5cf6',
        description: 'A production department',
      },
      workItemFields: [
        {
          id: 'department-type',
          label: 'Department Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'camera', label: 'Camera' },
            { value: 'sound', label: 'Sound' },
            { value: 'lighting', label: 'Lighting' },
            { value: 'art', label: 'Art' },
            { value: 'wardrobe', label: 'Wardrobe' },
            { value: 'makeup', label: 'Makeup' },
            { value: 'grip', label: 'Grip' },
            { value: 'production', label: 'Production' },
          ],
        },
      ],
    },
    {
      name: 'scene',
      displayName: 'Scene',
      allowedChildrenTypeNames: ['shot'],
      allowedStatuses: [
        { id: 'scheduled', label: 'Scheduled', color: '#6366f1' },
        { id: 'shooting', label: 'Shooting', color: '#3b82f6' },
        { id: 'completed', label: 'Completed', color: '#10b981' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [],
      workItemDetails: {
        icon: 'FaFilm',
        color: '#3b82f6',
        description: 'A scene in the production',
      },
      workItemFields: [
        {
          id: 'scene-number',
          label: 'Scene Number',
          field_type: 'text',
          required: false,
        },
        {
          id: 'location',
          label: 'Location',
          field_type: 'text',
          required: false,
        },
        {
          id: 'shoot-date',
          label: 'Shoot Date',
          field_type: 'date',
          required: false,
        },
      ],
    },
    {
      name: 'shot',
      displayName: 'Shot',
      allowedChildrenTypeNames: ['task'],
      allowedStatuses: [
        { id: 'planned', label: 'Planned', color: '#6366f1' },
        { id: 'shooting', label: 'Shooting', color: '#3b82f6' },
        { id: 'completed', label: 'Completed', color: '#10b981' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'camera-operator',
          label: 'Camera Operator',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaCamera',
        color: '#10b981',
        description: 'A shot within a scene',
      },
      workItemFields: [
        {
          id: 'shot-number',
          label: 'Shot Number',
          field_type: 'text',
          required: false,
        },
        {
          id: 'shot-type',
          label: 'Shot Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'wide', label: 'Wide' },
            { value: 'medium', label: 'Medium' },
            { value: 'close-up', label: 'Close-up' },
            { value: 'extreme-close-up', label: 'Extreme Close-up' },
            { value: 'establishing', label: 'Establishing' },
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
        description: 'A specific production task',
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

