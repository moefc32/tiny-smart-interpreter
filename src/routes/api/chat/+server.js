import { VITE_APP_NAME } from '$env/static/private';
import { json } from '@sveltejs/kit';
import gemini from '$lib/server/gemini.js';
import model from '$lib/server/model/history.js'
import trimText from '$lib/trimText';

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
        const chatHistory = await model.getData();
        const formattedHistory = chatHistory.map(({ role, text }) => ({
            role,
            parts: [{ text }],
        }));

        const result = await gemini.chat(prompt, formattedHistory);

        await model.createData({
            role: 'user',
            text: prompt,
            timestamp,
        });

        await model.createData({
            role: 'model',
            text: result,
            timestamp: Date.now(),
        });

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

export async function DELETE() {
    try {
        await model.deleteData();

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
