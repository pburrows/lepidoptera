import { ProjectTemplate } from './types';

/**
 * Service Request Management Template
 * 
 * Request Catalog > Service Request > Fulfillment > Task
 * 
 * Designed for IT service management teams handling standard service requests
 * such as access requests, equipment provisioning, and service provisioning.
 */
export const serviceRequestManagementTemplate: ProjectTemplate = {
  metadata: {
    id: 'service-request-management',
    name: 'Service Request Management',
    description: 'Service request management template with Request Catalog, Service Request, Fulfillment, and Task levels. Handles standard service requests with approval workflows.',
    category: 'IT Operations, DevOps, Infrastructure',
  },
  workItemTypes: [
    {
      name: 'request-catalog',
      displayName: 'Request Catalog',
      allowedChildrenTypeNames: ['service-request'],
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
          id: 'catalog-owner',
          label: 'Catalog Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaBookOpen',
        color: '#6366f1',
        description: 'A catalog of available service requests',
      },
      workItemFields: [
        {
          id: 'catalog-name',
          label: 'Catalog Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'catalog-description',
          label: 'Catalog Description',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'service-request',
      displayName: 'Service Request',
      allowedChildrenTypeNames: ['fulfillment'],
      allowedStatuses: [
        { id: 'submitted', label: 'Submitted', color: '#6366f1' },
        { id: 'pending-approval', label: 'Pending Approval', color: '#f59e0b' },
        { id: 'approved', label: 'Approved', color: '#10b981' },
        { id: 'rejected', label: 'Rejected', color: '#ef4444' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'fulfilled', label: 'Fulfilled', color: '#059669' },
        { id: 'closed', label: 'Closed', color: '#6b7280' },
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
        description: 'A standard service request',
      },
      workItemFields: [
        {
          id: 'request-type',
          label: 'Request Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'access', label: 'Access Request' },
            { value: 'equipment', label: 'Equipment' },
            { value: 'software', label: 'Software' },
            { value: 'service', label: 'Service Provisioning' },
            { value: 'change', label: 'Change Request' },
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
          id: 'sla-deadline',
          label: 'SLA Deadline',
          field_type: 'date',
          required: false,
        },
        {
          id: 'cost',
          label: 'Cost',
          field_type: 'number',
          required: false,
          validation: { min: 0 },
        },
        {
          id: 'justification',
          label: 'Justification',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'fulfillment',
      displayName: 'Fulfillment',
      allowedChildrenTypeNames: ['task'],
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
          id: 'fulfillment-owner',
          label: 'Fulfillment Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaCheckCircle',
        color: '#10b981',
        description: 'The delivery process for a service request',
      },
      workItemFields: [
        {
          id: 'fulfillment-notes',
          label: 'Fulfillment Notes',
          field_type: 'text',
          required: false,
        },
        {
          id: 'delivery-date',
          label: 'Delivery Date',
          field_type: 'date',
          required: false,
        },
        {
          id: 'verification-status',
          label: 'Verification Status',
          field_type: 'select',
          required: false,
          options: [
            { value: 'pending', label: 'Pending' },
            { value: 'verified', label: 'Verified' },
            { value: 'failed', label: 'Failed' },
          ],
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
        description: 'A specific task to fulfill a service request',
      },
      workItemFields: [
        {
          id: 'task-type',
          label: 'Task Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'provisioning', label: 'Provisioning' },
            { value: 'configuration', label: 'Configuration' },
            { value: 'testing', label: 'Testing' },
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
          id: 'estimated-hours',
          label: 'Estimated Hours',
          field_type: 'number',
          required: false,
          validation: { min: 0, max: 1000 },
        },
      ],
    },
  ],
};

