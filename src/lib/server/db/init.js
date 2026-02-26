import { sql } from 'drizzle-orm';
import { db } from '../db/drizzle';

export default async function setSchema() {
    await db.run(sql`
        CREATE TABLE IF NOT EXISTS history (
            id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
            role TEXT NOT NULL,
            text TEXT NOT NULL,
            timestamp INTEGER NOT NULL
        )
    `);

    await db.run(sql`
        CREATE TABLE IF NOT EXISTS config (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            system_instruction TEXT,
            temperature REAL NOT NULL,
            top_p REAL NOT NULL,
            top_k INTEGER NOT NULL
        )
    `);

    await db.run(sql`
        INSERT INTO config (system_instruction, temperature, top_p, top_k)
        SELECT
            'You are a personal AI assistant. Always respond in plain text only. Do not use markdown, lists, asterisks, or any other formatting symbols.',
            0.5,
            0.8,
            40
        WHERE NOT EXISTS (SELECT 1 FROM config)
    `);
}
