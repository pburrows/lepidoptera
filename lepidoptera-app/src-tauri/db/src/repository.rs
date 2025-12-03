use anyhow::Result;

pub trait EntityMetadata {
    fn table_name() -> &'static str;
    fn primary_key() -> &'static str { "id" }
    fn columns() -> &'static [&'static str];
}

pub trait CrudRepository<E>: Send + Sync {
    fn find_by_id(&self, id: i64) -> Result<Option<E>>;
    // fn find_all(&self) -> Result<Vec<E>>;
    // fn create(&self, entity: &E) -> Result<i64>;
    // fn update(&self, entity: &E) -> Result<()>;
    // fn delete(&self, id: i64) -> Result<()>;
}