import { VITE_APP_NAME } from '$env/static/private';
import { json } from '@sveltejs/kit';
import gemini from '$lib/server/gemini.js';
import trimText from '$lib/trimText';

export async function POST({ request }) {
    const { prompt = '' } = await request.json() || {};

    if (!prompt) {
        return json({
            application: VITE_APP_NAME,
            message: 'Chat must not be empty, please try again!',
        }, {
            status: 400,
        });
    }

    try {
        const result = await gemini.chat(prompt);

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
