import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const history = sqliteTable('history', {
	id: text('id')
		.primaryKey()
		.default(sql`lower(hex(randomblob(16)))`),

	role: text('role').notNull(),
	text: text('text').notNull(),
	timestamp: integer('timestamp').notNull(),
});

export const config = sqliteTable('config', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	systemInstruction: text('systemInstruction'),
	temperature: real('temperature').notNull(),
	topP: real('topP').notNull(),
	topK: integer('topK').notNull(),
});
