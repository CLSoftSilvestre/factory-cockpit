import { DatabaseSync } from 'node:sqlite';
import path from 'path';

const db_path = path.join(import.meta.dirname, '..', 'database', 'main.db')

const database = new DatabaseSync(db_path);

const initDatabase = `
CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS dashboards (
    dashboard_id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    data TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    created_by TEXT NOT NULL
);
`;

database.exec(initDatabase);

export default database;