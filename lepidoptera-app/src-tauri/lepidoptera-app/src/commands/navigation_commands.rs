use crate::app_context::AppContext;
use documents::entities::Document;
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use tauri::{App, State};
use tickets::entities::Ticket;

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
    state: State<'_, Mutex<Arc<AppContext>>>,
) -> Result<NavigationResponse, String> {
    let ctx = state.lock().map_err(|_| "Failed to lock context")?;

    let tickets = get_all_tickets(&ctx).map_err(|_| "Failed to get tickets")?;

    let documents = get_all_documents(&ctx).map_err(|_| "Failed to get documents")?;

    let mut sections = vec![];

    build_top_level_sections(&mut sections);
    build_ticket_section(&mut sections, &tickets);
    build_document_section(&mut sections, &documents);

    Ok(NavigationResponse { sections })
}

fn build_ticket_section(sections: &mut Vec<NavigationSection>, tickets: &Vec<Ticket>) {
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
        id: "tickets".to_string(),
        label: "Tickets".to_string(),
        icon: Some("FaList".to_string()),
        items: vec![backlog_item, sprints_item],
        spacing_before: Some(true),
    })
}

fn build_document_section(sections: &mut Vec<NavigationSection>, documents: &Vec<Document>) {

    let doc_tree_item = NavigationItem {
        id: "doc-tree".to_string(),
        label: "<Document Tree>".to_string(),
        icon: None,
        children: None, //if doc_items.is_empty() { None } else { Some(doc_items) },
        show_hover_menu: None,
        unread: None,
    };

    sections.push(NavigationSection {
        id: "documents".to_string(),
        label: "Documents".to_string(),
        icon: Some("FaBook".to_string()),
        items: vec![doc_tree_item],
        spacing_before: Some(true),
    })
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

fn get_all_tickets(ctx: &AppContext) -> anyhow::Result<Vec<Ticket>> {
    Ok(vec![])
}

fn get_all_documents(ctx: &AppContext) -> anyhow::Result<Vec<Document>> {
    Ok(vec![])
}
