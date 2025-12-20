use std::sync::{Arc, Mutex};
use rusqlite::ToSql;
use db::Connection;
use db::repository_base::{Entity, GenericRepository};
use crate::entities::{Document, DocumentVersion};
use crate::docuent_ports::NavigationDocument;

pub trait DocumentsRepository: Send + Sync {
    fn find_by_id(&self, id: &str) -> anyhow::Result<Option<Document>>;
    fn find_all(&self) -> anyhow::Result<Vec<Document>>;
    fn create(&self, document: Document) -> anyhow::Result<Document>;

    fn find_by_project_id(&self, project_id: &str, active_only: bool) -> anyhow::Result<Vec<Document>>;
    fn find_latest_version_for_document(&self, document_id: &str) -> anyhow::Result<Option<DocumentVersion>>;
    fn find_versions_for_documents(&self, document_ids: &[&str]) -> anyhow::Result<Vec<DocumentVersion>>;
    fn get_latest_documents(&self, project_id: &str) -> anyhow::Result<Vec<NavigationDocument>>;
}

pub struct SqliteDocumentsRepository {
    inner: GenericRepository<Document>,
    connection: Arc<Mutex<Connection>>
}

impl SqliteDocumentsRepository {
    pub fn new(connection: Arc<Mutex<Connection>>) -> Self {
        Self {
            inner: GenericRepository::new(connection.clone()),
            connection
        }
    }
}

impl DocumentsRepository for SqliteDocumentsRepository {
    fn find_by_id(&self, id: &str) -> anyhow::Result<Option<Document>> {
        self.inner.find_by_id(id, None)
    }

    fn find_all(&self) -> anyhow::Result<Vec<Document>> {
        let conn = self.connection
            .lock()
            .map_err(|e| anyhow::anyhow!("Failed to lock connection: {}", e))?;

        let documents = conn.query(
            &format!("SELECT * FROM {}", Document::table_name()),
            &[],
            |row| Document::from_row(row),
        )?;

        Ok(documents)
    }

    fn create(&self, document: Document) -> anyhow::Result<Document> {
        self.inner.create(document, None).map(|doc| doc)
    }

    fn find_by_project_id(&self, project_id: &str, active_only: bool) -> anyhow::Result<Vec<Document>> {
        let conn = self.connection
            .lock()
            .map_err(|e| anyhow::anyhow!("Failed to lock connection: {}", e))?;
        let param: &dyn ToSql = &&project_id;
        let params = &[param];
        let mut query: String  = "SELECT * FROM documents WHERE project_id = ?1".to_string();
        if active_only {
            query = format!("{query} AND is_active = 1")
        }

        conn.query(
            query.as_str(),
            params,
            |row| Document::from_row(row),
        )
    }

    fn find_latest_version_for_document(&self, document_id: &str) -> anyhow::Result<Option<DocumentVersion>> {
        let conn = self.connection
            .lock()
            .map_err(|e| anyhow::anyhow!("Failed to lock connection: {}", e))?;
        
        let param: &dyn ToSql = &&document_id;
        let params = &[param];
        let mut versions = conn.query(
            "SELECT * FROM document_versions WHERE document_id = ?1 ORDER BY version DESC LIMIT 1",
            params,
            |row| DocumentVersion::from_row(row),
        )?;
        
        Ok(versions.pop())
    }

    fn find_versions_for_documents(&self, document_ids: &[&str]) -> anyhow::Result<Vec<DocumentVersion>> {
        if document_ids.is_empty() {
            return Ok(vec![]);
        }

        let conn = self.connection
            .lock()
            .map_err(|e| anyhow::anyhow!("Failed to lock connection: {}", e))?;
        
        let placeholders: Vec<String> = (1..=document_ids.len())
            .map(|i| format!("?{}", i))
            .collect();

        let sql = format!(
            "SELECT * FROM document_versions
             WHERE document_id IN ({})
             ORDER BY document_id, version DESC",
            placeholders.join(", ")
        );

        let params: Vec<&dyn ToSql> = document_ids.iter().map(|s| s as &dyn ToSql).collect();
        conn.query(&sql, &params, |row| DocumentVersion::from_row(row))
    }

    fn get_latest_documents(&self, project_id: &str) -> anyhow::Result<Vec<NavigationDocument>> {
        let conn = self.connection
            .lock()
            .map_err(|e| anyhow::anyhow!("Failed to lock connection: {}", e))?;
        
        let param: &dyn ToSql = &&project_id;
        let params = &[param];
        
        // Query to get active documents with their latest published DocumentVersion
        // Uses a subquery to get the MAX(version) for each document, filtering to only published versions
        let sql = "
            SELECT 
                d.id,
                d.project_id,
                d.parent_id,
                d.slug,
                dv.title,
                dv.summary
            FROM documents d
            INNER JOIN document_versions dv ON d.id = dv.document_id
            INNER JOIN (
                SELECT document_id, MAX(version) as max_version
                FROM document_versions
                WHERE published_at IS NOT NULL
                GROUP BY document_id
            ) latest ON dv.document_id = latest.document_id AND dv.version = latest.max_version
            WHERE d.project_id = ?1 AND d.is_active = 1 AND dv.published_at IS NOT NULL
            ORDER BY d.slug
        ";
        
        conn.query(
            sql,
            params,
            |row| -> rusqlite::Result<NavigationDocument> {
                Ok(NavigationDocument {
                    id: row.get(0)?,
                    project_id: row.get(1)?,
                    parent_id: row.get(2)?,
                    slug: row.get(3)?,
                    title: row.get(4)?,
                    summary: row.get(5)?,
                })
            },
        )
    }
}