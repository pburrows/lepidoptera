import { ProjectTemplate } from './types';

/**
 * Six Sigma Project Template
 * 
 * Program > Project (DMAIC) > Phase > Activity > Task
 * 
 * Phases: Define, Measure, Analyze, Improve, Control
 * 
 * Note: DMAIC phases are sequential. Consider if phases might be better represented
 * as statuses or a phase field rather than work item types. However, keeping them
 * as types allows tracking work within each phase.
 * 
 * Also note: The "Project" work item type in this template represents a Six Sigma DMAIC project.
 * Consider using separate Projects in the database for each DMAIC project instead of making
 * it a work item type. Each Project in the database can contain the Phase, Activity, and Task
 * work items. This provides better data isolation and aligns with how Six Sigma projects are
 * typically managed.
 */
export const sixSigmaTemplate: ProjectTemplate = {
  metadata: {
    id: 'six-sigma',
    name: 'Six Sigma Project',
    description: 'Six Sigma DMAIC template with Program, Project, Phase (Define/Measure/Analyze/Improve/Control), Activity, and Task levels. Consider using separate Projects in the database for each DMAIC project.',
    category: 'Manufacturing and Industrial',
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
          id: 'program-champion',
          label: 'Program Champion',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaBuilding',
        color: '#6366f1',
        description: 'A Six Sigma program',
      },
      workItemFields: [],
    },
    {
      name: 'project',
      displayName: 'Project (DMAIC)',
      allowedChildrenTypeNames: ['phase'],
      allowedStatuses: [
        { id: 'define', label: 'Define', color: '#6366f1' },
        { id: 'measure', label: 'Measure', color: '#3b82f6' },
        { id: 'analyze', label: 'Analyze', color: '#8b5cf6' },
        { id: 'improve', label: 'Improve', color: '#10b981' },
        { id: 'control', label: 'Control', color: '#f59e0b' },
        { id: 'completed', label: 'Completed', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'black-belt',
          label: 'Black Belt',
          field_type: 'person',
          required: false,
        },
        {
          id: 'project-sponsor',
          label: 'Project Sponsor',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaProjectDiagram',
        color: '#8b5cf6',
        description: 'A Six Sigma DMAIC project',
      },
      workItemFields: [
        {
          id: 'problem-statement',
          label: 'Problem Statement',
          field_type: 'text',
          required: false,
        },
        {
          id: 'goal-statement',
          label: 'Goal Statement',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'phase',
      displayName: 'Phase',
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
      assignmentFieldDefinitions: [],
      workItemDetails: {
        icon: 'FaLayerGroup',
        color: '#3b82f6',
        description: 'DMAIC phase (Define, Measure, Analyze, Improve, Control)',
      },
      workItemFields: [
        {
          id: 'phase-type',
          label: 'Phase Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'define', label: 'Define' },
            { value: 'measure', label: 'Measure' },
            { value: 'analyze', label: 'Analyze' },
            { value: 'improve', label: 'Improve' },
            { value: 'control', label: 'Control' },
          ],
        },
        {
          id: 'phase-gate-review',
          label: 'Phase Gate Review Date',
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
          id: 'green-belt',
          label: 'Green Belt',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaTasks',
        color: '#10b981',
        description: 'An activity within a DMAIC phase',
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

