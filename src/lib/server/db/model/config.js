import { eq } from 'drizzle-orm';
import { db } from '../drizzle';
import { Configs } from '../schema';

let cachedConfig;

async function loadFromDB() {
    const rows = await db
        .select({
            system_instruction: Configs.system_instruction,
            temperature: Configs.temperature,
            top_p: Configs.top_p,
            top_k: Configs.top_k,
        })
        .from(Configs)
        .limit(1);

    if (!rows[0]) throw new Error('AI configurations not found in DB');

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
            .update(Configs)
            .set({
                system_instruction: updatedConfig.system_instruction,
                temperature: updatedConfig.temperature,
                top_p: updatedConfig.top_p,
                top_k: updatedConfig.top_k,
            })
            .where(eq(Configs.id, 1));

        cachedConfig = {
            ...cachedConfig,
            ...updatedConfig,
        };

        return cachedConfig;
    },
};
