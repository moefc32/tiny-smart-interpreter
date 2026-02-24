import { eq } from 'drizzle-orm';
import { db } from '../drizzle';
import { config } from '../schema';

let cachedConfig;

async function loadFromDB() {
    const rows = await db
        .select({
            systemInstruction: config.systemInstruction,
            temperature: config.temperature,
            topP: config.topP,
            topK: config.topK,
        })
        .from(config)
        .limit(1);

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
    get: async () => {
        if (!cachedConfig) return await loadFromDB();
        return cachedConfig;
    },
    set: async (newConfig) => {
        const updatedConfig = {
            systemInstruction: newConfig.systemInstruction,
            temperature: newConfig.temperature ?? cachedConfig.temperature,
            topP: newConfig.topP ?? cachedConfig.topP,
            topK: newConfig.topK ?? cachedConfig.topK,
        };

        await db
            .update(config)
            .set({
                systemInstruction: updatedConfig.systemInstruction,
                temperature: updatedConfig.temperature,
                topP: updatedConfig.topP,
                topK: updatedConfig.topK,
            })
            .where(eq(config.id, 1));

        cachedConfig = {
            ...cachedConfig,
            ...updatedConfig,
        };

        return cachedConfig;
    },
};
