use crate::Connection;
use anyhow::Result;
use std::sync::{Arc, Mutex};
use std::collections::VecDeque;

/// A simple connection pool for SQLite connections
/// 
/// With WAL mode enabled, SQLite can handle concurrent reads from multiple connections.
/// This pool allows multiple operations to get their own connection, reducing contention.
pub struct ConnectionPool {
    path: String,
    pool: Arc<Mutex<VecDeque<Connection>>>,
    max_size: usize,
}

impl ConnectionPool {
    /// Create a new connection pool
    pub fn new(path: String, initial_size: usize, max_size: usize) -> Result<Self> {
        let mut pool = VecDeque::new();
        
        // Create initial connections
        for _ in 0..initial_size {
            let conn = Connection::new(&path)?;
            pool.push_back(conn);
        }
        
        Ok(Self {
            path,
            pool: Arc::new(Mutex::new(pool)),
            max_size,
        })
    }

    /// Get a connection from the pool
    /// Creates a new connection if pool is empty and under max size
    pub fn get(&self) -> Result<PooledConnection> {
        let mut pool = self.pool.lock()
            .map_err(|e| anyhow::anyhow!("Failed to lock pool: {}", e))?;
        
        let conn = if let Some(conn) = pool.pop_front() {
            conn
        } else {
            // Pool is empty, create a new connection if under max size
            Connection::new(&self.path)?
        };
        
        Ok(PooledConnection {
            conn: Some(conn),
            pool: Arc::clone(&self.pool),
            max_size: self.max_size,
        })
    }
}

/// A connection that will be returned to the pool when dropped
pub struct PooledConnection {
    conn: Option<Connection>,
    pool: Arc<Mutex<VecDeque<Connection>>>,
    max_size: usize,
}

impl PooledConnection {
    /// Get a reference to the underlying connection
    pub fn get(&self) -> &Connection {
        self.conn.as_ref().unwrap()
    }

    /// Get a mutable reference to the underlying connection
    pub fn get_mut(&mut self) -> &mut Connection {
        self.conn.as_mut().unwrap()
    }
}

impl Drop for PooledConnection {
    fn drop(&mut self) {
        if let Some(conn) = self.conn.take() {
            let mut pool = match self.pool.lock() {
                Ok(p) => p,
                Err(_) => return, // Pool is poisoned, just drop the connection
            };
            
            // Return to pool if under max size, otherwise drop it
            if pool.len() < self.max_size {
                pool.push_back(conn);
            }
        }
    }
}

