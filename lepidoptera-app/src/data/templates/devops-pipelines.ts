import { ProjectTemplate } from './types';

/**
 * DevOps Pipelines Template
 * 
 * Value Stream > Pipeline > Stage > Job > Step
 */
export const devopsPipelinesTemplate: ProjectTemplate = {
  metadata: {
    id: 'devops-pipelines',
    name: 'DevOps Pipelines',
    description: 'DevOps pipelines template with Value Stream, Pipeline, Stage, Job, and Step levels.',
    category: 'IT Operations, DevOps, Infrastructure',
  },
  workItemTypes: [
    {
      name: 'value-stream',
      displayName: 'Value Stream',
      allowedChildrenTypeNames: ['pipeline'],
      allowedStatuses: [
        { id: 'active', label: 'Active', color: '#10b981' },
        { id: 'deprecated', label: 'Deprecated', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'value-stream-owner',
          label: 'Value Stream Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaStream',
        color: '#6366f1',
        description: 'A value stream',
      },
      workItemFields: [],
    },
    {
      name: 'pipeline',
      displayName: 'Pipeline',
      allowedChildrenTypeNames: ['stage'],
      allowedStatuses: [
        { id: 'active', label: 'Active', color: '#10b981' },
        { id: 'paused', label: 'Paused', color: '#f59e0b' },
        { id: 'deprecated', label: 'Deprecated', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'pipeline-owner',
          label: 'Pipeline Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaCodeBranch',
        color: '#8b5cf6',
        description: 'A CI/CD pipeline',
      },
      workItemFields: [
        {
          id: 'pipeline-type',
          label: 'Pipeline Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'ci', label: 'CI' },
            { value: 'cd', label: 'CD' },
            { value: 'cicd', label: 'CI/CD' },
          ],
        },
      ],
    },
    {
      name: 'stage',
      displayName: 'Stage',
      allowedChildrenTypeNames: ['job'],
      allowedStatuses: [
        { id: 'pending', label: 'Pending', color: '#6366f1' },
        { id: 'running', label: 'Running', color: '#3b82f6' },
        { id: 'passed', label: 'Passed', color: '#10b981' },
        { id: 'failed', label: 'Failed', color: '#ef4444' },
        { id: 'skipped', label: 'Skipped', color: '#6b7280' },
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
        description: 'A pipeline stage',
      },
      workItemFields: [
        {
          id: 'stage-name',
          label: 'Stage Name',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'job',
      displayName: 'Job',
      allowedChildrenTypeNames: ['step'],
      allowedStatuses: [
        { id: 'pending', label: 'Pending', color: '#6366f1' },
        { id: 'running', label: 'Running', color: '#3b82f6' },
        { id: 'passed', label: 'Passed', color: '#10b981' },
        { id: 'failed', label: 'Failed', color: '#ef4444' },
        { id: 'cancelled', label: 'Cancelled', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [],
      workItemDetails: {
        icon: 'FaCog',
        color: '#10b981',
        description: 'A job within a stage',
      },
      workItemFields: [
        {
          id: 'job-name',
          label: 'Job Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'runner-type',
          label: 'Runner Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'docker', label: 'Docker' },
            { value: 'kubernetes', label: 'Kubernetes' },
            { value: 'vm', label: 'VM' },
            { value: 'bare-metal', label: 'Bare Metal' },
          ],
        },
      ],
    },
    {
      name: 'step',
      displayName: 'Step',
      allowedChildrenTypeNames: [],
      allowedStatuses: [
        { id: 'pending', label: 'Pending', color: '#6366f1' },
        { id: 'running', label: 'Running', color: '#3b82f6' },
        { id: 'passed', label: 'Passed', color: '#10b981' },
        { id: 'failed', label: 'Failed', color: '#ef4444' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [],
      workItemDetails: {
        icon: 'FaCheckSquare',
        color: '#6b7280',
        description: 'A step within a job',
      },
      workItemFields: [
        {
          id: 'step-command',
          label: 'Step Command',
          field_type: 'text',
          required: false,
        },
        {
          id: 'exit-code',
          label: 'Exit Code',
          field_type: 'number',
          required: false,
          validation: { min: 0, max: 255 },
        },
      ],
    },
  ],
};

