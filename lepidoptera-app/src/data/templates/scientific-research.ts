import { ProjectTemplate } from './types';

/**
 * Scientific Research Template
 * 
 * Grant / Funding Program > Project > Experiment > Procedure > Step
 * 
 * Note: The "Project" work item type in this template represents a research project.
 * Consider using separate Projects in the database for each research project instead
 * of making it a work item type. Each Project in the database can contain the Experiment,
 * Procedure, and Step work items. This provides better data isolation and aligns with how
 * research projects are typically managed.
 */
export const scientificResearchTemplate: ProjectTemplate = {
  metadata: {
    id: 'scientific-research',
    name: 'Scientific Research',
    description: 'Scientific research template with Grant/Funding Program, Project, Experiment, Procedure, and Step levels. Consider using separate Projects in the database for each research project.',
    category: 'Research & Development (R&D, Pharma, Academia)',
  },
  workItemTypes: [
    {
      name: 'grant-funding-program',
      displayName: 'Grant / Funding Program',
      allowedChildrenTypeNames: ['project'],
      allowedStatuses: [
        { id: 'application', label: 'Application', color: '#6366f1' },
        { id: 'awarded', label: 'Awarded', color: '#10b981' },
        { id: 'active', label: 'Active', color: '#3b82f6' },
        { id: 'completed', label: 'Completed', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'principal-investigator',
          label: 'Principal Investigator',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaUniversity',
        color: '#6366f1',
        description: 'A grant or funding program',
      },
      workItemFields: [
        {
          id: 'grant-number',
          label: 'Grant Number',
          field_type: 'text',
          required: false,
        },
        {
          id: 'funding-amount',
          label: 'Funding Amount',
          field_type: 'number',
          required: false,
          validation: { min: 0 },
        },
      ],
    },
    {
      name: 'project',
      displayName: 'Project',
      allowedChildrenTypeNames: ['experiment'],
      allowedStatuses: [
        { id: 'planning', label: 'Planning', color: '#6366f1' },
        { id: 'active', label: 'Active', color: '#10b981' },
        { id: 'analysis', label: 'Analysis', color: '#3b82f6' },
        { id: 'publication', label: 'Publication', color: '#8b5cf6' },
        { id: 'completed', label: 'Completed', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'project-lead',
          label: 'Project Lead',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaFlask',
        color: '#8b5cf6',
        description: 'A research project',
      },
      workItemFields: [
        {
          id: 'research-question',
          label: 'Research Question',
          field_type: 'text',
          required: false,
        },
        {
          id: 'hypothesis',
          label: 'Hypothesis',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'experiment',
      displayName: 'Experiment',
      allowedChildrenTypeNames: ['procedure'],
      allowedStatuses: [
        { id: 'designed', label: 'Designed', color: '#6366f1' },
        { id: 'running', label: 'Running', color: '#3b82f6' },
        { id: 'data-collection', label: 'Data Collection', color: '#10b981' },
        { id: 'completed', label: 'Completed', color: '#059669' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'experimenter',
          label: 'Experimenter',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaMicroscope',
        color: '#3b82f6',
        description: 'A scientific experiment',
      },
      workItemFields: [
        {
          id: 'experiment-number',
          label: 'Experiment Number',
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
      name: 'procedure',
      displayName: 'Procedure',
      allowedChildrenTypeNames: ['step'],
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
          id: 'procedure-owner',
          label: 'Procedure Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaClipboardList',
        color: '#10b981',
        description: 'A procedure within an experiment',
      },
      workItemFields: [
        {
          id: 'procedure-name',
          label: 'Procedure Name',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'step',
      displayName: 'Step',
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
        description: 'A step within a procedure',
      },
      workItemFields: [
        {
          id: 'step-number',
          label: 'Step Number',
          field_type: 'number',
          required: false,
          validation: { min: 1, max: 1000 },
        },
        {
          id: 'duration-minutes',
          label: 'Duration (minutes)',
          field_type: 'number',
          required: false,
          validation: { min: 0, max: 10000 },
        },
      ],
    },
  ],
};

