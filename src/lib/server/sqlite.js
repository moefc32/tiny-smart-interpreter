import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbName = 'database.db';
const dbPath = path.join(process.cwd(), dbName);

if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, '');
}

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

export default function sqlite(dataQuery, params = []) {
    try {
        const query = dataQuery.trim();
        const stmt = db.prepare(query);
        const upperCaseQuery = query.toUpperCase();

        if (upperCaseQuery.startsWith('SELECT')) {
            return stmt.all(...params);
        } else if (
            upperCaseQuery.startsWith('INSERT') ||
            upperCaseQuery.startsWith('UPDATE') ||
            upperCaseQuery.startsWith('DELETE')
        ) {
            const result = stmt.run(...params);

            return {
                changes: result.changes,
                lastInsertRowid: result.lastInsertRowid,
            };
        } else {
            return stmt.run(...params);
        }

    } catch (e) {
        console.error(e);
        throw new Error('Database query failed!');
    }
}
