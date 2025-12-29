import { ProjectTemplate } from './types';

/**
 * Problem Management Template
 * 
 * Problem > Root Cause Analysis > Known Error > Workaround
 * 
 * Designed for IT operations teams to identify and resolve underlying causes
 * of incidents, document known errors, and provide workarounds.
 */
export const problemManagementTemplate: ProjectTemplate = {
  metadata: {
    id: 'problem-management',
    name: 'Problem Management',
    description: 'Problem management template with Problem, Root Cause Analysis, Known Error, and Workaround levels. Focuses on identifying underlying causes of incidents.',
    category: 'IT Operations, DevOps, Infrastructure',
  },
  workItemTypes: [
    {
      name: 'problem',
      displayName: 'Problem',
      allowedChildrenTypeNames: ['root-cause-analysis'],
      allowedStatuses: [
        { id: 'identified', label: 'Identified', color: '#6366f1' },
        { id: 'under-investigation', label: 'Under Investigation', color: '#3b82f6' },
        { id: 'root-cause-identified', label: 'Root Cause Identified', color: '#f59e0b' },
        { id: 'resolved', label: 'Resolved', color: '#10b981' },
        { id: 'closed', label: 'Closed', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
        { id: 'critical', label: 'Critical', value: 4, color: '#dc2626' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'problem-manager',
          label: 'Problem Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaQuestionCircle',
        color: '#6366f1',
        description: 'An underlying cause of one or more incidents',
      },
      workItemFields: [
        {
          id: 'related-incidents',
          label: 'Related Incidents',
          field_type: 'text',
          required: false,
        },
        {
          id: 'problem-description',
          label: 'Problem Description',
          field_type: 'text',
          required: false,
        },
        {
          id: 'affected-services',
          label: 'Affected Services',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'root-cause-analysis',
      displayName: 'Root Cause Analysis',
      allowedChildrenTypeNames: ['known-error', 'workaround'],
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
          id: 'analyst',
          label: 'Analyst',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaMicroscope',
        color: '#3b82f6',
        description: 'Investigation activities to identify root cause',
      },
      workItemFields: [
        {
          id: 'analysis-method',
          label: 'Analysis Method',
          field_type: 'select',
          required: false,
          options: [
            { value: '5-whys', label: '5 Whys' },
            { value: 'fishbone', label: 'Fishbone Diagram' },
            { value: 'pareto', label: 'Pareto Analysis' },
            { value: 'fault-tree', label: 'Fault Tree Analysis' },
          ],
        },
        {
          id: 'root-cause',
          label: 'Root Cause',
          field_type: 'text',
          required: false,
        },
        {
          id: 'analysis-notes',
          label: 'Analysis Notes',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'known-error',
      displayName: 'Known Error',
      allowedChildrenTypeNames: [],
      allowedStatuses: [
        { id: 'documented', label: 'Documented', color: '#10b981' },
        { id: 'permanent-fix-pending', label: 'Permanent Fix Pending', color: '#f59e0b' },
        { id: 'permanent-fix-applied', label: 'Permanent Fix Applied', color: '#059669' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'error-owner',
          label: 'Error Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaBook',
        color: '#8b5cf6',
        description: 'A documented cause and solution for a problem',
      },
      workItemFields: [
        {
          id: 'error-description',
          label: 'Error Description',
          field_type: 'text',
          required: false,
        },
        {
          id: 'solution',
          label: 'Solution',
          field_type: 'text',
          required: false,
        },
        {
          id: 'permanent-fix-status',
          label: 'Permanent Fix Status',
          field_type: 'select',
          required: false,
          options: [
            { value: 'not-planned', label: 'Not Planned' },
            { value: 'planned', label: 'Planned' },
            { value: 'in-progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' },
          ],
        },
        {
          id: 'knowledge-base-link',
          label: 'Knowledge Base Link',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'workaround',
      displayName: 'Workaround',
      allowedChildrenTypeNames: [],
      allowedStatuses: [
        { id: 'identified', label: 'Identified', color: '#6366f1' },
        { id: 'documented', label: 'Documented', color: '#10b981' },
        { id: 'superseded', label: 'Superseded', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'workaround-owner',
          label: 'Workaround Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaBandAid',
        color: '#f59e0b',
        description: 'A temporary fix to restore service',
      },
      workItemFields: [
        {
          id: 'workaround-description',
          label: 'Workaround Description',
          field_type: 'text',
          required: false,
        },
        {
          id: 'effectiveness',
          label: 'Effectiveness',
          field_type: 'select',
          required: false,
          options: [
            { value: 'partial', label: 'Partial' },
            { value: 'full', label: 'Full' },
            { value: 'limited', label: 'Limited' },
          ],
        },
        {
          id: 'limitations',
          label: 'Limitations',
          field_type: 'text',
          required: false,
        },
      ],
    },
  ],
};

