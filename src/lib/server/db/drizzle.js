import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import * as schema from './schema';

const dbName = 'database.db';
const dbPath = path.join(process.cwd(), dbName);

if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, '');
}

const client = new Database(dbPath);

export const db = drizzle(client, { schema });
