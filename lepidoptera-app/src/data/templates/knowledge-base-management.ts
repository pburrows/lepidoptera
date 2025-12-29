import { ProjectTemplate } from './types';

/**
 * Knowledge Base Management Template
 * 
 * Knowledge Base > Category > Article > Update Task
 * 
 * Designed for knowledge management teams maintaining knowledge bases,
 * organizing articles by category, and tracking updates and maintenance.
 */
export const knowledgeBaseManagementTemplate: ProjectTemplate = {
  metadata: {
    id: 'knowledge-base-management',
    name: 'Knowledge Base Management',
    description: 'Knowledge base management template with Knowledge Base, Category, Article, and Update Task levels. Manages knowledge repositories and article maintenance.',
    category: 'Content & Knowledge Management',
  },
  workItemTypes: [
    {
      name: 'knowledge-base',
      displayName: 'Knowledge Base',
      allowedChildrenTypeNames: ['category'],
      allowedStatuses: [
        { id: 'active', label: 'Active', color: '#10b981' },
        { id: 'archived', label: 'Archived', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'kb-owner',
          label: 'Knowledge Base Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaBook',
        color: '#6366f1',
        description: 'A knowledge repository',
      },
      workItemFields: [
        {
          id: 'kb-name',
          label: 'Knowledge Base Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'kb-description',
          label: 'Knowledge Base Description',
          field_type: 'text',
          required: false,
        },
        {
          id: 'kb-type',
          label: 'Knowledge Base Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'internal', label: 'Internal' },
            { value: 'external', label: 'External' },
            { value: 'customer-support', label: 'Customer Support' },
            { value: 'technical', label: 'Technical' },
          ],
        },
      ],
    },
    {
      name: 'category',
      displayName: 'Category',
      allowedChildrenTypeNames: ['article'],
      allowedStatuses: [
        { id: 'active', label: 'Active', color: '#10b981' },
        { id: 'archived', label: 'Archived', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'category-owner',
          label: 'Category Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaFolder',
        color: '#8b5cf6',
        description: 'Topic organization for articles',
      },
      workItemFields: [
        {
          id: 'category-name',
          label: 'Category Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'category-description',
          label: 'Category Description',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'article',
      displayName: 'Article',
      allowedChildrenTypeNames: ['update-task'],
      allowedStatuses: [
        { id: 'draft', label: 'Draft', color: '#9ca3af' },
        { id: 'review', label: 'Review', color: '#f59e0b' },
        { id: 'published', label: 'Published', color: '#10b981' },
        { id: 'archived', label: 'Archived', color: '#6b7280' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'author',
          label: 'Author',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaFileAlt',
        color: '#3b82f6',
        description: 'A knowledge article',
      },
      workItemFields: [
        {
          id: 'article-title',
          label: 'Article Title',
          field_type: 'text',
          required: false,
        },
        {
          id: 'article-type',
          label: 'Article Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'how-to', label: 'How-To' },
            { value: 'troubleshooting', label: 'Troubleshooting' },
            { value: 'faq', label: 'FAQ' },
            { value: 'reference', label: 'Reference' },
            { value: 'tutorial', label: 'Tutorial' },
          ],
        },
        {
          id: 'last-reviewed',
          label: 'Last Reviewed',
          field_type: 'date',
          required: false,
        },
        {
          id: 'views',
          label: 'Views',
          field_type: 'number',
          required: false,
          validation: { min: 0 },
        },
        {
          id: 'helpful-votes',
          label: 'Helpful Votes',
          field_type: 'number',
          required: false,
          validation: { min: 0 },
        },
      ],
    },
    {
      name: 'update-task',
      displayName: 'Update Task',
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
        icon: 'FaEdit',
        color: '#10b981',
        description: 'Maintenance and updates for articles',
      },
      workItemFields: [
        {
          id: 'update-type',
          label: 'Update Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'content-update', label: 'Content Update' },
            { value: 'accuracy-review', label: 'Accuracy Review' },
            { value: 'formatting', label: 'Formatting' },
            { value: 'link-check', label: 'Link Check' },
          ],
        },
        {
          id: 'update-description',
          label: 'Update Description',
          field_type: 'text',
          required: false,
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

