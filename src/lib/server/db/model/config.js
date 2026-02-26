import { eq } from 'drizzle-orm';
import { db } from '../drizzle';
import { config } from '../schema';

let cachedConfig;

async function loadFromDB() {
    const rows = await db
        .select({
            system_instruction: config.system_instruction,
            temperature: config.temperature,
            top_p: config.top_p,
            top_k: config.top_k,
        })
        .from(config)
        .limit(1);

    if (!rows[0]) throw new Error('AI config not found in DB');

    cachedConfig = {
        system_instruction: rows[0].system_instruction,
        temperature: rows[0].temperature,
        top_p: rows[0].top_p,
        top_k: rows[0].top_k,
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
            system_instruction: newConfig.system_instruction,
            temperature: newConfig.temperature ?? cachedConfig.temperature,
            top_p: newConfig.top_p ?? cachedConfig.top_p,
            top_k: newConfig.top_k ?? cachedConfig.top_k,
        };

        await db
            .update(config)
            .set({
                system_instruction: updatedConfig.system_instruction,
                temperature: updatedConfig.temperature,
                top_p: updatedConfig.top_p,
                top_k: updatedConfig.top_k,
            })
            .where(eq(config.id, 1));

        cachedConfig = {
            ...cachedConfig,
            ...updatedConfig,
        };

        return cachedConfig;
    },
};
