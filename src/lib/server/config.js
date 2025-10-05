import sqlite from './sqlite';
import { TABLE_CONFIG } from './model/tables';

let cachedConfig;

function loadFromDB() {
    const rows = sqlite(`
        SELECT
            systemInstruction,
            temperature,
            topP,
            topK
        FROM ${TABLE_CONFIG}
        LIMIT 1;
    `);

    if (!rows[0]) throw new Error('AI config not found in DB');

    cachedConfig = {
        systemInstruction: rows[0].systemInstruction,
        temperature: rows[0].temperature,
        topP: rows[0].topP,
        topK: rows[0].topK,
    };

    return cachedConfig;
}

export default {
    get: () => {
        if (!cachedConfig) return loadFromDB();
        return cachedConfig;
    },
    set: (newConfig) => {
        const updatedConfig = {
            systemInstruction: newConfig.systemInstruction,
            temperature: newConfig.temperature ?? cachedConfig.temperature,
            topP: newConfig.topP ?? cachedConfig.topP,
            topK: newConfig.topK ?? cachedConfig.topK,
        };

        sqlite(`
            UPDATE ${TABLE_CONFIG} SET
                systemInstruction = ?,
                temperature = ?,
                topP = ?,
                topK = ?
            WHERE id = 1;
        `, [
            updatedConfig.systemInstruction,
            updatedConfig.temperature,
            updatedConfig.topP,
            updatedConfig.topK
        ]);

        cachedConfig = {
            ...cachedConfig,
            ...updatedConfig,
        };

        return cachedConfig;
    },
};
