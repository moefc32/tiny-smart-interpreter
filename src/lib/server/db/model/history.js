import { asc } from 'drizzle-orm';
import { Histories } from '../schema';
import db from '../drizzle';

export default {
    getData: async () => {
        try {
            const result = await db
                .select({
                    role: Histories.role,
                    text: Histories.text,
                    timestamp: Histories.timestamp,
                })
                .from(Histories)
                .orderBy(asc(Histories.timestamp));

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when getting data!');
        }
    },
    createData: async (data) => {
        try {
            const [result] = await db
                .insert(Histories)
                .values({
                    role: data.role,
                    text: data.text,
                    timestamp: data.timestamp,
                })
                .returning();

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when creating data!');
        }
    },
    deleteData: async () => {
        try {
            const result = await db.delete(Histories);
            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when deleting data!');
        }
    },
}
