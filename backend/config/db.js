import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, '../database.sqlite'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
const initDB = () => {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('Admin', 'Technician', 'Operator', 'Manager')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Machines table
  db.exec(`
    CREATE TABLE IF NOT EXISTS machines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      model TEXT NOT NULL,
      department TEXT NOT NULL,
      last_maintenance_date TEXT,
      frequency_days INTEGER DEFAULT 30,
      frequency_hours INTEGER DEFAULT 500,
      total_hours_run REAL DEFAULT 0,
      status TEXT DEFAULT 'OK' CHECK(status IN ('OK', 'Due Soon', 'Overdue', 'At Risk')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Readings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      machine_id INTEGER NOT NULL,
      temperature REAL NOT NULL,
      pressure REAL,
      vibration REAL NOT NULL,
      runtime_hours REAL NOT NULL,
      operator_name TEXT NOT NULL,
      is_abnormal INTEGER DEFAULT 0,
      notes TEXT,
      reading_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (machine_id) REFERENCES machines(id) ON DELETE CASCADE
    )
  `);

  // Maintenance table
  db.exec(`
    CREATE TABLE IF NOT EXISTS maintenance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      machine_id INTEGER NOT NULL,
      maintenance_type TEXT NOT NULL,
      performed_by TEXT NOT NULL,
      maintenance_date TEXT NOT NULL,
      next_maintenance_date TEXT,
      notes TEXT,
      status TEXT DEFAULT 'Scheduled' CHECK(status IN ('Scheduled', 'Completed', 'Overdue')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (machine_id) REFERENCES machines(id) ON DELETE CASCADE
    )
  `);

  // Spare parts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS spare_parts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      part_name TEXT NOT NULL,
      part_number TEXT UNIQUE NOT NULL,
      quantity INTEGER DEFAULT 0,
      min_quantity INTEGER DEFAULT 5,
      location TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Part replacements table
  db.exec(`
    CREATE TABLE IF NOT EXISTS part_replacements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      machine_id INTEGER NOT NULL,
      part_id INTEGER NOT NULL,
      quantity_used INTEGER NOT NULL,
      replaced_by TEXT NOT NULL,
      replacement_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      notes TEXT,
      FOREIGN KEY (machine_id) REFERENCES machines(id) ON DELETE CASCADE,
      FOREIGN KEY (part_id) REFERENCES spare_parts(id) ON DELETE CASCADE
    )
  `);

  // Predictions table (ML results cache)
  db.exec(`
    CREATE TABLE IF NOT EXISTS predictions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      machine_id INTEGER NOT NULL,
      failure_probability REAL NOT NULL,
      risk_level TEXT NOT NULL,
      predicted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (machine_id) REFERENCES machines(id) ON DELETE CASCADE
    )
  `);

  console.log('✅ Database tables created successfully');
};

export { db, initDB };