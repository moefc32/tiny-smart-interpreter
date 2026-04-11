import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const Histories = sqliteTable('Histories', {
	id: text('id').primaryKey()
		.$defaultFn(() => sql`lower(hex(randomblob(16)))`),
	role: text('role').notNull(),
	text: text('text').notNull(),
	timestamp: integer('timestamp', { mode: 'timestamp_ms' }).notNull(),
});

export const Configs = sqliteTable('Configs', {
	id: text('id').primaryKey()
		.$defaultFn(() => sql`lower(hex(randomblob(16)))`),
	systemInstruction: text('system_instruction'),
	temperature: real('temperature').notNull(),
	topP: real('top_p').notNull(),
	topK: integer('top_k', { mode: 'number' }).notNull(),
});
