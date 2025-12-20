import { ProjectTemplate } from './types';

/**
 * Hardware / Product R&D Template
 * 
 * Product Line > Project > Subsystem > Component > Requirement > Verification Task
 * 
 * Note: The "Project" work item type in this template represents a hardware/product R&D project.
 * Consider using separate Projects in the database for each product development project instead
 * of making it a work item type. Each Project in the database can contain the Subsystem,
 * Component, Requirement, and Verification Task work items. This provides better data isolation
 * and aligns with how product development projects are typically managed.
 */
export const hardwareRdTemplate: ProjectTemplate = {
  metadata: {
    id: 'hardware-rd',
    name: 'Hardware / Product R&D',
    description: 'Hardware R&D template with Product Line, Project, Subsystem, Component, Requirement, and Verification Task levels. Consider using separate Projects in the database for each product development project.',
    category: 'Research & Development (R&D, Pharma, Academia)',
  },
  workItemTypes: [
    {
      name: 'product-line',
      displayName: 'Product Line',
      allowedChildrenTypeNames: ['project'],
      allowedStatuses: [
        { id: 'planning', label: 'Planning', color: '#6366f1' },
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
      name: 'project',
      displayName: 'Project',
      allowedChildrenTypeNames: ['subsystem'],
      allowedStatuses: [
        { id: 'concept', label: 'Concept', color: '#6366f1' },
        { id: 'design', label: 'Design', color: '#3b82f6' },
        { id: 'prototype', label: 'Prototype', color: '#8b5cf6' },
        { id: 'testing', label: 'Testing', color: '#f59e0b' },
        { id: 'production-ready', label: 'Production Ready', color: '#10b981' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'project-manager',
          label: 'Project Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaProjectDiagram',
        color: '#8b5cf6',
        description: 'A hardware/product R&D project',
      },
      workItemFields: [
        {
          id: 'product-name',
          label: 'Product Name',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'subsystem',
      displayName: 'Subsystem',
      allowedChildrenTypeNames: ['component'],
      allowedStatuses: [
        { id: 'design', label: 'Design', color: '#6366f1' },
        { id: 'development', label: 'Development', color: '#3b82f6' },
        { id: 'testing', label: 'Testing', color: '#f59e0b' },
        { id: 'integrated', label: 'Integrated', color: '#10b981' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'subsystem-lead',
          label: 'Subsystem Lead',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaCogs',
        color: '#3b82f6',
        description: 'A subsystem within a product',
      },
      workItemFields: [
        {
          id: 'subsystem-name',
          label: 'Subsystem Name',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'component',
      displayName: 'Component',
      allowedChildrenTypeNames: ['requirement'],
      allowedStatuses: [
        { id: 'specified', label: 'Specified', color: '#6366f1' },
        { id: 'designed', label: 'Designed', color: '#3b82f6' },
        { id: 'prototyped', label: 'Prototyped', color: '#8b5cf6' },
        { id: 'validated', label: 'Validated', color: '#10b981' },
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
        color: '#10b981',
        description: 'A component within a subsystem',
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
      name: 'requirement',
      displayName: 'Requirement',
      allowedChildrenTypeNames: ['verification-task'],
      allowedStatuses: [
        { id: 'draft', label: 'Draft', color: '#9ca3af' },
        { id: 'review', label: 'Review', color: '#f59e0b' },
        { id: 'approved', label: 'Approved', color: '#10b981' },
        { id: 'verified', label: 'Verified', color: '#059669' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
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
        icon: 'FaFileAlt',
        color: '#f59e0b',
        description: 'A requirement for a component',
      },
      workItemFields: [
        {
          id: 'requirement-id',
          label: 'Requirement ID',
          field_type: 'text',
          required: false,
        },
        {
          id: 'requirement-type',
          label: 'Requirement Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'functional', label: 'Functional' },
            { value: 'performance', label: 'Performance' },
            { value: 'reliability', label: 'Reliability' },
            { value: 'safety', label: 'Safety' },
          ],
        },
      ],
    },
    {
      name: 'verification-task',
      displayName: 'Verification Task',
      allowedChildrenTypeNames: [],
      allowedStatuses: [
        { id: 'planned', label: 'Planned', color: '#6366f1' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'passed', label: 'Passed', color: '#10b981' },
        { id: 'failed', label: 'Failed', color: '#ef4444' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'test-engineer',
          label: 'Test Engineer',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaCheckSquare',
        color: '#6b7280',
        description: 'A verification task for a requirement',
      },
      workItemFields: [
        {
          id: 'test-method',
          label: 'Test Method',
          field_type: 'select',
          required: false,
          options: [
            { value: 'analysis', label: 'Analysis' },
            { value: 'inspection', label: 'Inspection' },
            { value: 'demonstration', label: 'Demonstration' },
            { value: 'test', label: 'Test' },
          ],
        },
        {
          id: 'test-result',
          label: 'Test Result',
          field_type: 'text',
          required: false,
        },
      ],
    },
  ],
};

