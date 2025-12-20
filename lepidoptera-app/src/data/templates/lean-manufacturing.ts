import { ProjectTemplate } from './types';

/**
 * Lean Manufacturing Template
 * 
 * Value Stream > Process > Step > Standard Work Elements > Task
 */
export const leanManufacturingTemplate: ProjectTemplate = {
  metadata: {
    id: 'lean-manufacturing',
    name: 'Lean Manufacturing',
    description: 'Lean manufacturing template with Value Stream, Process, Step, Standard Work Elements, and Task levels.',
    category: 'Manufacturing and Industrial',
  },
  workItemTypes: [
    {
      name: 'value-stream',
      displayName: 'Value Stream',
      allowedChildrenTypeNames: ['process'],
      allowedStatuses: [
        { id: 'mapping', label: 'Mapping', color: '#6366f1' },
        { id: 'improving', label: 'Improving', color: '#3b82f6' },
        { id: 'optimized', label: 'Optimized', color: '#10b981' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'value-stream-lead',
          label: 'Value Stream Lead',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaStream',
        color: '#6366f1',
        description: 'A value stream',
      },
      workItemFields: [
        {
          id: 'takt-time',
          label: 'Takt Time',
          field_type: 'number',
          required: false,
          validation: { min: 0, max: 10000 },
        },
      ],
    },
    {
      name: 'process',
      displayName: 'Process',
      allowedChildrenTypeNames: ['step'],
      allowedStatuses: [
        { id: 'analyzing', label: 'Analyzing', color: '#6366f1' },
        { id: 'improving', label: 'Improving', color: '#3b82f6' },
        { id: 'standardized', label: 'Standardized', color: '#10b981' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'process-owner',
          label: 'Process Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaCog',
        color: '#8b5cf6',
        description: 'A process within a value stream',
      },
      workItemFields: [
        {
          id: 'cycle-time',
          label: 'Cycle Time',
          field_type: 'number',
          required: false,
          validation: { min: 0, max: 10000 },
        },
      ],
    },
    {
      name: 'step',
      displayName: 'Step',
      allowedChildrenTypeNames: ['standard-work-element'],
      allowedStatuses: [
        { id: 'identified', label: 'Identified', color: '#6366f1' },
        { id: 'documented', label: 'Documented', color: '#3b82f6' },
        { id: 'standardized', label: 'Standardized', color: '#10b981' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'step-owner',
          label: 'Step Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaArrowRight',
        color: '#3b82f6',
        description: 'A step within a process',
      },
      workItemFields: [
        {
          id: 'step-time',
          label: 'Step Time (seconds)',
          field_type: 'number',
          required: false,
          validation: { min: 0, max: 10000 },
        },
      ],
    },
    {
      name: 'standard-work-element',
      displayName: 'Standard Work Element',
      allowedChildrenTypeNames: ['task'],
      allowedStatuses: [
        { id: 'defined', label: 'Defined', color: '#6366f1' },
        { id: 'implemented', label: 'Implemented', color: '#3b82f6' },
        { id: 'validated', label: 'Validated', color: '#10b981' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'operator',
          label: 'Operator',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaClipboardCheck',
        color: '#10b981',
        description: 'A standard work element',
      },
      workItemFields: [
        {
          id: 'element-time',
          label: 'Element Time (seconds)',
          field_type: 'number',
          required: false,
          validation: { min: 0, max: 10000 },
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
          id: 'estimated-time',
          label: 'Estimated Time (seconds)',
          field_type: 'number',
          required: false,
          validation: { min: 0, max: 10000 },
        },
      ],
    },
  ],
};

