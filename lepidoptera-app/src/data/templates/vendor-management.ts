import { ProjectTemplate } from './types';

/**
 * Vendor Management Template
 * 
 * Vendor > Contract > Deliverable > Task
 * 
 * Designed for procurement and vendor management teams tracking vendor
 * relationships, contracts, deliverables, and performance.
 */
export const vendorManagementTemplate: ProjectTemplate = {
  metadata: {
    id: 'vendor-management',
    name: 'Vendor Management',
    description: 'Vendor management template with Vendor, Contract, Deliverable, and Task levels. Tracks vendor relationships, contracts, and deliverables.',
    category: 'Vendor & Procurement',
  },
  workItemTypes: [
    {
      name: 'vendor',
      displayName: 'Vendor',
      allowedChildrenTypeNames: ['contract'],
      allowedStatuses: [
        { id: 'active', label: 'Active', color: '#10b981' },
        { id: 'inactive', label: 'Inactive', color: '#6b7280' },
        { id: 'blacklisted', label: 'Blacklisted', color: '#ef4444' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'vendor-manager',
          label: 'Vendor Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaHandshake',
        color: '#6366f1',
        description: 'A supplier or vendor',
      },
      workItemFields: [
        {
          id: 'vendor-name',
          label: 'Vendor Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'vendor-type',
          label: 'Vendor Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'supplier', label: 'Supplier' },
            { value: 'service-provider', label: 'Service Provider' },
            { value: 'consultant', label: 'Consultant' },
            { value: 'contractor', label: 'Contractor' },
          ],
        },
        {
          id: 'performance-score',
          label: 'Performance Score',
          field_type: 'number',
          required: false,
          validation: { min: 0, max: 100 },
        },
      ],
    },
    {
      name: 'contract',
      displayName: 'Contract',
      allowedChildrenTypeNames: ['deliverable'],
      allowedStatuses: [
        { id: 'draft', label: 'Draft', color: '#9ca3af' },
        { id: 'negotiation', label: 'Negotiation', color: '#f59e0b' },
        { id: 'active', label: 'Active', color: '#10b981' },
        { id: 'expired', label: 'Expired', color: '#6b7280' },
        { id: 'terminated', label: 'Terminated', color: '#ef4444' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'contract-manager',
          label: 'Contract Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaFileContract',
        color: '#8b5cf6',
        description: 'A vendor agreement or contract',
      },
      workItemFields: [
        {
          id: 'contract-number',
          label: 'Contract Number',
          field_type: 'text',
          required: false,
        },
        {
          id: 'contract-value',
          label: 'Contract Value',
          field_type: 'number',
          required: false,
          validation: { min: 0 },
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
        {
          id: 'renewal-date',
          label: 'Renewal Date',
          field_type: 'date',
          required: false,
        },
      ],
    },
    {
      name: 'deliverable',
      displayName: 'Deliverable',
      allowedChildrenTypeNames: ['task'],
      allowedStatuses: [
        { id: 'planned', label: 'Planned', color: '#6366f1' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'completed', label: 'Completed', color: '#10b981' },
        { id: 'accepted', label: 'Accepted', color: '#059669' },
        { id: 'rejected', label: 'Rejected', color: '#ef4444' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'deliverable-owner',
          label: 'Deliverable Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaGift',
        color: '#3b82f6',
        description: 'A contract deliverable',
      },
      workItemFields: [
        {
          id: 'deliverable-name',
          label: 'Deliverable Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'deliverable-type',
          label: 'Deliverable Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'product', label: 'Product' },
            { value: 'service', label: 'Service' },
            { value: 'report', label: 'Report' },
            { value: 'documentation', label: 'Documentation' },
          ],
        },
        {
          id: 'due-date',
          label: 'Due Date',
          field_type: 'date',
          required: false,
        },
        {
          id: 'acceptance-criteria',
          label: 'Acceptance Criteria',
          field_type: 'text',
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
        description: 'Delivery activities',
      },
      workItemFields: [
        {
          id: 'task-type',
          label: 'Task Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'delivery', label: 'Delivery' },
            { value: 'review', label: 'Review' },
            { value: 'acceptance', label: 'Acceptance' },
            { value: 'payment', label: 'Payment' },
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

