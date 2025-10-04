import sqlite from '../sqlite';
import { TABLE_HISTORY } from './tables';

export default {
    getData: async () => {
        try {
            const result = sqlite(`
                SELECT
                    role,
                    text,
                    timestamp
                FROM ${TABLE_HISTORY}
                ORDER BY timestamp ASC;
            `);

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when getting data!');
        }
    },
    createData: async (data) => {
        try {
            const result = sqlite(`
                INSERT INTO ${TABLE_HISTORY} (
                    role,
                    text,
                    timestamp
                ) VALUES (?, ?, ?);
            `, [
                data.role,
                data.text,
                data.timestamp
            ]);

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
            const result = sqlite(`
                DELETE FROM ${TABLE_HISTORY};
            `);

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when deleting data!');
        }
    },
}
