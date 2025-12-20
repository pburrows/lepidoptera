import { ProjectTemplate } from './types';

/**
 * Construction Project Template
 * 
 * Program > Project > Phase > Discipline > Work Package > Activity > Task
 * 
 * Phases: pre-construction, design, procurement, construction, commissioning
 * Disciplines: Structural, Mechanical, Electrical, Plumbing, Civil
 * 
 * Note: The "Project" work item type in this template represents a construction project.
 * Consider using separate Projects in the database for each construction project instead
 * of making it a work item type. Each Project in the database can contain the Phase,
 * Discipline, Work Package, Activity, and Task work items. This provides better data
 * isolation and aligns with how construction projects are typically managed.
 */
export const constructionProjectTemplate: ProjectTemplate = {
  metadata: {
    id: 'construction-project',
    name: 'Construction Project',
    description: 'Construction project template with Program, Project, Phase, Discipline, Work Package, Activity, and Task levels. Consider using separate Projects in the database for each construction project.',
    category: 'Construction',
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
        description: 'A construction program',
      },
      workItemFields: [],
    },
    {
      name: 'project',
      displayName: 'Project',
      allowedChildrenTypeNames: ['phase'],
      allowedStatuses: [
        { id: 'pre-construction', label: 'Pre-Construction', color: '#6366f1' },
        { id: 'design', label: 'Design', color: '#3b82f6' },
        { id: 'procurement', label: 'Procurement', color: '#8b5cf6' },
        { id: 'construction', label: 'Construction', color: '#10b981' },
        { id: 'commissioning', label: 'Commissioning', color: '#f59e0b' },
        { id: 'completed', label: 'Completed', color: '#6b7280' },
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
        icon: 'FaHardHat',
        color: '#8b5cf6',
        description: 'A construction project',
      },
      workItemFields: [
        {
          id: 'project-location',
          label: 'Project Location',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'phase',
      displayName: 'Phase',
      allowedChildrenTypeNames: ['discipline'],
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
        description: 'Project phase (pre-construction, design, procurement, construction, commissioning)',
      },
      workItemFields: [
        {
          id: 'phase-type',
          label: 'Phase Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'pre-construction', label: 'Pre-Construction' },
            { value: 'design', label: 'Design' },
            { value: 'procurement', label: 'Procurement' },
            { value: 'construction', label: 'Construction' },
            { value: 'commissioning', label: 'Commissioning' },
          ],
        },
      ],
    },
    {
      name: 'discipline',
      displayName: 'Discipline',
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
      assignmentFieldDefinitions: [
        {
          id: 'discipline-lead',
          label: 'Discipline Lead',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaCog',
        color: '#10b981',
        description: 'Engineering discipline (Structural, Mechanical, Electrical, Plumbing, Civil)',
      },
      workItemFields: [
        {
          id: 'discipline-type',
          label: 'Discipline Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'structural', label: 'Structural' },
            { value: 'mechanical', label: 'Mechanical' },
            { value: 'electrical', label: 'Electrical' },
            { value: 'plumbing', label: 'Plumbing' },
            { value: 'civil', label: 'Civil' },
          ],
        },
      ],
    },
    {
      name: 'work-package',
      displayName: 'Work Package',
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
          id: 'superintendent',
          label: 'Superintendent',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaBox',
        color: '#f59e0b',
        description: 'A work package within a discipline',
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
          id: 'foreman',
          label: 'Foreman',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaTasks',
        color: '#8b5cf6',
        description: 'An activity within a work package',
      },
      workItemFields: [
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
          id: 'craft-worker',
          label: 'Craft Worker',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaCheckSquare',
        color: '#6b7280',
        description: 'A specific construction task',
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

