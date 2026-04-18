import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import * as schema from './schema';

const dbName = 'database.db';
const dbPath = path.join(process.cwd(), dbName);
const client = new Database(dbPath);

client.pragma('foreign_keys = ON');
client.pragma('journal_mode = WAL');

export default drizzle(client, { schema });

function shutdown() {
    if (client.open) client.close();
};

process.on('SIGINT', () => {
    shutdown();
    process.exit(0);
});
process.on('SIGTERM', () => {
    shutdown();
    process.exit(0);
});
process.on('beforeExit', shutdown);
