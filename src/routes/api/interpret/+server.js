import { VITE_APP_NAME } from '$env/static/private';
import { json } from '@sveltejs/kit';
import gemini from '$lib/server/gemini';
import trimText from '$lib/trimText';

export async function POST({ request }) {
    const formData = await request.formData();
    const finetune = trimText(formData.get('finetune'));
    const attachment = formData.get('attachment');

    if (!attachment) {
        return json({
            application: VITE_APP_NAME,
            message: 'Attachment must be added, please try again!',
        }, {
            status: 400,
        });
    }

    try {
        const prompt =
            'Interpret this file in concise, clear, but elaborative description.';
        const fileBuffer = Buffer.from(await attachment.arrayBuffer());

        const result = await gemini.interpret(`${prompt} ${finetune}`, {
            mime: attachment.type,
            data: fileBuffer.toString('base64'),
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
