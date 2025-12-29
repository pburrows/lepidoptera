import { ProjectTemplate } from './types';

/**
 * Audit Trail Template
 * 
 * Audit Program > Audit > Finding > Remediation Task
 * 
 * Designed for audit teams managing audit programs, individual audits,
 * findings, and remediation activities.
 */
export const auditTrailTemplate: ProjectTemplate = {
  metadata: {
    id: 'audit-trail',
    name: 'Audit Trail',
    description: 'Audit trail template with Audit Program, Audit, Finding, and Remediation Task levels. Manages audit programs, findings, and remediation tracking.',
    category: 'Compliance & Audit',
  },
  workItemTypes: [
    {
      name: 'audit-program',
      displayName: 'Audit Program',
      allowedChildrenTypeNames: ['audit'],
      allowedStatuses: [
        { id: 'planned', label: 'Planned', color: '#6366f1' },
        { id: 'active', label: 'Active', color: '#10b981' },
        { id: 'completed', label: 'Completed', color: '#6b7280' },
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
        icon: 'FaClipboardList',
        color: '#6366f1',
        description: 'An annual or periodic audit program',
      },
      workItemFields: [
        {
          id: 'program-name',
          label: 'Program Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'program-year',
          label: 'Program Year',
          field_type: 'number',
          required: false,
          validation: { min: 2000, max: 2100 },
        },
        {
          id: 'program-scope',
          label: 'Program Scope',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'audit',
      displayName: 'Audit',
      allowedChildrenTypeNames: ['finding'],
      allowedStatuses: [
        { id: 'planned', label: 'Planned', color: '#6366f1' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'completed', label: 'Completed', color: '#10b981' },
        { id: 'closed', label: 'Closed', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'auditor',
          label: 'Auditor',
          field_type: 'person',
          required: false,
        },
        {
          id: 'audit-lead',
          label: 'Audit Lead',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaSearch',
        color: '#3b82f6',
        description: 'An individual audit activity',
      },
      workItemFields: [
        {
          id: 'audit-name',
          label: 'Audit Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'audit-type',
          label: 'Audit Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'financial', label: 'Financial' },
            { value: 'operational', label: 'Operational' },
            { value: 'compliance', label: 'Compliance' },
            { value: 'it', label: 'IT' },
            { value: 'security', label: 'Security' },
          ],
        },
        {
          id: 'audit-date',
          label: 'Audit Date',
          field_type: 'date',
          required: false,
        },
        {
          id: 'audit-scope',
          label: 'Audit Scope',
          field_type: 'text',
          required: false,
        },
        {
          id: 'findings-count',
          label: 'Findings Count',
          field_type: 'number',
          required: false,
          validation: { min: 0 },
        },
      ],
    },
    {
      name: 'finding',
      displayName: 'Finding',
      allowedChildrenTypeNames: ['remediation-task'],
      allowedStatuses: [
        { id: 'identified', label: 'Identified', color: '#6366f1' },
        { id: 'documented', label: 'Documented', color: '#3b82f6' },
        { id: 'remediation-planned', label: 'Remediation Planned', color: '#f59e0b' },
        { id: 'remediated', label: 'Remediated', color: '#10b981' },
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
          id: 'finding-owner',
          label: 'Finding Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaExclamationCircle',
        color: '#ef4444',
        description: 'An audit finding',
      },
      workItemFields: [
        {
          id: 'finding-description',
          label: 'Finding Description',
          field_type: 'text',
          required: false,
        },
        {
          id: 'risk-level',
          label: 'Risk Level',
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
          id: 'impact',
          label: 'Impact',
          field_type: 'text',
          required: false,
        },
        {
          id: 'recommendation',
          label: 'Recommendation',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'remediation-task',
      displayName: 'Remediation Task',
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
          id: 'assignee',
          label: 'Assignee',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaWrench',
        color: '#10b981',
        description: 'Actions to address audit findings',
      },
      workItemFields: [
        {
          id: 'remediation-description',
          label: 'Remediation Description',
          field_type: 'text',
          required: false,
        },
        {
          id: 'due-date',
          label: 'Due Date',
          field_type: 'date',
          required: false,
        },
        {
          id: 'completion-date',
          label: 'Completion Date',
          field_type: 'date',
          required: false,
        },
        {
          id: 'verification-notes',
          label: 'Verification Notes',
          field_type: 'text',
          required: false,
        },
      ],
    },
  ],
};

