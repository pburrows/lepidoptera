import { ProjectTemplate } from './types';

/**
 * Facilities Management Template
 * 
 * Facility > Work Order > Maintenance > Task
 * 
 * Designed for facilities management teams handling maintenance requests,
 * work orders, and facility operations.
 */
export const facilitiesManagementTemplate: ProjectTemplate = {
  metadata: {
    id: 'facilities-management',
    name: 'Facilities Management',
    description: 'Facilities management template with Facility, Work Order, Maintenance, and Task levels. Handles maintenance requests and facility operations.',
    category: 'Facilities & Operations',
  },
  workItemTypes: [
    {
      name: 'facility',
      displayName: 'Facility',
      allowedChildrenTypeNames: ['work-order'],
      allowedStatuses: [
        { id: 'operational', label: 'Operational', color: '#10b981' },
        { id: 'maintenance', label: 'Under Maintenance', color: '#f59e0b' },
        { id: 'closed', label: 'Closed', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'facility-manager',
          label: 'Facility Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaBuilding',
        color: '#6366f1',
        description: 'A building or location',
      },
      workItemFields: [
        {
          id: 'facility-name',
          label: 'Facility Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'facility-address',
          label: 'Facility Address',
          field_type: 'text',
          required: false,
        },
        {
          id: 'facility-type',
          label: 'Facility Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'office', label: 'Office' },
            { value: 'warehouse', label: 'Warehouse' },
            { value: 'manufacturing', label: 'Manufacturing' },
            { value: 'retail', label: 'Retail' },
            { value: 'data-center', label: 'Data Center' },
          ],
        },
      ],
    },
    {
      name: 'work-order',
      displayName: 'Work Order',
      allowedChildrenTypeNames: ['maintenance'],
      allowedStatuses: [
        { id: 'requested', label: 'Requested', color: '#6366f1' },
        { id: 'approved', label: 'Approved', color: '#10b981' },
        { id: 'assigned', label: 'Assigned', color: '#3b82f6' },
        { id: 'in-progress', label: 'In Progress', color: '#f59e0b' },
        { id: 'completed', label: 'Completed', color: '#059669' },
        { id: 'closed', label: 'Closed', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
        { id: 'emergency', label: 'Emergency', value: 4, color: '#dc2626' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'requester',
          label: 'Requester',
          field_type: 'person',
          required: false,
        },
        {
          id: 'assigned-technician',
          label: 'Assigned Technician',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaClipboardList',
        color: '#3b82f6',
        description: 'A maintenance request or work order',
      },
      workItemFields: [
        {
          id: 'work-order-number',
          label: 'Work Order Number',
          field_type: 'text',
          required: false,
        },
        {
          id: 'work-order-description',
          label: 'Work Order Description',
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
          id: 'equipment',
          label: 'Equipment',
          field_type: 'text',
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
          id: 'vendor',
          label: 'Vendor',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'maintenance',
      displayName: 'Maintenance',
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
        icon: 'FaTools',
        color: '#8b5cf6',
        description: 'Scheduled or reactive maintenance',
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
            { value: 'emergency', label: 'Emergency' },
            { value: 'inspection', label: 'Inspection' },
          ],
        },
        {
          id: 'scheduled-date',
          label: 'Scheduled Date',
          field_type: 'date',
          required: false,
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
        description: 'Individual maintenance steps',
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

