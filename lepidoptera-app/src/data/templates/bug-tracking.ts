import { ProjectTemplate } from './types';

/**
 * Bug Tracking Template
 * 
 * Product > Bug > Investigation > Fix
 * 
 * Designed for bug tracking and defect management with product organization,
 * bug investigation, and fix tracking workflows.
 */
export const bugTrackingTemplate: ProjectTemplate = {
  metadata: {
    id: 'bug-tracking',
    name: 'Bug Tracking',
    description: 'Bug tracking template with Product, Bug, Investigation, and Fix levels. Includes severity classification, reproduction steps, and fix verification.',
    category: 'Software Development',
  },
  workItemTypes: [
    {
      name: 'product',
      displayName: 'Product',
      allowedChildrenTypeNames: ['bug'],
      allowedStatuses: [
        { id: 'active', label: 'Active', color: '#10b981' },
        { id: 'maintenance', label: 'Maintenance', color: '#f59e0b' },
        { id: 'deprecated', label: 'Deprecated', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'product-owner',
          label: 'Product Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaBox',
        color: '#6366f1',
        description: 'A product or component',
      },
      workItemFields: [
        {
          id: 'product-name',
          label: 'Product Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'product-version',
          label: 'Product Version',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'bug',
      displayName: 'Bug',
      allowedChildrenTypeNames: ['investigation', 'fix'],
      allowedStatuses: [
        { id: 'reported', label: 'Reported', color: '#6366f1' },
        { id: 'confirmed', label: 'Confirmed', color: '#3b82f6' },
        { id: 'in-progress', label: 'In Progress', color: '#f59e0b' },
        { id: 'fixed', label: 'Fixed', color: '#10b981' },
        { id: 'verified', label: 'Verified', color: '#059669' },
        { id: 'closed', label: 'Closed', color: '#6b7280' },
        { id: 'wont-fix', label: "Won't Fix", color: '#9ca3af' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
        { id: 'critical', label: 'Critical', value: 4, color: '#dc2626' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'assignee',
          label: 'Assignee',
          field_type: 'person',
          required: false,
        },
        {
          id: 'reporter',
          label: 'Reporter',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaBug',
        color: '#ef4444',
        description: 'A defect or bug report',
      },
      workItemFields: [
        {
          id: 'bug-title',
          label: 'Bug Title',
          field_type: 'text',
          required: false,
        },
        {
          id: 'severity',
          label: 'Severity',
          field_type: 'select',
          required: false,
          options: [
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
            { value: 'critical', label: 'Critical' },
          ],
        },
        {
          id: 'steps-to-reproduce',
          label: 'Steps to Reproduce',
          field_type: 'text',
          required: false,
        },
        {
          id: 'expected-behavior',
          label: 'Expected Behavior',
          field_type: 'text',
          required: false,
        },
        {
          id: 'actual-behavior',
          label: 'Actual Behavior',
          field_type: 'text',
          required: false,
        },
        {
          id: 'environment',
          label: 'Environment',
          field_type: 'select',
          required: false,
          options: [
            { value: 'dev', label: 'Development' },
            { value: 'staging', label: 'Staging' },
            { value: 'production', label: 'Production' },
          ],
        },
        {
          id: 'affected-versions',
          label: 'Affected Versions',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'investigation',
      displayName: 'Investigation',
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
          id: 'investigator',
          label: 'Investigator',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaSearch',
        color: '#3b82f6',
        description: 'Bug reproduction and analysis activities',
      },
      workItemFields: [
        {
          id: 'reproducibility',
          label: 'Reproducibility',
          field_type: 'select',
          required: false,
          options: [
            { value: 'always', label: 'Always' },
            { value: 'sometimes', label: 'Sometimes' },
            { value: 'rarely', label: 'Rarely' },
            { value: 'unable', label: 'Unable to Reproduce' },
          ],
        },
        {
          id: 'investigation-notes',
          label: 'Investigation Notes',
          field_type: 'text',
          required: false,
        },
        {
          id: 'root-cause',
          label: 'Root Cause',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'fix',
      displayName: 'Fix',
      allowedChildrenTypeNames: [],
      allowedStatuses: [
        { id: 'not-started', label: 'Not Started', color: '#6b7280' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'completed', label: 'Completed', color: '#10b981' },
        { id: 'verified', label: 'Verified', color: '#059669' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'developer',
          label: 'Developer',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaCode',
        color: '#10b981',
        description: 'Development and verification of bug fix',
      },
      workItemFields: [
        {
          id: 'fix-description',
          label: 'Fix Description',
          field_type: 'text',
          required: false,
        },
        {
          id: 'fix-version',
          label: 'Fix Version',
          field_type: 'text',
          required: false,
        },
        {
          id: 'verification-steps',
          label: 'Verification Steps',
          field_type: 'text',
          required: false,
        },
        {
          id: 'verification-status',
          label: 'Verification Status',
          field_type: 'select',
          required: false,
          options: [
            { value: 'pending', label: 'Pending' },
            { value: 'passed', label: 'Passed' },
            { value: 'failed', label: 'Failed' },
          ],
        },
      ],
    },
  ],
};

