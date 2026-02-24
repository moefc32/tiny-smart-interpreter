import { asc } from 'drizzle-orm';
import { db } from '../drizzle';
import { history } from '../schema';

export default {
    getData: async () => {
        try {
            const result = await db
                .select({
                    role: history.role,
                    text: history.text,
                    timestamp: history.timestamp,
                })
                .from(history)
                .orderBy(asc(history.timestamp));

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when getting data!');
        }
    },
    createData: async (data) => {
        try {
            const result = await db
                .insert(history)
                .values({
                    role: data.role,
                    text: data.text,
                    timestamp: data.timestamp,
                })
                .returning();

            return {
                column: {
                    role: data.role,
                    text: data.text,
                    timestamp: data.timestamp,
                },
                ...result,
            };
        } catch (e) {
            console.error(e);
            throw new Error('Error when creating data!');
        }
    },
    deleteData: async () => {
        try {
            const result = await db.delete(history);
            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when deleting data!');
        }
    },
}
