import { ProjectTemplate } from './types';

/**
 * Asset Management Template
 * 
 * Asset Category > Asset > Maintenance Record > Task
 * 
 * Designed for asset management teams tracking assets, maintenance history,
 * and asset lifecycle management.
 */
export const assetManagementTemplate: ProjectTemplate = {
  metadata: {
    id: 'asset-management',
    name: 'Asset Management',
    description: 'Asset management template with Asset Category, Asset, Maintenance Record, and Task levels. Tracks assets, maintenance history, and lifecycle.',
    category: 'Facilities & Operations',
  },
  workItemTypes: [
    {
      name: 'asset-category',
      displayName: 'Asset Category',
      allowedChildrenTypeNames: ['asset'],
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
          id: 'category-manager',
          label: 'Category Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaTags',
        color: '#6366f1',
        description: 'A type or category of asset',
      },
      workItemFields: [
        {
          id: 'category-name',
          label: 'Category Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'category-type',
          label: 'Category Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'it-equipment', label: 'IT Equipment' },
            { value: 'furniture', label: 'Furniture' },
            { value: 'vehicles', label: 'Vehicles' },
            { value: 'machinery', label: 'Machinery' },
            { value: 'tools', label: 'Tools' },
          ],
        },
      ],
    },
    {
      name: 'asset',
      displayName: 'Asset',
      allowedChildrenTypeNames: ['maintenance-record'],
      allowedStatuses: [
        { id: 'active', label: 'Active', color: '#10b981' },
        { id: 'maintenance', label: 'Under Maintenance', color: '#f59e0b' },
        { id: 'retired', label: 'Retired', color: '#6b7280' },
        { id: 'disposed', label: 'Disposed', color: '#9ca3af' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'asset-owner',
          label: 'Asset Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaBox',
        color: '#3b82f6',
        description: 'An individual asset',
      },
      workItemFields: [
        {
          id: 'asset-id',
          label: 'Asset ID',
          field_type: 'text',
          required: false,
        },
        {
          id: 'asset-name',
          label: 'Asset Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'location',
          label: 'Location',
          field_type: 'text',
          required: false,
        },
        {
          id: 'condition',
          label: 'Condition',
          field_type: 'select',
          required: false,
          options: [
            { value: 'excellent', label: 'Excellent' },
            { value: 'good', label: 'Good' },
            { value: 'fair', label: 'Fair' },
            { value: 'poor', label: 'Poor' },
          ],
        },
        {
          id: 'warranty-expiry',
          label: 'Warranty Expiry',
          field_type: 'date',
          required: false,
        },
        {
          id: 'purchase-date',
          label: 'Purchase Date',
          field_type: 'date',
          required: false,
        },
        {
          id: 'purchase-cost',
          label: 'Purchase Cost',
          field_type: 'number',
          required: false,
          validation: { min: 0 },
        },
        {
          id: 'depreciation',
          label: 'Depreciation (%)',
          field_type: 'number',
          required: false,
          validation: { min: 0, max: 100 },
        },
      ],
    },
    {
      name: 'maintenance-record',
      displayName: 'Maintenance Record',
      allowedChildrenTypeNames: ['task'],
      allowedStatuses: [
        { id: 'scheduled', label: 'Scheduled', color: '#6366f1' },
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
          id: 'maintenance-technician',
          label: 'Maintenance Technician',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaHistory',
        color: '#8b5cf6',
        description: 'Maintenance history for an asset',
      },
      workItemFields: [
        {
          id: 'maintenance-type',
          label: 'Maintenance Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'preventive', label: 'Preventive' },
            { value: 'corrective', label: 'Corrective' },
            { value: 'inspection', label: 'Inspection' },
            { value: 'repair', label: 'Repair' },
          ],
        },
        {
          id: 'maintenance-date',
          label: 'Maintenance Date',
          field_type: 'date',
          required: false,
        },
        {
          id: 'maintenance-cost',
          label: 'Maintenance Cost',
          field_type: 'number',
          required: false,
          validation: { min: 0 },
        },
        {
          id: 'maintenance-notes',
          label: 'Maintenance Notes',
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
        description: 'Maintenance activities',
      },
      workItemFields: [
        {
          id: 'task-description',
          label: 'Task Description',
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

