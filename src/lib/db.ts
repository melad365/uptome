import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'uptome.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS picks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT,
    date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS pick_tags (
    pick_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (pick_id, tag_id),
    FOREIGN KEY (pick_id) REFERENCES picks(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
  );
`);

export default db;

export interface Pick {
  id: number;
  title: string;
  description: string;
  location?: string;
  date?: string;
  created_at: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface PickWithTags extends Pick {
  tags: Tag[];
}