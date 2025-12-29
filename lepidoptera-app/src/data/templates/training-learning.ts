import { ProjectTemplate } from './types';

/**
 * Training & Learning Management Template
 * 
 * Training Program > Course > Enrollment > Completion Task
 * 
 * Designed for learning and development teams managing training programs,
 * courses, participant enrollment, and learning activities.
 */
export const trainingLearningTemplate: ProjectTemplate = {
  metadata: {
    id: 'training-learning',
    name: 'Training & Learning Management',
    description: 'Training and learning management template with Training Program, Course, Enrollment, and Completion Task levels. Manages learning initiatives and participant tracking.',
    category: 'Training & Development',
  },
  workItemTypes: [
    {
      name: 'training-program',
      displayName: 'Training Program',
      allowedChildrenTypeNames: ['course'],
      allowedStatuses: [
        { id: 'planned', label: 'Planned', color: '#6366f1' },
        { id: 'active', label: 'Active', color: '#10b981' },
        { id: 'completed', label: 'Completed', color: '#6b7280' },
        { id: 'archived', label: 'Archived', color: '#9ca3af' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'program-manager',
          label: 'Program Manager',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaGraduationCap',
        color: '#6366f1',
        description: 'A learning initiative',
      },
      workItemFields: [
        {
          id: 'program-name',
          label: 'Program Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'program-objective',
          label: 'Program Objective',
          field_type: 'text',
          required: false,
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
      name: 'course',
      displayName: 'Course',
      allowedChildrenTypeNames: ['enrollment'],
      allowedStatuses: [
        { id: 'draft', label: 'Draft', color: '#9ca3af' },
        { id: 'scheduled', label: 'Scheduled', color: '#6366f1' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'completed', label: 'Completed', color: '#10b981' },
        { id: 'cancelled', label: 'Cancelled', color: '#ef4444' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'instructor',
          label: 'Instructor',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaBook',
        color: '#8b5cf6',
        description: 'An individual course',
      },
      workItemFields: [
        {
          id: 'course-name',
          label: 'Course Name',
          field_type: 'text',
          required: false,
        },
        {
          id: 'course-type',
          label: 'Course Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'in-person', label: 'In-Person' },
            { value: 'online', label: 'Online' },
            { value: 'hybrid', label: 'Hybrid' },
            { value: 'self-paced', label: 'Self-Paced' },
          ],
        },
        {
          id: 'duration',
          label: 'Duration (hours)',
          field_type: 'number',
          required: false,
          validation: { min: 0, max: 1000 },
        },
        {
          id: 'course-date',
          label: 'Course Date',
          field_type: 'date',
          required: false,
        },
        {
          id: 'max-participants',
          label: 'Max Participants',
          field_type: 'number',
          required: false,
          validation: { min: 1 },
        },
      ],
    },
    {
      name: 'enrollment',
      displayName: 'Enrollment',
      allowedChildrenTypeNames: ['completion-task'],
      allowedStatuses: [
        { id: 'registered', label: 'Registered', color: '#6366f1' },
        { id: 'confirmed', label: 'Confirmed', color: '#10b981' },
        { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
        { id: 'completed', label: 'Completed', color: '#059669' },
        { id: 'cancelled', label: 'Cancelled', color: '#ef4444' },
      ],
      allowedPriorities: [
        { id: 'low', label: 'Low', value: 1, color: '#6b7280' },
        { id: 'medium', label: 'Medium', value: 2, color: '#f59e0b' },
        { id: 'high', label: 'High', value: 3, color: '#ef4444' },
      ],
      assignmentFieldDefinitions: [
        {
          id: 'participant',
          label: 'Participant',
          field_type: 'person',
          required: false,
        },
      ],
      workItemDetails: {
        icon: 'FaUserCheck',
        color: '#3b82f6',
        description: 'Participant tracking',
      },
      workItemFields: [
        {
          id: 'enrollment-date',
          label: 'Enrollment Date',
          field_type: 'date',
          required: false,
        },
        {
          id: 'completion-rate',
          label: 'Completion Rate (%)',
          field_type: 'number',
          required: false,
          validation: { min: 0, max: 100 },
        },
        {
          id: 'certification',
          label: 'Certification',
          field_type: 'select',
          required: false,
          options: [
            { value: 'none', label: 'None' },
            { value: 'certificate', label: 'Certificate' },
            { value: 'credential', label: 'Credential' },
          ],
        },
      ],
    },
    {
      name: 'completion-task',
      displayName: 'Completion Task',
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
        description: 'Learning activities',
      },
      workItemFields: [
        {
          id: 'task-type',
          label: 'Task Type',
          field_type: 'select',
          required: false,
          options: [
            { value: 'assignment', label: 'Assignment' },
            { value: 'quiz', label: 'Quiz' },
            { value: 'project', label: 'Project' },
            { value: 'exam', label: 'Exam' },
            { value: 'participation', label: 'Participation' },
          ],
        },
        {
          id: 'due-date',
          label: 'Due Date',
          field_type: 'date',
          required: false,
        },
        {
          id: 'score',
          label: 'Score',
          field_type: 'number',
          required: false,
          validation: { min: 0, max: 100 },
        },
      ],
    },
  ],
};

