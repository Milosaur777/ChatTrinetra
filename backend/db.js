/**
 * Database connection and utility functions
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Create data directory if it doesn't exist
const DATA_DIR = path.join(__dirname, '../../data/captainclaw');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'captainclaw.db');

let db = null;

// Initialize database connection
function initDB() {
  return new Promise((resolve, reject) => {
    if (db) {
      console.log('✅ Database already connected');
      return resolve(db);
    }
    
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Database connection error:', err);
        db = null;
        reject(err);
      } else {
        console.log('✅ Database connected:', DB_PATH);
        // Enable foreign keys
        db.run('PRAGMA foreign_keys = ON', (err) => {
          if (err) {
            console.error('Foreign keys error:', err);
            reject(err);
          } else {
            console.log('✅ Foreign keys enabled');
            resolve(db);
          }
        });
      }
    });
  });
}

// Run query with promise
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject(new Error('Database not initialized'));
    }
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

// Get single row
function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject(new Error('Database not initialized'));
    }
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Get all rows
function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject(new Error('Database not initialized'));
    }
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

// Initialize schema
async function initSchema() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  
  const statements = schema.split(';').filter(s => s.trim());
  
  for (const statement of statements) {
    await run(statement);
  }
  
  console.log('✅ Database schema initialized');
}

module.exports = {
  initDB,
  initSchema,
  run,
  get,
  all,
  getDB: () => db
};
