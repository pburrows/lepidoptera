import { ProjectTemplate } from './types';

/**
 * Content Management / Editorial Template
 * 
 * Content Calendar > Content Piece > Review > Publication Task
 * 
 * Designed for content teams managing editorial calendars, content creation,
 * review processes, and publication workflows.
 */
export const contentManagementTemplate: ProjectTemplate = {
  metadata: {
    id: 'content-management',
    name: 'Content Management / Editorial',
    description: 'Content management template with Content Calendar, Content Piece, Review, and Publication Task levels. Manages editorial schedules and content workflows.',
    category: 'Content & Knowledge Management',
  },
  workItemTypes: [
    {
      name: 'content-calendar',
      displayName: 'Content Calendar',
      allowedChildrenTypeNames: ['content-piece'],
      allowedStatuses: [
        { id: 'draft', label: 'Draft', color: '#9ca3af' },
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
          id: 'calendar-owner',
          label: 'Calendar Owner',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaCalendarAlt',
        color: '#6366f1',
        description: 'An editorial schedule',
      },
      workItemFields: [
        {
          id: 'calendar-name',
          label: 'Calendar Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'calendar-period',
          label: 'Calendar Period',
          field_type: 'select',
          required: false,
          options: [
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'quarterly', label: 'Quarterly' },
            { value: 'annual', label: 'Annual' },
          ],
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
      ],
    },
    {
      name: 'content-piece',
      displayName: 'Content Piece',
      allowedChildrenTypeNames: ['review', 'publication-task'],
      allowedStatuses: [
        { id: 'planned', label: 'Planned', color: '#6366f1' },
        { id: 'draft', label: 'Draft', color: '#9ca3af' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'review', label: 'In Review', color: '#f59e0b' },
        { id: 'approved', label: 'Approved', color: '#10b981' },
        { id: 'published', label: 'Published', color: '#059669' },
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
        {
          id: 'editor',
          label: 'Editor',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaFileAlt',
        color: '#3b82f6',
        description: 'A content article, post, or documentation',
      },
      workItemFields: [
        {
          id: 'content-title',
          label: 'Content Title',
          field_type: 'text',
          required: false,
        },
        {
          id: 'content-type',
          label: 'Content Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'blog-post', label: 'Blog Post' },
            { value: 'article', label: 'Article' },
            { value: 'whitepaper', label: 'Whitepaper' },
            { value: 'documentation', label: 'Documentation' },
            { value: 'social-media', label: 'Social Media' },
            { value: 'video', label: 'Video' },
            { value: 'podcast', label: 'Podcast' },
          ],
        },
        {
          id: 'target-audience',
          label: 'Target Audience',
          field_type: 'text',
          required: false,
        },
        {
          id: 'publish-date',
          label: 'Publish Date',
          field_type: 'date',
          required: false,
        },
        {
          id: 'keywords',
          label: 'Keywords',
          field_type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'review',
      displayName: 'Review',
      allowedChildrenTypeNames: [],
      allowedStatuses: [
        { id: 'pending', label: 'Pending', color: '#6366f1' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'approved', label: 'Approved', color: '#10b981' },
        { id: 'rejected', label: 'Rejected', color: '#ef4444' },
        { id: 'revision-requested', label: 'Revision Requested', color: '#f59e0b' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'reviewer',
          label: 'Reviewer',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaEye',
        color: '#8b5cf6',
        description: 'Editorial review process',
      },
      workItemFields: [
        {
          id: 'review-type',
          label: 'Review Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'editorial', label: 'Editorial' },
            { value: 'technical', label: 'Technical' },
            { value: 'legal', label: 'Legal' },
            { value: 'fact-check', label: 'Fact Check' },
          ],
        },
        {
          id: 'review-notes',
          label: 'Review Notes',
          field_type: 'text',
          required: false,
        },
        {
          id: 'review-date',
          label: 'Review Date',
          field_type: 'date',
          required: false,
        },
      ],
    },
    {
      name: 'publication-task',
      displayName: 'Publication Task',
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
        icon: 'FaRocket',
        color: '#10b981',
        description: 'Publishing activities',
      },
      workItemFields: [
        {
          id: 'task-type',
          label: 'Task Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'formatting', label: 'Formatting' },
            { value: 'seo', label: 'SEO Optimization' },
            { value: 'publishing', label: 'Publishing' },
            { value: 'promotion', label: 'Promotion' },
            { value: 'scheduling', label: 'Scheduling' },
          ],
        },
        {
          id: 'due-date',
          label: 'Due Date',
          field_type: 'date',
          required: false,
        },
        {
          id: 'publication-date',
          label: 'Publication Date',
          field_type: 'date',
          required: false,
        },
      ],
    },
  ],
};

