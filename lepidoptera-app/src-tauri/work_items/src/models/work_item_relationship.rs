use serde::{Deserialize, Serialize};
use crate::entities::WorkItemRelationship as WorkItemRelationshipEntity;

/// Relationship types between work items
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum RelationshipType {
    /// Parent-child hierarchical relationship
    /// source is parent, target is child
    Parent,
    /// Child-parent hierarchical relationship
    /// source is child, target is parent
    Child,
    /// Source work item blocks target work item
    Blocks,
    /// Source work item is blocked by target work item
    BlockedBy,
    /// Source work item duplicates target work item
    Duplicates,
    /// Source work item is duplicated by target work item
    DuplicatedBy,
    /// General related relationship
    Related,
}

impl RelationshipType {
    /// Convert to string representation for database storage
    pub fn as_str(&self) -> &'static str {
        match self {
            RelationshipType::Parent => "parent",
            RelationshipType::Child => "child",
            RelationshipType::Blocks => "blocks",
            RelationshipType::BlockedBy => "blocked_by",
            RelationshipType::Duplicates => "duplicates",
            RelationshipType::DuplicatedBy => "duplicated_by",
            RelationshipType::Related => "related",
        }
    }

    /// Parse from string representation
    pub fn from_str(s: &str) -> Option<Self> {
        match s {
            "parent" => Some(RelationshipType::Parent),
            "child" => Some(RelationshipType::Child),
            "blocks" => Some(RelationshipType::Blocks),
            "blocked_by" => Some(RelationshipType::BlockedBy),
            "duplicates" => Some(RelationshipType::Duplicates),
            "duplicated_by" => Some(RelationshipType::DuplicatedBy),
            "related" => Some(RelationshipType::Related),
            _ => None,
        }
    }

    /// Get the inverse relationship type
    pub fn inverse(&self) -> Option<Self> {
        match self {
            RelationshipType::Parent => Some(RelationshipType::Child),
            RelationshipType::Child => Some(RelationshipType::Parent),
            RelationshipType::Blocks => Some(RelationshipType::BlockedBy),
            RelationshipType::BlockedBy => Some(RelationshipType::Blocks),
            RelationshipType::Duplicates => Some(RelationshipType::DuplicatedBy),
            RelationshipType::DuplicatedBy => Some(RelationshipType::Duplicates),
            RelationshipType::Related => Some(RelationshipType::Related), // Related is symmetric
        }
    }
}

/// Domain model for WorkItemRelationship
/// 
/// Represents a directional relationship between two work items.
/// The relationship is stored as: source_work_item_id → target_work_item_id
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkItemRelationshipModel {
    pub id: Option<String>,
    pub project_id: String,
    pub source_work_item_id: String,
    pub target_work_item_id: String,
    pub relationship_type: RelationshipType,
    pub created_at: String,
    pub updated_at: Option<String>,
    pub created_by: String,
    pub updated_by: Option<String>,
    pub is_active: bool,
}

impl WorkItemRelationshipModel {
    /// Convert from entity to model
    pub fn from_entity(entity: WorkItemRelationshipEntity) -> anyhow::Result<Self> {
        let relationship_type = RelationshipType::from_str(&entity.relationship_type)
            .ok_or_else(|| anyhow::anyhow!("Invalid relationship type: {}", entity.relationship_type))?;
        
        Ok(Self {
            id: entity.id,
            project_id: entity.project_id,
            source_work_item_id: entity.source_work_item_id,
            target_work_item_id: entity.target_work_item_id,
            relationship_type,
            created_at: entity.created_at,
            updated_at: entity.updated_at,
            created_by: entity.created_by,
            updated_by: entity.updated_by,
            is_active: entity.is_active,
        })
    }

    /// Convert from model to entity
    pub fn to_entity(&self) -> WorkItemRelationshipEntity {
        WorkItemRelationshipEntity {
            id: self.id.clone(),
            project_id: self.project_id.clone(),
            source_work_item_id: self.source_work_item_id.clone(),
            target_work_item_id: self.target_work_item_id.clone(),
            relationship_type: self.relationship_type.as_str().to_string(),
            created_at: self.created_at.clone(),
            updated_at: self.updated_at.clone(),
            created_by: self.created_by.clone(),
            updated_by: self.updated_by.clone(),
            is_active: self.is_active,
        }
    }
}

