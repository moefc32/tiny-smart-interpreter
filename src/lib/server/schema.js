import sqlite from './sqlite';
import { TABLE_HISTORY, TABLE_CONFIG } from './model/tables';

export default function setSchema() {
    const queries = [
        `CREATE TABLE IF NOT EXISTS ${TABLE_HISTORY} (
            id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
            role TEXT NOT NULL,
            text TEXT NOT NULL,
            timestamp INTEGER NOT NULL
        );`,
        `CREATE TABLE IF NOT EXISTS ${TABLE_CONFIG} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            systemInstruction TEXT,
            temperature REAL NOT NULL,
            topP REAL NOT NULL,
            topK INTEGER NOT NULL
        );`,
        `INSERT INTO ${TABLE_CONFIG} (systemInstruction, temperature, topP, topK)
            SELECT
                'You are a personal AI assistant. Always respond in plain text only. Do not use markdown, lists, asterisks, or any other formatting symbols.',
                0.5,
                0.8,
                40
            WHERE NOT EXISTS (SELECT 1 FROM ${TABLE_CONFIG}
        );`,
    ];

    for (const query of queries) {
        sqlite(query);
    }
}
