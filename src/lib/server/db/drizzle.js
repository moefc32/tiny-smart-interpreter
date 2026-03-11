import path from 'path';
import fs from 'fs';
import * as schema from './schema';

const dbName = 'database.db';
const dbPath = path.join(process.cwd(), dbName);

let db;

if (typeof Bun !== 'undefined') {
    const { drizzle } = await import('drizzle-orm/bun-sqlite');
    const { Database } = await import('bun:sqlite');

    const client = new Database(dbPath);
    db = drizzle(client, { schema });
} else {
    const { drizzle } = await import('drizzle-orm/better-sqlite3');
    const { default: Database } = await import('better-sqlite3');

    const client = new Database(dbPath);
    db = drizzle(client, { schema });
}

export { db };
