use crate::app_context::AppContext;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tauri::State;
use documents::docuent_ports::NavigationDocument;
use work_items::models::{WorkItemTypeModel, WorkItemListRequest, WorkItemQuery, WorkItemListItem};
use projects::entities::Project;
use log::{debug, error, info};
use std::collections::HashSet;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NavigationItem {
    pub id: String,
    pub label: String,
    pub icon: Option<String>,
    pub children: Option<Vec<NavigationItem>>,
    pub show_hover_menu: Option<bool>,
    pub unread: Option<bool>,
    pub sequential_number: Option<String>, // Sequential number for work items (e.g., M-0003, M-1045, etc.)
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NavigationSection {
    pub id: String,
    pub label: String,
    pub icon: Option<String>,
    pub items: Vec<NavigationItem>,
    pub spacing_before: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NavigationResponse {
    pub sections: Vec<NavigationSection>,
}

#[tauri::command]
pub fn get_navigation(
    project_id: String,
    state: State<'_, Arc<AppContext>>,
) -> Result<NavigationResponse, String> {
    let command_name = "get_navigation";
    debug!("[COMMAND] {} called: project_id={}", command_name, project_id);
    let start = std::time::Instant::now();
    
    let ctx = state.inner();

    let documents = match get_all_documents(ctx, &project_id) {
        Ok(docs) => docs,
        Err(e) => {
            error!("[COMMAND] {} failed to get documents: {}", command_name, e);
            return Err(format!("Failed to get documents: {}", e));
        }
    };

    let mut sections = vec![];

    build_top_level_sections(&mut sections);
    build_conversation_section(&mut sections);
    if let Err(e) = build_work_item_section(&mut sections, &ctx, &project_id) {
        error!("[COMMAND] {} failed to build work item section: {}", command_name, e);
        // Continue execution - don't fail the entire navigation if work items fail
    }
    build_document_section(&mut sections, &documents);

    let duration = start.elapsed();
    info!("[COMMAND] {} completed successfully in {:?} ({} sections, {} documents)", 
          command_name, duration, sections.len(), documents.len());
    Ok(NavigationResponse { sections })
}
fn build_conversation_section(sections: &mut Vec<NavigationSection>) {
    // let conversations = Vec::new();
    let general_item = NavigationItem {
        id: "conv-general".to_string(),
        label: "General".to_string(),
        icon: None, //Some("FaList".to_string()),
        children: None,
        show_hover_menu: None,
        unread: Some(true),
        sequential_number: None,
    };
    sections.push(NavigationSection {
        id: "conversations".to_string(),
        label: "Conversations".to_string(),
        icon: Some("FaComment".to_string()),
        items: vec![general_item],
        spacing_before: Some(true),
    })
}

fn build_work_item_section(
    sections: &mut Vec<NavigationSection>,
    ctx: &Arc<AppContext>,
    project_id: &str,
) -> Result<(), String> {
    // Get all work item types for the project
    let work_item_types = ctx.work_items.get_work_item_types_by_project(project_id)
        .map_err(|e| format!("Failed to get work item types: {}", e))?;

    if work_item_types.is_empty() {
        // No work item types configured, skip this section
        return Ok(());
    }

    // Build a set of all type IDs that appear as children in ANY type's allowed_children_type_ids
    // We check ALL types (not just active) to properly determine parent-child relationships
    let mut child_type_ids: HashSet<String> = HashSet::new();
    for work_item_type in &work_item_types {
        for child_id in &work_item_type.allowed_children_type_ids {
            child_type_ids.insert(child_id.clone());
        }
    }

    // Filter to only active types for display
    let active_types: Vec<&WorkItemTypeModel> = work_item_types
        .iter()
        .filter(|t| t.is_active)
        .collect();

    // Find top-level types: active types that are not in any type's allowed_children_type_ids
    let top_level_types: Vec<&WorkItemTypeModel> = active_types
        .iter()
        .filter(|work_item_type| {
            work_item_type.id.as_ref()
                .map(|id| !child_type_ids.contains(id))
                .unwrap_or(false)
        })
        .copied()
        .collect();

    // Create a section for each top-level type
    for work_item_type in top_level_types {
        let type_id = work_item_type.id.as_ref()
            .ok_or_else(|| "Work item type missing ID".to_string())?;

        // Get work items of this type
        let query = WorkItemQuery {
            project_id: project_id.to_string(),
            type_id: Some(type_id.clone()),
            statuses: None,
            priority: None,
            priority_min: None,
            priority_max: None,
            type_ids: None,
            assigned_to: None,
            created_by: None,
            title_contains: None,
            sequence_numbers: None,
            field_value_queries: None,
            page: None,
            page_size: None,
            limit: None,
            offset: None,
            sort_by: None,
            sort_direction: None,
        };

        let request = WorkItemListRequest {
            query,
            include_fields: None,
        };

        let work_items_response = ctx.work_items.list_work_items(request)
            .map_err(|e| format!("Failed to list work items for type {}: {}", type_id, e))?;

        // Convert work items to navigation items, or show default if empty
        let nav_items: Vec<NavigationItem> = if work_items_response.items.is_empty() {
            vec![NavigationItem {
                id: format!("create-new-{}", type_id),
                label: format!("Create the first {}", work_item_type.display_name),
                icon: None,
                children: None,
                show_hover_menu: Some(true),
                unread: None,
                sequential_number: None,
            }]
        } else {
            work_items_response.items
                .iter()
                .map(|item| work_item_to_navigation_item(item))
                .collect()
        };

        // Use the pluralized type's display_name as the section label
        let section_id = format!("work-items-section-{}", type_id);
        let pluralized_label = pluralize(&work_item_type.display_name);
        sections.push(NavigationSection {
            id: section_id,
            label: pluralized_label,
            icon: work_item_type.work_item_details.icon.clone(),
            items: nav_items,
            spacing_before: Some(true),
        });
    }

    Ok(())
}

fn work_item_to_navigation_item(item: &WorkItemListItem) -> NavigationItem {
    let item_id = item.id.as_ref()
        .map(|id| id.clone())
        .unwrap_or_else(|| format!("work-item-{}", item.title));

    NavigationItem {
        id: item_id,
        label: item.title.clone(),
        icon: None,
        children: None,
        show_hover_menu: Some(true), // Enable hover menu for work items
        unread: None,
        sequential_number: item.sequential_number.clone(),
    }
}

/// Pluralizes a word using common English pluralization rules
fn pluralize(word: &str) -> String {
    if word.is_empty() {
        return word.to_string();
    }

    let lower = word.to_lowercase();
    let last_char = word.chars().last().unwrap();
    let second_last_char = word.chars().rev().nth(1);

    // Handle words ending in 'y' preceded by a consonant -> 'ies'
    if last_char == 'y' && second_last_char.map(|c| !is_vowel(c)).unwrap_or(false) {
        return format!("{}ies", &word[..word.len() - 1]);
    }

    // Handle words ending in 's', 'x', 'z', 'ch', 'sh' -> 'es'
    if word.ends_with('s') || word.ends_with('x') || word.ends_with('z') ||
       word.ends_with("ch") || word.ends_with("sh") {
        return format!("{}es", word);
    }

    // Handle words ending in 'f' or 'fe' -> 'ves' (common cases)
    if word.ends_with("fe") {
        return format!("{}ves", &word[..word.len() - 2]);
    }
    if word.ends_with('f') && !word.ends_with("ff") {
        return format!("{}ves", &word[..word.len() - 1]);
    }

    // Default: just add 's'
    format!("{}s", word)
}

fn is_vowel(c: char) -> bool {
    matches!(c.to_ascii_lowercase(), 'a' | 'e' | 'i' | 'o' | 'u')
}

fn build_document_section(sections: &mut Vec<NavigationSection>, documents: &Vec<NavigationDocument>) {
    let doc_items = if documents.is_empty() {
        // Show welcome message for empty projects
        vec![NavigationItem {
            id: "welcome".to_string(),
            label: "Welcome to Lepidoptera".to_string(),
            icon: None,
            children: None,
            show_hover_menu: Some(true),
            unread: None,
            sequential_number: None,
        }]
    } else {
        // Build tree structure from flat list
        build_document_tree(documents)
    };

    sections.push(NavigationSection {
        id: "documents".to_string(),
        label: "Documents".to_string(),
        icon: Some("FaBook".to_string()),
        items: doc_items,
        spacing_before: Some(true),
    })
}

fn build_document_tree(documents: &[NavigationDocument]) -> Vec<NavigationItem> {
    use std::collections::HashMap;

    // Build a map of parent_id -> list of child document IDs
    let mut children_map: HashMap<Option<String>, Vec<&NavigationDocument>> = HashMap::new();
    for doc in documents {
        children_map
            .entry(doc.parent_id.clone())
            .or_insert_with(Vec::new)
            .push(doc);
    }

    // Recursive function to build NavigationItem tree
    fn build_item(
        doc: &NavigationDocument,
        children_map: &HashMap<Option<String>, Vec<&NavigationDocument>>,
    ) -> NavigationItem {
        // Use id if available, otherwise fall back to slug (which should always be present)
        let doc_id = doc.id.as_ref()
            .map(|id| id.clone())
            .unwrap_or_else(|| format!("doc-{}", doc.slug));
        
        let children: Option<Vec<NavigationItem>> = children_map
            .get(&doc.id.clone())
            .map(|child_docs| {
                let mut items: Vec<NavigationItem> = child_docs
                    .iter()
                    .map(|child_doc| build_item(child_doc, children_map))
                    .collect();
                // Sort children by label
                items.sort_by(|a, b| a.label.cmp(&b.label));
                items
            })
            .filter(|items| !items.is_empty());

        NavigationItem {
            id: doc_id,
            label: doc.title.clone(),
            icon: None,
            children,
            show_hover_menu: None,
            unread: None,
            sequential_number: None,
        }
    }

    // Build root items (documents with no parent)
    let root_items: Vec<NavigationItem> = children_map
        .get(&None)
        .map(|root_docs| {
            let mut items: Vec<NavigationItem> = root_docs
                .iter()
                .map(|doc| build_item(doc, &children_map))
                .collect();
            // Sort root items by label
            items.sort_by(|a, b| a.label.cmp(&b.label));
            items
        })
        .unwrap_or_default();

    root_items
}

fn build_top_level_sections(sections: &mut Vec<NavigationSection>) {
    sections.push(NavigationSection {
        id: "overview".to_string(),
        label: "Overview".to_string(),
        icon: Some("FaFolder".to_string()),
        items: vec![],
        spacing_before: None,
    });
    sections.push(NavigationSection {
        id: "for-you".to_string(),
        label: "For You".to_string(),
        icon: Some("FaUser".to_string()),
        items: vec![],
        spacing_before: None,
    });
    sections.push(NavigationSection {
        id: "recent".to_string(),
        label: "Recent".to_string(),
        icon: Some("FaClock".to_string()),
        items: vec![],
        spacing_before: None,
    });
    sections.push(NavigationSection {
        id: "starred".to_string(),
        label: "Starred".to_string(),
        icon: Some("FaStar".to_string()),
        items: vec![],
        spacing_before: None,
    });
    sections.push(NavigationSection {
        id: "direct-messages".to_string(),
        label: "Direct Messages".to_string(),
        icon: Some("FaMessage".to_string()),
        items: vec![],
        spacing_before: None,
    });
}

fn get_all_documents(ctx: &Arc<AppContext>, project_id: &str) -> anyhow::Result<Vec<NavigationDocument>> {
    // Get documents for the specified project
    let documents = ctx.documents.get_document_tree(project_id)?;

    Ok(documents)
}

#[tauri::command]
pub fn get_projects(
    state: State<'_, Arc<AppContext>>,
) -> Result<Vec<Project>, String> {
    let command_name = "get_projects";
    debug!("[COMMAND] {} called", command_name);
    let start = std::time::Instant::now();
    
    let ctx = state.inner();
    let projects_manager = ctx.projects.clone();
    let work_items_manager = ctx.work_items.clone();

    use crate::commands::person_commands::ensure_initial_user;
    if let Err(e) = ensure_initial_user(state.clone()) {
        error!("[COMMAND] {} failed to ensure initial user: {}", command_name, e);
    }

    use crate::commands::project_commands::ensure_initial_project;
    if let Err(e) = ensure_initial_project(state.clone()) {
        error!("[COMMAND] {} failed to ensure initial project: {}", command_name, e);
    }
    
    match projects_manager.get_projects() {
        Ok(projects) => {
            let duration = start.elapsed();
            info!("[COMMAND] {} completed successfully in {:?} ({} projects)", 
                  command_name, duration, projects.len());
            Ok(projects)
        }
        Err(e) => {
            let duration = start.elapsed();
            error!("[COMMAND] {} failed after {:?}: {}", command_name, duration, e);
            Err(format!("Failed to get projects: {}", e))
        }
    }
}
