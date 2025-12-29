import { ProjectTemplate } from './types';

/**
 * HR Operations Template
 * 
 * Employee > Request > Process > Task
 * 
 * Designed for HR teams managing employee requests, onboarding, offboarding,
 * leave requests, and other HR processes.
 */
export const hrOperationsTemplate: ProjectTemplate = {
  metadata: {
    id: 'hr-operations',
    name: 'HR Operations',
    description: 'HR operations template with Employee, Request, Process, and Task levels. Handles onboarding, offboarding, leave requests, and other HR processes.',
    category: 'HR & People Operations',
  },
  workItemTypes: [
    {
      name: 'employee',
      displayName: 'Employee',
      allowedChildrenTypeNames: ['request'],
      allowedStatuses: [
        { id: 'active', label: 'Active', color: '#10b981' },
        { id: 'on-leave', label: 'On Leave', color: '#f59e0b' },
        { id: 'inactive', label: 'Inactive', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'hr-manager',
          label: 'HR Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaUser',
        color: '#6366f1',
        description: 'An employee record',
      },
      workItemFields: [
        {
          id: 'employee-name',
          label: 'Employee Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'employee-id',
          label: 'Employee ID',
          field_type: 'text',
          required: false,
        },
        {
          id: 'department',
          label: 'Department',
          field_type: 'text',
          required: false,
        },
        {
          id: 'start-date',
          label: 'Start Date',
          field_type: 'date',
          required: false,
        },
      ],
    },
    {
      name: 'request',
      displayName: 'Request',
      allowedChildrenTypeNames: ['process'],
      allowedStatuses: [
        { id: 'submitted', label: 'Submitted', color: '#6366f1' },
        { id: 'pending-approval', label: 'Pending Approval', color: '#f59e0b' },
        { id: 'approved', label: 'Approved', color: '#10b981' },
        { id: 'rejected', label: 'Rejected', color: '#ef4444' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'completed', label: 'Completed', color: '#059669' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'requester',
          label: 'Requester',
          field_type: 'person',
          required: false,
        },
        {
          id: 'approver',
          label: 'Approver',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaClipboardList',
        color: '#3b82f6',
        description: 'An HR request',
      },
      workItemFields: [
        {
          id: 'request-type',
          label: 'Request Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'onboarding', label: 'Onboarding' },
            { value: 'offboarding', label: 'Offboarding' },
            { value: 'leave', label: 'Leave Request' },
            { value: 'equipment', label: 'Equipment Request' },
            { value: 'access', label: 'Access Request' },
            { value: 'policy', label: 'Policy Question' },
            { value: 'other', label: 'Other' },
          ],
        },
        {
          id: 'request-description',
          label: 'Request Description',
          field_type: 'text',
          required: false,
        },
        {
          id: 'submission-date',
          label: 'Submission Date',
          field_type: 'date',
          required: false,
        },
      ],
    },
    {
      name: 'process',
      displayName: 'Process',
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
          id: 'process-owner',
          label: 'Process Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaCog',
        color: '#8b5cf6',
        description: 'A multi-step workflow process',
      },
      workItemFields: [
        {
          id: 'process-name',
          label: 'Process Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'process-type',
          label: 'Process Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'onboarding', label: 'Onboarding' },
            { value: 'offboarding', label: 'Offboarding' },
            { value: 'leave-processing', label: 'Leave Processing' },
            { value: 'access-provisioning', label: 'Access Provisioning' },
            { value: 'equipment-setup', label: 'Equipment Setup' },
          ],
        },
        {
          id: 'completion-date',
          label: 'Completion Date',
          field_type: 'date',
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
        color: '#10b981',
        description: 'An individual step in a process',
      },
      workItemFields: [
        {
          id: 'task-type',
          label: 'Task Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'documentation', label: 'Documentation' },
            { value: 'setup', label: 'Setup' },
            { value: 'approval', label: 'Approval' },
            { value: 'notification', label: 'Notification' },
            { value: 'verification', label: 'Verification' },
          ],
        },
        {
          id: 'due-date',
          label: 'Due Date',
          field_type: 'date',
          required: false,
        },
      ],
    },
  ],
};

