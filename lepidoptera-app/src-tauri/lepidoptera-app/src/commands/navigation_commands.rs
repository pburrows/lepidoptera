use crate::app_context::AppContext;
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use tauri::State;
use documents::docuent_ports::NavigationDocument;
use work_items::entities::WorkItem;
use projects::entities::Project;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NavigationItem {
    pub id: String,
    pub label: String,
    pub icon: Option<String>,
    pub children: Option<Vec<NavigationItem>>,
    pub show_hover_menu: Option<bool>,
    pub unread: Option<bool>,
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
    state: State<'_, Mutex<Arc<AppContext>>>,
) -> Result<NavigationResponse, String> {
    let ctx = state.lock().map_err(|_| "Failed to lock context")?;

    let work_items = get_all_work_items(&ctx).map_err(|_| "Failed to get work_items")?;

    let documents = get_all_documents(&ctx, &project_id).map_err(|e| format!("Failed to get documents. {}", e))?;

    let mut sections = vec![];

    build_top_level_sections(&mut sections);
    build_work_item_section(&mut sections, &work_items);
    build_document_section(&mut sections, &documents);

    Ok(NavigationResponse { sections })
}

fn build_work_item_section(sections: &mut Vec<NavigationSection>, work_items: &Vec<WorkItem>) {
    let mut backlog_items = Vec::new();
    let mut sprint_items = Vec::new();

    let backlog_item = NavigationItem {
        id: "backlog".to_string(),
        label: "Backlog".to_string(),
        icon: Some("FaList".to_string()),
        children: Some(backlog_items),
        show_hover_menu: None,
        unread: None,
    };

    let sprints_item = NavigationItem {
        id: "sprints".to_string(),
        label: "Sprints".to_string(),
        icon: Some("FaRocket".to_string()),
        children: Some(sprint_items),
        show_hover_menu: None,
        unread: None,
    };

    sections.push(NavigationSection {
        id: "work_items".to_string(),
        label: "Work Items".to_string(),
        icon: Some("FaList".to_string()),
        items: vec![backlog_item, sprints_item],
        spacing_before: Some(true),
    })
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
        }
    }

    // Build root items (documents with no parent)
    let mut root_items: Vec<NavigationItem> = children_map
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
}

fn get_all_work_items(ctx: &AppContext) -> anyhow::Result<Vec<WorkItem>> {
    Ok(vec![])
}

fn get_all_documents(ctx: &AppContext, project_id: &str) -> anyhow::Result<Vec<NavigationDocument>> {
    // Get documents for the specified project
    let documents = ctx.documents.get_document_tree(project_id)?;

    Ok(documents)
}

#[tauri::command]
pub fn get_projects(
    state: State<'_, Mutex<Arc<AppContext>>>,
) -> Result<Vec<Project>, String> {
    let ctx = state.lock().map_err(|_| "Failed to lock context")?;
    let projects = ctx.projects.get_projects().map_err(|e| format!("Failed to get projects: {}", e))?;
    Ok(projects)
}
