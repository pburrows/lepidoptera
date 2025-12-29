import { ProjectTemplate } from './types';

/**
 * Compliance Management Template
 * 
 * Compliance Framework > Requirement > Audit > Finding
 * 
 * Designed for compliance teams managing regulatory requirements, audits,
 * and findings across various compliance frameworks (SOC2, GDPR, ISO, etc.).
 */
export const complianceManagementTemplate: ProjectTemplate = {
  metadata: {
    id: 'compliance-management',
    name: 'Compliance Management',
    description: 'Compliance management template with Compliance Framework, Requirement, Audit, and Finding levels. Supports SOC2, GDPR, ISO, and other compliance standards.',
    category: 'Compliance & Audit',
  },
  workItemTypes: [
    {
      name: 'compliance-framework',
      displayName: 'Compliance Framework',
      allowedChildrenTypeNames: ['requirement'],
      allowedStatuses: [
        { id: 'active', label: 'Active', color: '#10b981' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'archived', label: 'Archived', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'framework-owner',
          label: 'Framework Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaShieldAlt',
        color: '#6366f1',
        description: 'A compliance standard or framework',
      },
      workItemFields: [
        {
          id: 'framework-name',
          label: 'Framework Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'framework-type',
          label: 'Framework Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'soc2', label: 'SOC 2' },
            { value: 'gdpr', label: 'GDPR' },
            { value: 'iso27001', label: 'ISO 27001' },
            { value: 'hipaa', label: 'HIPAA' },
            { value: 'pci-dss', label: 'PCI DSS' },
            { value: 'other', label: 'Other' },
          ],
        },
        {
          id: 'certification-date',
          label: 'Certification Date',
          field_type: 'date',
          required: false,
        },
        {
          id: 'renewal-date',
          label: 'Renewal Date',
          field_type: 'date',
          required: false,
        },
      ],
    },
    {
      name: 'requirement',
      displayName: 'Requirement',
      allowedChildrenTypeNames: ['audit'],
      allowedStatuses: [
        { id: 'not-started', label: 'Not Started', color: '#6b7280' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'compliant', label: 'Compliant', color: '#10b981' },
        { id: 'non-compliant', label: 'Non-Compliant', color: '#ef4444' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
        { id: 'critical', label: 'Critical', value: 4, color: '#dc2626' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'requirement-owner',
          label: 'Requirement Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaCheckCircle',
        color: '#8b5cf6',
        description: 'A specific compliance requirement',
      },
      workItemFields: [
        {
          id: 'requirement-id',
          label: 'Requirement ID',
          field_type: 'text',
          required: false,
        },
        {
          id: 'requirement-description',
          label: 'Requirement Description',
          field_type: 'text',
          required: false,
        },
        {
          id: 'compliance-status',
          label: 'Compliance Status',
          field_type: 'select',
          required: false,
          options: [
            { value: 'compliant', label: 'Compliant' },
            { value: 'non-compliant', label: 'Non-Compliant' },
            { value: 'partial', label: 'Partially Compliant' },
            { value: 'not-assessed', label: 'Not Assessed' },
          ],
        },
        {
          id: 'evidence',
          label: 'Evidence',
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
      ],
      workItemDetails: {
        icon: 'FaSearch',
        color: '#3b82f6',
        description: 'An audit activity',
      },
      workItemFields: [
        {
          id: 'audit-type',
          label: 'Audit Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'internal', label: 'Internal' },
            { value: 'external', label: 'External' },
            { value: 'self-assessment', label: 'Self-Assessment' },
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
      allowedChildrenTypeNames: [],
      allowedStatuses: [
        { id: 'identified', label: 'Identified', color: '#6366f1' },
        { id: 'remediation-planned', label: 'Remediation Planned', color: '#f59e0b' },
        { id: 'remediation-in-progress', label: 'Remediation In Progress', color: '#3b82f6' },
        { id: 'remediated', label: 'Remediated', color: '#10b981' },
        { id: 'verified', label: 'Verified', color: '#059669' },
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
        icon: 'FaExclamationTriangle',
        color: '#ef4444',
        description: 'A compliance finding requiring remediation',
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
          id: 'remediation-date',
          label: 'Remediation Date',
          field_type: 'date',
          required: false,
        },
        {
          id: 'remediation-plan',
          label: 'Remediation Plan',
          field_type: 'text',
          required: false,
        },
      ],
    },
  ],
};

