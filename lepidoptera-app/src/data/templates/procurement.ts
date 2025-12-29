import { ProjectTemplate } from './types';

/**
 * Procurement Template
 * 
 * Purchase Request > Purchase Order > Receipt > Payment Task
 * 
 * Designed for procurement teams managing purchase requests, purchase orders,
 * goods receipt, and invoice processing workflows.
 */
export const procurementTemplate: ProjectTemplate = {
  metadata: {
    id: 'procurement',
    name: 'Procurement',
    description: 'Procurement template with Purchase Request, Purchase Order, Receipt, and Payment Task levels. Manages procurement workflows from request to payment.',
    category: 'Vendor & Procurement',
  },
  workItemTypes: [
    {
      name: 'purchase-request',
      displayName: 'Purchase Request',
      allowedChildrenTypeNames: ['purchase-order'],
      allowedStatuses: [
        { id: 'submitted', label: 'Submitted', color: '#6366f1' },
        { id: 'pending-approval', label: 'Pending Approval', color: '#f59e0b' },
        { id: 'approved', label: 'Approved', color: '#10b981' },
        { id: 'rejected', label: 'Rejected', color: '#ef4444' },
        { id: 'converted', label: 'Converted to PO', color: '#059669' },
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
        icon: 'FaShoppingCart',
        color: '#6366f1',
        description: 'A purchase requisition',
      },
      workItemFields: [
        {
          id: 'request-number',
          label: 'Request Number',
          field_type: 'text',
          required: false,
        },
        {
          id: 'request-description',
          label: 'Request Description',
          field_type: 'text',
          required: false,
        },
        {
          id: 'estimated-cost',
          label: 'Estimated Cost',
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
        {
          id: 'submission-date',
          label: 'Submission Date',
          field_type: 'date',
          required: false,
        },
      ],
    },
    {
      name: 'purchase-order',
      displayName: 'Purchase Order',
      allowedChildrenTypeNames: ['receipt'],
      allowedStatuses: [
        { id: 'draft', label: 'Draft', color: '#9ca3af' },
        { id: 'sent', label: 'Sent', color: '#3b82f6' },
        { id: 'acknowledged', label: 'Acknowledged', color: '#10b981' },
        { id: 'received', label: 'Received', color: '#059669' },
        { id: 'closed', label: 'Closed', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'po-manager',
          label: 'PO Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaFileInvoice',
        color: '#8b5cf6',
        description: 'An approved purchase order',
      },
      workItemFields: [
        {
          id: 'po-number',
          label: 'PO Number',
          field_type: 'text',
          required: false,
        },
        {
          id: 'vendor',
          label: 'Vendor',
          field_type: 'text',
          required: false,
        },
        {
          id: 'po-amount',
          label: 'PO Amount',
          field_type: 'number',
          required: false,
          validation: { min: 0 },
        },
        {
          id: 'po-date',
          label: 'PO Date',
          field_type: 'date',
          required: false,
        },
        {
          id: 'expected-delivery-date',
          label: 'Expected Delivery Date',
          field_type: 'date',
          required: false,
        },
      ],
    },
    {
      name: 'receipt',
      displayName: 'Receipt',
      allowedChildrenTypeNames: ['payment-task'],
      allowedStatuses: [
        { id: 'pending', label: 'Pending', color: '#6366f1' },
        { id: 'received', label: 'Received', color: '#10b981' },
        { id: 'verified', label: 'Verified', color: '#059669' },
        { id: 'rejected', label: 'Rejected', color: '#ef4444' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'receipt-handler',
          label: 'Receipt Handler',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaBoxOpen',
        color: '#3b82f6',
        description: 'Goods or services received',
      },
      workItemFields: [
        {
          id: 'receipt-number',
          label: 'Receipt Number',
          field_type: 'text',
          required: false,
        },
        {
          id: 'receipt-date',
          label: 'Receipt Date',
          field_type: 'date',
          required: false,
        },
        {
          id: 'received-quantity',
          label: 'Received Quantity',
          field_type: 'number',
          required: false,
          validation: { min: 0 },
        },
        {
          id: 'condition',
          label: 'Condition',
          field_type: 'select',
          required: false,
          options: [
            { value: 'good', label: 'Good' },
            { value: 'damaged', label: 'Damaged' },
            { value: 'incomplete', label: 'Incomplete' },
          ],
        },
      ],
    },
    {
      name: 'payment-task',
      displayName: 'Payment Task',
      allowedChildrenTypeNames: [],
      allowedStatuses: [
        { id: 'pending', label: 'Pending', color: '#6366f1' },
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
        icon: 'FaMoneyCheckAlt',
        color: '#10b981',
        description: 'Invoice processing and payment',
      },
      workItemFields: [
        {
          id: 'invoice-number',
          label: 'Invoice Number',
          field_type: 'text',
          required: false,
        },
        {
          id: 'invoice-amount',
          label: 'Invoice Amount',
          field_type: 'number',
          required: false,
          validation: { min: 0 },
        },
        {
          id: 'payment-date',
          label: 'Payment Date',
          field_type: 'date',
          required: false,
        },
        {
          id: 'payment-method',
          label: 'Payment Method',
          field_type: 'select',
          required: false,
          options: [
            { value: 'check', label: 'Check' },
            { value: 'wire-transfer', label: 'Wire Transfer' },
            { value: 'ach', label: 'ACH' },
            { value: 'credit-card', label: 'Credit Card' },
          ],
        },
      ],
    },
  ],
};

