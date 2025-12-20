import { ProjectTemplate } from './types';

/**
 * PRINCE2 Template
 * 
 * Program > Project > Stage > Product > Deliverable > Work Package > Task
 * 
 * Note: This is a very deep hierarchy (7 levels). Consider if Program might be
 * better as a Project-level metadata or Workspace-level entity.
 * 
 * Also note: The "Project" work item type in this template represents a PRINCE2 project.
 * Consider using separate Projects in the database for each project instead of making
 * it a work item type. Each Project in the database can contain the Stage, Product,
 * Deliverable, Work Package, and Task work items. This provides better data isolation
 * and aligns with PRINCE2's project management approach.
 */
export const prince2Template: ProjectTemplate = {
  metadata: {
    id: 'prince2',
    name: 'PRINCE2',
    description: 'PRINCE2 template with Program, Project, Stage, Product, Deliverable, Work Package, and Task levels. Consider using separate Projects in the database for each project.',
    category: 'Software Development',
  },
  workItemTypes: [
    {
      name: 'program',
      displayName: 'Program',
      allowedChildrenTypeNames: ['project'],
      allowedStatuses: [
        { id: 'identifying', label: 'Identifying', color: '#6366f1' },
        { id: 'defining', label: 'Defining', color: '#3b82f6' },
        { id: 'managing', label: 'Managing', color: '#10b981' },
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
          id: 'program-executive',
          label: 'Program Executive',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaBuilding',
        color: '#6366f1',
        description: 'A program of related projects',
      },
      workItemFields: [
        {
          id: 'program-outline',
          label: 'Program Outline',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'project',
      displayName: 'Project',
      allowedChildrenTypeNames: ['stage'],
      allowedStatuses: [
        { id: 'starting-up', label: 'Starting Up', color: '#6366f1' },
        { id: 'initiating', label: 'Initiating', color: '#3b82f6' },
        { id: 'directing', label: 'Directing', color: '#10b981' },
        { id: 'controlling', label: 'Controlling a Stage', color: '#f59e0b' },
        { id: 'managing', label: 'Managing Product Delivery', color: '#8b5cf6' },
        { id: 'closing', label: 'Closing a Project', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'project-executive',
          label: 'Project Executive',
          field_type: 'person',
          required: false,
        },
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
        description: 'A PRINCE2 project',
      },
      workItemFields: [
        {
          id: 'project-brief',
          label: 'Project Brief',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'stage',
      displayName: 'Stage',
      allowedChildrenTypeNames: ['product'],
      allowedStatuses: [
        { id: 'authorized', label: 'Authorized', color: '#10b981' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'completed', label: 'Completed', color: '#6b7280' },
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
        description: 'A project stage',
      },
      workItemFields: [
        {
          id: 'stage-plan',
          label: 'Stage Plan Reference',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'product',
      displayName: 'Product',
      allowedChildrenTypeNames: ['deliverable'],
      allowedStatuses: [
        { id: 'planned', label: 'Planned', color: '#6366f1' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'quality-checked', label: 'Quality Checked', color: '#f59e0b' },
        { id: 'approved', label: 'Approved', color: '#10b981' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'team-manager',
          label: 'Team Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaBoxOpen',
        color: '#10b981',
        description: 'A product to be delivered',
      },
      workItemFields: [
        {
          id: 'product-description',
          label: 'Product Description',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'deliverable',
      displayName: 'Deliverable',
      allowedChildrenTypeNames: ['work-package'],
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
          id: 'team-manager',
          label: 'Team Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaGift',
        color: '#f59e0b',
        description: 'A deliverable within a product',
      },
      workItemFields: [],
    },
    {
      name: 'work-package',
      displayName: 'Work Package',
      allowedChildrenTypeNames: ['task'],
      allowedStatuses: [
        { id: 'assigned', label: 'Assigned', color: '#6366f1' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'completed', label: 'Completed', color: '#10b981' },
        { id: 'approved', label: 'Approved', color: '#059669' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'team-manager',
          label: 'Team Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaBox',
        color: '#8b5cf6',
        description: 'A work package',
      },
      workItemFields: [],
    },
    {
      name: 'task',
      displayName: 'Task',
      allowedChildrenTypeNames: [],
      allowedStatuses: [
        { id: 'assigned', label: 'Assigned', color: '#6366f1' },
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
        description: 'A task within a work package',
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

