import { ProjectTemplate, WorkItemTypeTemplate } from './types';

/**
 * Convert a ProjectTemplate to the format expected by the backend
 * This extracts just the workItemTypes array for the apply_template command
 */
export function getWorkItemTypesFromTemplate(template: ProjectTemplate): WorkItemTypeTemplate[] {
  return template.workItemTypes;
}

/**
 * Prepare template data for backend
 * This ensures the data is in the correct format for serialization
 */
export function prepareTemplateForBackend(template: ProjectTemplate): {
  workItemTypes: WorkItemTypeTemplate[];
} {
  return {
    workItemTypes: template.workItemTypes,
  };
}

