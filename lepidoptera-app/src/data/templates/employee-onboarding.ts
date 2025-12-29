import { ProjectTemplate } from './types';

/**
 * Employee Onboarding Template
 * 
 * Onboarding Program > New Hire > Checklist > Task
 * 
 * Designed for HR teams managing structured employee onboarding programs
 * with department and role-specific checklists and tasks.
 */
export const employeeOnboardingTemplate: ProjectTemplate = {
  metadata: {
    id: 'employee-onboarding',
    name: 'Employee Onboarding',
    description: 'Employee onboarding template with Onboarding Program, New Hire, Checklist, and Task levels. Includes department and role-specific onboarding workflows.',
    category: 'HR & People Operations',
  },
  workItemTypes: [
    {
      name: 'onboarding-program',
      displayName: 'Onboarding Program',
      allowedChildrenTypeNames: ['new-hire'],
      allowedStatuses: [
        { id: 'active', label: 'Active', color: '#10b981' },
        { id: 'draft', label: 'Draft', color: '#9ca3af' },
        { id: 'archived', label: 'Archived', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
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
        icon: 'FaGraduationCap',
        color: '#6366f1',
        description: 'A standardized onboarding program',
      },
      workItemFields: [
        {
          id: 'program-name',
          label: 'Program Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'program-duration',
          label: 'Program Duration (days)',
          field_type: 'number',
          required: false,
          validation: { min: 1, max: 365 },
        },
        {
          id: 'target-department',
          label: 'Target Department',
          field_type: 'text',
          required: false,
        },
        {
          id: 'target-role',
          label: 'Target Role',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'new-hire',
      displayName: 'New Hire',
      allowedChildrenTypeNames: ['checklist'],
      allowedStatuses: [
        { id: 'pre-start', label: 'Pre-Start', color: '#6366f1' },
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
          id: 'new-hire-name',
          label: 'New Hire',
          field_type: 'person',
          required: false,
        },
        {
          id: 'onboarding-buddy',
          label: 'Onboarding Buddy',
          field_type: 'person',
          required: false,
        },
        {
          id: 'hr-coordinator',
          label: 'HR Coordinator',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaUserPlus',
        color: '#3b82f6',
        description: 'An employee being onboarded',
      },
      workItemFields: [
        {
          id: 'start-date',
          label: 'Start Date',
          field_type: 'date',
          required: false,
        },
        {
          id: 'department',
          label: 'Department',
          field_type: 'text',
          required: false,
        },
        {
          id: 'role',
          label: 'Role',
          field_type: 'text',
          required: false,
        },
        {
          id: 'completion-percentage',
          label: 'Completion Percentage',
          field_type: 'number',
          required: false,
          validation: { min: 0, max: 100 },
        },
      ],
    },
    {
      name: 'checklist',
      displayName: 'Checklist',
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
          id: 'checklist-owner',
          label: 'Checklist Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaListCheck',
        color: '#8b5cf6',
        description: 'A department or role-specific checklist',
      },
      workItemFields: [
        {
          id: 'checklist-name',
          label: 'Checklist Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'checklist-type',
          label: 'Checklist Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'hr', label: 'HR' },
            { value: 'it', label: 'IT' },
            { value: 'department', label: 'Department' },
            { value: 'compliance', label: 'Compliance' },
            { value: 'facilities', label: 'Facilities' },
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
        description: 'An individual onboarding task',
      },
      workItemFields: [
        {
          id: 'task-type',
          label: 'Task Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'documentation', label: 'Documentation' },
            { value: 'account-setup', label: 'Account Setup' },
            { value: 'equipment', label: 'Equipment' },
            { value: 'training', label: 'Training' },
            { value: 'meeting', label: 'Meeting' },
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

