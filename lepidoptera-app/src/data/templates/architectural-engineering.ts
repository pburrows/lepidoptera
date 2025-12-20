import { ProjectTemplate } from './types';

/**
 * Architectural / Engineering Template
 * 
 * Account > Project > Discipline > Deliverable > Sheet/Model/Detail > Task
 * 
 * Note: Consider using separate Workspaces (different SQLite databases) to organize
 * different Accounts/Clients. Each workspace can represent a different client account,
 * and projects within that workspace belong to that account. If you need to track
 * work across accounts, you can keep Account as a work item type, but separate
 * workspaces provide better data isolation and organization.
 * 
 * Also note: The "Project" work item type in this template represents an A/E project.
 * Consider using separate Projects in the database for each A/E project instead of
 * making it a work item type. Each Project in the database can contain the Discipline,
 * Deliverable, Sheet/Model/Detail, and Task work items. This provides better data
 * isolation and aligns with how Projects are typically managed.
 */
export const architecturalEngineeringTemplate: ProjectTemplate = {
  metadata: {
    id: 'architectural-engineering',
    name: 'Architectural / Engineering',
    description: 'A/E template with Account, Project, Discipline, Deliverable, Sheet/Model/Detail, and Task levels. Consider using separate Workspaces for different Accounts/Clients, and separate Projects in the database for each A/E project.',
    category: 'Construction',
  },
  workItemTypes: [
    {
      name: 'account',
      displayName: 'Account',
      allowedChildrenTypeNames: ['project'],
      allowedStatuses: [
        { id: 'active', label: 'Active', color: '#10b981' },
        { id: 'inactive', label: 'Inactive', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'account-manager',
          label: 'Account Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaBuilding',
        color: '#6366f1',
        description: 'Client account',
      },
      workItemFields: [
        {
          id: 'account-number',
          label: 'Account Number',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'project',
      displayName: 'Project',
      allowedChildrenTypeNames: ['discipline'],
      allowedStatuses: [
        { id: 'proposal', label: 'Proposal', color: '#6366f1' },
        { id: 'schematic-design', label: 'Schematic Design', color: '#3b82f6' },
        { id: 'design-development', label: 'Design Development', color: '#8b5cf6' },
        { id: 'construction-docs', label: 'Construction Documents', color: '#10b981' },
        { id: 'construction-admin', label: 'Construction Administration', color: '#f59e0b' },
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
        {
          id: 'principal-in-charge',
          label: 'Principal in Charge',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaDraftingCompass',
        color: '#8b5cf6',
        description: 'A/E project',
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
      name: 'discipline',
      displayName: 'Discipline',
      allowedChildrenTypeNames: ['deliverable'],
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
        color: '#3b82f6',
        description: 'Engineering or architectural discipline',
      },
      workItemFields: [
        {
          id: 'discipline-type',
          label: 'Discipline Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'architectural', label: 'Architectural' },
            { value: 'structural', label: 'Structural' },
            { value: 'mechanical', label: 'Mechanical' },
            { value: 'electrical', label: 'Electrical' },
            { value: 'plumbing', label: 'Plumbing' },
            { value: 'civil', label: 'Civil' },
            { value: 'landscape', label: 'Landscape' },
          ],
        },
      ],
    },
    {
      name: 'deliverable',
      displayName: 'Deliverable',
      allowedChildrenTypeNames: ['sheet-model-detail'],
      allowedStatuses: [
        { id: 'draft', label: 'Draft', color: '#9ca3af' },
        { id: 'in-review', label: 'In Review', color: '#f59e0b' },
        { id: 'approved', label: 'Approved', color: '#10b981' },
        { id: 'issued', label: 'Issued', color: '#3b82f6' },
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
        icon: 'FaFileAlt',
        color: '#10b981',
        description: 'A deliverable (drawing set, report, etc.)',
      },
      workItemFields: [
        {
          id: 'deliverable-type',
          label: 'Deliverable Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'drawing-set', label: 'Drawing Set' },
            { value: 'specification', label: 'Specification' },
            { value: 'report', label: 'Report' },
            { value: 'calculation', label: 'Calculation' },
          ],
        },
      ],
    },
    {
      name: 'sheet-model-detail',
      displayName: 'Sheet / Model / Detail',
      allowedChildrenTypeNames: ['task'],
      allowedStatuses: [
        { id: 'not-started', label: 'Not Started', color: '#6b7280' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'in-review', label: 'In Review', color: '#f59e0b' },
        { id: 'approved', label: 'Approved', color: '#10b981' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'drafter',
          label: 'Drafter / Modeler',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaFile',
        color: '#f59e0b',
        description: 'A sheet, model, or detail',
      },
      workItemFields: [
        {
          id: 'sheet-number',
          label: 'Sheet Number',
          field_type: 'text',
          required: false,
        },
        {
          id: 'revision',
          label: 'Revision',
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

