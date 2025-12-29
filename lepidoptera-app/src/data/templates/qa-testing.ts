import { ProjectTemplate } from './types';

/**
 * QA / Testing Template
 * 
 * Test Plan > Test Suite > Test Case > Test Execution
 * 
 * Designed for quality assurance teams managing test plans, test suites,
 * test cases, and test execution results.
 */
export const qaTestingTemplate: ProjectTemplate = {
  metadata: {
    id: 'qa-testing',
    name: 'QA / Testing',
    description: 'QA testing template with Test Plan, Test Suite, Test Case, and Test Execution levels. Includes test type classification and pass/fail tracking.',
    category: 'Software Development',
  },
  workItemTypes: [
    {
      name: 'test-plan',
      displayName: 'Test Plan',
      allowedChildrenTypeNames: ['test-suite'],
      allowedStatuses: [
        { id: 'draft', label: 'Draft', color: '#9ca3af' },
        { id: 'review', label: 'Review', color: '#f59e0b' },
        { id: 'approved', label: 'Approved', color: '#10b981' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'completed', label: 'Completed', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'test-plan-owner',
          label: 'Test Plan Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaClipboardCheck',
        color: '#6366f1',
        description: 'A testing strategy for a release or feature',
      },
      workItemFields: [
        {
          id: 'test-plan-name',
          label: 'Test Plan Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'release-version',
          label: 'Release Version',
          field_type: 'text',
          required: false,
        },
        {
          id: 'test-objective',
          label: 'Test Objective',
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
      name: 'test-suite',
      displayName: 'Test Suite',
      allowedChildrenTypeNames: ['test-case'],
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
          id: 'suite-owner',
          label: 'Suite Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaFolder',
        color: '#8b5cf6',
        description: 'A group of related test cases',
      },
      workItemFields: [
        {
          id: 'suite-name',
          label: 'Suite Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'test-type',
          label: 'Test Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'unit', label: 'Unit' },
            { value: 'integration', label: 'Integration' },
            { value: 'e2e', label: 'End-to-End' },
            { value: 'performance', label: 'Performance' },
            { value: 'security', label: 'Security' },
            { value: 'regression', label: 'Regression' },
          ],
        },
      ],
    },
    {
      name: 'test-case',
      displayName: 'Test Case',
      allowedChildrenTypeNames: ['test-execution'],
      allowedStatuses: [
        { id: 'draft', label: 'Draft', color: '#9ca3af' },
        { id: 'ready', label: 'Ready', color: '#10b981' },
        { id: 'deprecated', label: 'Deprecated', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'test-case-author',
          label: 'Test Case Author',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaFileAlt',
        color: '#3b82f6',
        description: 'An individual test scenario',
      },
      workItemFields: [
        {
          id: 'test-case-name',
          label: 'Test Case Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'preconditions',
          label: 'Preconditions',
          field_type: 'text',
          required: false,
        },
        {
          id: 'test-steps',
          label: 'Test Steps',
          field_type: 'text',
          required: false,
        },
        {
          id: 'expected-result',
          label: 'Expected Result',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'test-execution',
      displayName: 'Test Execution',
      allowedChildrenTypeNames: [],
      allowedStatuses: [
        { id: 'not-executed', label: 'Not Executed', color: '#6b7280' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'passed', label: 'Passed', color: '#10b981' },
        { id: 'failed', label: 'Failed', color: '#ef4444' },
        { id: 'blocked', label: 'Blocked', color: '#f59e0b' },
        { id: 'skipped', label: 'Skipped', color: '#9ca3af' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'tester',
          label: 'Tester',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaPlay',
        color: '#10b981',
        description: 'A test run execution with results',
      },
      workItemFields: [
        {
          id: 'execution-date',
          label: 'Execution Date',
          field_type: 'date',
          required: false,
        },
        {
          id: 'actual-result',
          label: 'Actual Result',
          field_type: 'text',
          required: false,
        },
        {
          id: 'defects-found',
          label: 'Defects Found',
          field_type: 'number',
          required: false,
          validation: { min: 0 },
        },
        {
          id: 'execution-notes',
          label: 'Execution Notes',
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
            { value: 'qa', label: 'QA' },
          ],
        },
      ],
    },
  ],
};

