/**
 * Project Templates
 * 
 * Export all available project templates here.
 * To add a new template:
 * 1. Create a new template file (e.g., construction.ts)
 * 2. Import it here
 * 3. Add it to the templates array
 */

import { scrumTemplate } from './scrum';
import { kanbanTemplate } from './kanban';
import { safeTemplate } from './safe';
import { xpTemplate } from './xp';
import { pmbokTemplate } from './pmbok';
import { prince2Template } from './prince2';
import { constructionProjectTemplate } from './construction-project';
import { architecturalEngineeringTemplate } from './architectural-engineering';
import { manufacturingChangeManagementTemplate } from './manufacturing-change-management';
import { leanManufacturingTemplate } from './lean-manufacturing';
import { sixSigmaTemplate } from './six-sigma';
import { managementConsultingTemplate } from './management-consulting';
import { legalFirmsTemplate } from './legal-firms';
import { marketingAgencyTemplate } from './marketing-agency';
import { pharmaceuticalRdTemplate } from './pharmaceutical-rd';
import { scientificResearchTemplate } from './scientific-research';
import { hardwareRdTemplate } from './hardware-rd';
import { filmProductionTemplate } from './film-production';
import { eventPlanningTemplate } from './event-planning';
import { governmentProjectsTemplate } from './government-projects';
import { nonprofitProgramsTemplate } from './nonprofit-programs';
import { itilTemplate } from './itil';
import { devopsPipelinesTemplate } from './devops-pipelines';
import { marketingOpsTemplate } from './marketing-ops';
import { salesOpsTemplate } from './sales-ops';
import { erpSystemsTemplate } from './erp-systems';
import { ProjectTemplate } from './types';

export { scrumTemplate, kanbanTemplate, safeTemplate, xpTemplate, pmbokTemplate, prince2Template };
export { constructionProjectTemplate, architecturalEngineeringTemplate };
export { manufacturingChangeManagementTemplate, leanManufacturingTemplate, sixSigmaTemplate };
export { managementConsultingTemplate, legalFirmsTemplate, marketingAgencyTemplate };
export { pharmaceuticalRdTemplate, scientificResearchTemplate, hardwareRdTemplate };
export { filmProductionTemplate, eventPlanningTemplate };
export { governmentProjectsTemplate, nonprofitProgramsTemplate };
export { itilTemplate, devopsPipelinesTemplate };
export { marketingOpsTemplate, salesOpsTemplate, erpSystemsTemplate };
export type { ProjectTemplate, ProjectTemplateMetadata, WorkItemTypeTemplate } from './types';

/**
 * All available project templates
 */
export const templates: ProjectTemplate[] = [
  // Software Development
  scrumTemplate,
  kanbanTemplate,
  safeTemplate,
  xpTemplate,
  pmbokTemplate,
  prince2Template,
  // Construction
  constructionProjectTemplate,
  architecturalEngineeringTemplate,
  // Manufacturing and Industrial
  manufacturingChangeManagementTemplate,
  leanManufacturingTemplate,
  sixSigmaTemplate,
  // Consulting, Professional Services, and Agencies
  managementConsultingTemplate,
  legalFirmsTemplate,
  marketingAgencyTemplate,
  // Research & Development (R&D, Pharma, Academia)
  pharmaceuticalRdTemplate,
  scientificResearchTemplate,
  hardwareRdTemplate,
  // Event Planning & Media Production
  filmProductionTemplate,
  eventPlanningTemplate,
  // Government, Policy, & Nonprofits
  governmentProjectsTemplate,
  nonprofitProgramsTemplate,
  // IT Operations, DevOps, Infrastructure
  itilTemplate,
  devopsPipelinesTemplate,
  // Marketing, Sales, CRM, and GTM
  marketingOpsTemplate,
  salesOpsTemplate,
  // Manufacturing Project/Operations Management (ISO / ERP-worked)
  erpSystemsTemplate,
];

/**
 * Get a template by its ID
 */
export function getTemplateById(id: string): ProjectTemplate | undefined {
  return templates.find(t => t.metadata.id === id);
}

/**
 * Get all templates
 */
export function getAllTemplates(): ProjectTemplate[] {
  return templates;
}

