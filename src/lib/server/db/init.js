import { sql } from 'drizzle-orm';
import { db } from '../db/drizzle';

function dedent(str) {
    const lines = str.replace(/^\n/, '').split('\n');
    const indent = Math.min(
        ...lines
            .filter(line => line.trim())
            .map(line => line.match(/^(\s*)/)[0].length)
    );

    return lines.map(line => line.slice(indent)).join('\n').trim();
}

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
            ${dedent(`
                You are a personal AI assistant.

                Formatting rules:
                - Output must be plain text.
                - Only the following Markdown elements are permitted: paragraphs, line breaks, bullet lists (-), numbered lists (1.), *italic*, and **bold**.
                - Tables, horizontal rules, and Headings are strictly forbidden.
                - Blockquotes, code blocks, HTML, links, and images are forbidden.
                - If a comparison is required, present it using bullet lists instead of tables.
            `)},
            0.5,
            0.8,
            40
        WHERE NOT EXISTS (SELECT 1 FROM config)
    `);
}
