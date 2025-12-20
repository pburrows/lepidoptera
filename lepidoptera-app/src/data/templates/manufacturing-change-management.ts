import { ProjectTemplate } from './types';

/**
 * Manufacturing Change Management Template
 * 
 * Product Line > Product > BOM > Assembly > Component > Operation > Task
 */
export const manufacturingChangeManagementTemplate: ProjectTemplate = {
  metadata: {
    id: 'manufacturing-change-management',
    name: 'Manufacturing Change Management',
    description: 'Manufacturing change management template with Product Line, Product, BOM, Assembly, Component, Operation, and Task levels.',
    category: 'Manufacturing and Industrial',
  },
  workItemTypes: [
    {
      name: 'product-line',
      displayName: 'Product Line',
      allowedChildrenTypeNames: ['product'],
      allowedStatuses: [
        { id: 'active', label: 'Active', color: '#10b981' },
        { id: 'discontinued', label: 'Discontinued', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'product-line-manager',
          label: 'Product Line Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaIndustry',
        color: '#6366f1',
        description: 'A product line',
      },
      workItemFields: [],
    },
    {
      name: 'product',
      displayName: 'Product',
      allowedChildrenTypeNames: ['bom'],
      allowedStatuses: [
        { id: 'design', label: 'Design', color: '#6366f1' },
        { id: 'prototype', label: 'Prototype', color: '#3b82f6' },
        { id: 'production', label: 'Production', color: '#10b981' },
        { id: 'end-of-life', label: 'End of Life', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'product-manager',
          label: 'Product Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaBox',
        color: '#8b5cf6',
        description: 'A product',
      },
      workItemFields: [
        {
          id: 'product-sku',
          label: 'Product SKU',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'bom',
      displayName: 'BOM (Bill of Materials)',
      allowedChildrenTypeNames: ['assembly'],
      allowedStatuses: [
        { id: 'draft', label: 'Draft', color: '#9ca3af' },
        { id: 'approved', label: 'Approved', color: '#10b981' },
        { id: 'released', label: 'Released', color: '#3b82f6' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'bom-engineer',
          label: 'BOM Engineer',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaList',
        color: '#3b82f6',
        description: 'Bill of Materials',
      },
      workItemFields: [
        {
          id: 'bom-revision',
          label: 'BOM Revision',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'assembly',
      displayName: 'Assembly',
      allowedChildrenTypeNames: ['component'],
      allowedStatuses: [
        { id: 'design', label: 'Design', color: '#6366f1' },
        { id: 'manufacturing', label: 'Manufacturing', color: '#3b82f6' },
        { id: 'completed', label: 'Completed', color: '#10b981' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'assembly-engineer',
          label: 'Assembly Engineer',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaCogs',
        color: '#10b981',
        description: 'An assembly within a BOM',
      },
      workItemFields: [
        {
          id: 'assembly-number',
          label: 'Assembly Number',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'component',
      displayName: 'Component',
      allowedChildrenTypeNames: ['operation'],
      allowedStatuses: [
        { id: 'design', label: 'Design', color: '#6366f1' },
        { id: 'procurement', label: 'Procurement', color: '#8b5cf6' },
        { id: 'manufacturing', label: 'Manufacturing', color: '#3b82f6' },
        { id: 'completed', label: 'Completed', color: '#10b981' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'component-engineer',
          label: 'Component Engineer',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaPuzzlePiece',
        color: '#f59e0b',
        description: 'A component within an assembly',
      },
      workItemFields: [
        {
          id: 'part-number',
          label: 'Part Number',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'operation',
      displayName: 'Operation',
      allowedChildrenTypeNames: ['task'],
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
          id: 'operator',
          label: 'Operator',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaCog',
        color: '#8b5cf6',
        description: 'A manufacturing operation',
      },
      workItemFields: [
        {
          id: 'operation-number',
          label: 'Operation Number',
          field_type: 'text',
          required: false,
        },
        {
          id: 'setup-time',
          label: 'Setup Time (minutes)',
          field_type: 'number',
          required: false,
          validation: { min: 0, max: 10000 },
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
        description: 'A specific task',
      },
      workItemFields: [
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

