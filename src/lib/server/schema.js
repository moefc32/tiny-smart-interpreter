import sqlite from './sqlite';
import { TABLE_HISTORY } from './model/tables';

export default function setSchema() {
    const queries = [
        `CREATE TABLE IF NOT EXISTS ${TABLE_HISTORY} (
            id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
            role TEXT NOT NULL,
            text TEXT NOT NULL,
            timestamp INTEGER NOT NULL
        );`,
    ];

    for (const query of queries) {
        sqlite(query);
    }
}
