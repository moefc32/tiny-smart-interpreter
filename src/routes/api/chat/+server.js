import { VITE_APP_NAME } from '$env/static/private';
import { json } from '@sveltejs/kit';
import crypto from 'crypto';
import cache from '$lib/server/cache';
import modelConfig from '$lib/server/db/model/config';
import modelHistory from '$lib/server/db/model/history'
import gemini from '$lib/server/gemini';
import trimText from '$lib/trimText';

function hashPrompt(prompt) {
    return crypto
        .createHash('sha256')
        .update(prompt.toLowerCase())
        .digest('hex');
}

export async function POST({ request }) {
    const {
        prompt = '',
        timestamp = '',
    } = await request.json() || {};

    if (!prompt || !timestamp) {
        return json({
            application: VITE_APP_NAME,
            message: 'All data must be filled, please try again!',
        }, {
            status: 400,
        });
    }

    try {
        const key = hashPrompt(trimText(prompt));
        const cached = cache.get(key);

        if (cached) {
            await modelHistory.createData({
                role: 'user',
                text: trimText(prompt),
                timestamp,
            });

            await modelHistory.createData({
                role: 'model',
                text: cached,
                timestamp: Date.now(),
            });

            return json({
                application: VITE_APP_NAME,
                data: cached,
            });
        }

        const chatHistory = await modelHistory.getData();
        const formattedHistory = chatHistory.map(({ role, text }) => ({
            role,
            parts: [{ text }],
        }));

        const result = await gemini.chat(prompt, formattedHistory);

        await modelHistory.createData({
            role: 'user',
            text: prompt,
            timestamp,
        });

        await modelHistory.createData({
            role: 'model',
            text: result,
            timestamp: Date.now(),
        });

        if (!formattedHistory.length) {
            const key = hashPrompt(prompt);
            cache.set(key, result);
        }

        return json({
            application: VITE_APP_NAME,
            data: result,
        });
    } catch (e) {
        console.error(e);

        return json({
            application: VITE_APP_NAME,
            message: e,
        }, {
            status: 500,
        });
    }
}

export async function PUT({ request }) {
    let {
        system_instruction,
        temperature,
        top_p,
        top_k,
    } = await request.json() || {};

    if (temperature !== undefined) temperature = Number(temperature);
    if (top_p !== undefined) top_p = Number(top_p);
    if (top_k !== undefined) top_k = Number(top_k);

    if (
        (temperature !== undefined && typeof temperature !== 'number') ||
        (top_p !== undefined && typeof top_p !== 'number') ||
        (top_k !== undefined && !Number.isInteger(top_k))
    ) {
        return json({
            application: VITE_APP_NAME,
            message: 'Invalid configuration data, please try again!',
        }, {
            status: 400,
        });
    }

    try {
        const result = await modelConfig.set({
            system_instruction: system_instruction !== undefined
                ? trimText(system_instruction)
                : undefined,
            temperature,
            top_p,
            top_k,
        });

        return json({
            application: VITE_APP_NAME,
            message: 'AI configurations saved successfully.',
            data: result,
        }, {
            status: 200,
        });
    } catch (e) {
        console.error(e);

        return json({
            application: VITE_APP_NAME,
            message: e,
        }, {
            status: 500,
        });
    }
}

export async function DELETE() {
    try {
        await modelHistory.deleteData();

        return json({
            application: VITE_APP_NAME,
            message: 'Chat history cleared successfully.',
        }, {
            status: 200,
        });
    } catch (e) {
        console.error(e);

        return json({
            application: VITE_APP_NAME,
            message: e,
        }, {
            status: 500,
        });
    }
}
