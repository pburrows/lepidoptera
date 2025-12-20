import { ProjectTemplate } from './types';

/**
 * Pharmaceutical R&D Template
 * 
 * Portfolio > Program (Disease Area) > Project (Drug Candidate) > Phase (Pre-clinical, Phase I–III) > Study > Protocol Element > Task
 * 
 * Note: The "Project" work item type in this template represents a drug candidate project.
 * Consider using separate Projects in the database for each drug candidate project instead
 * of making it a work item type. Each Project in the database can contain the Phase, Study,
 * Protocol Element, and Task work items. This provides better data isolation and aligns
 * with how pharmaceutical R&D projects are typically managed.
 */
export const pharmaceuticalRdTemplate: ProjectTemplate = {
  metadata: {
    id: 'pharmaceutical-rd',
    name: 'Pharmaceutical R&D',
    description: 'Pharmaceutical R&D template with Portfolio, Program (Disease Area), Project (Drug Candidate), Phase, Study, Protocol Element, and Task levels. Consider using separate Projects in the database for each drug candidate project.',
    category: 'Research & Development (R&D, Pharma, Academia)',
  },
  workItemTypes: [
    {
      name: 'portfolio',
      displayName: 'Portfolio',
      allowedChildrenTypeNames: ['program'],
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
          id: 'portfolio-manager',
          label: 'Portfolio Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaBuilding',
        color: '#6366f1',
        description: 'A drug portfolio',
      },
      workItemFields: [],
    },
    {
      name: 'program',
      displayName: 'Program (Disease Area)',
      allowedChildrenTypeNames: ['project'],
      allowedStatuses: [
        { id: 'research', label: 'Research', color: '#6366f1' },
        { id: 'development', label: 'Development', color: '#3b82f6' },
        { id: 'commercialization', label: 'Commercialization', color: '#10b981' },
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
        icon: 'FaFlask',
        color: '#8b5cf6',
        description: 'A disease area program',
      },
      workItemFields: [
        {
          id: 'disease-area',
          label: 'Disease Area',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'project',
      displayName: 'Project (Drug Candidate)',
      allowedChildrenTypeNames: ['phase'],
      allowedStatuses: [
        { id: 'discovery', label: 'Discovery', color: '#6366f1' },
        { id: 'pre-clinical', label: 'Pre-clinical', color: '#3b82f6' },
        { id: 'phase-i', label: 'Phase I', color: '#8b5cf6' },
        { id: 'phase-ii', label: 'Phase II', color: '#10b981' },
        { id: 'phase-iii', label: 'Phase III', color: '#f59e0b' },
        { id: 'nda-submission', label: 'NDA Submission', color: '#059669' },
        { id: 'approved', label: 'Approved', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
        { id: 'critical', label: 'Critical', value: 4, color: '#dc2626' },
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
        icon: 'FaPills',
        color: '#3b82f6',
        description: 'A drug candidate project',
      },
      workItemFields: [
        {
          id: 'compound-name',
          label: 'Compound Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'indication',
          label: 'Indication',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'phase',
      displayName: 'Phase',
      allowedChildrenTypeNames: ['study'],
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
        description: 'Development phase (Pre-clinical, Phase I, II, III)',
      },
      workItemFields: [
        {
          id: 'phase-type',
          label: 'Phase Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'pre-clinical', label: 'Pre-clinical' },
            { value: 'phase-i', label: 'Phase I' },
            { value: 'phase-ii', label: 'Phase II' },
            { value: 'phase-iii', label: 'Phase III' },
          ],
        },
      ],
    },
    {
      name: 'study',
      displayName: 'Study',
      allowedChildrenTypeNames: ['protocol-element'],
      allowedStatuses: [
        { id: 'protocol-development', label: 'Protocol Development', color: '#6366f1' },
        { id: 'recruiting', label: 'Recruiting', color: '#3b82f6' },
        { id: 'ongoing', label: 'Ongoing', color: '#10b981' },
        { id: 'analysis', label: 'Analysis', color: '#f59e0b' },
        { id: 'completed', label: 'Completed', color: '#059669' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'study-director',
          label: 'Study Director',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaMicroscope',
        color: '#f59e0b',
        description: 'A clinical or pre-clinical study',
      },
      workItemFields: [
        {
          id: 'study-number',
          label: 'Study Number',
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
      name: 'protocol-element',
      displayName: 'Protocol Element',
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
          id: 'element-owner',
          label: 'Element Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaFileAlt',
        color: '#8b5cf6',
        description: 'A protocol element',
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

