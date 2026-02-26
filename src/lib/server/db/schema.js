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
	system_instruction: text('system_instruction'),
	temperature: real('temperature').notNull(),
	top_p: real('top_p').notNull(),
	top_k: integer('top_k').notNull(),
});
