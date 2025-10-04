import {
    VITE_GEMINI_SECRET,
    VITE_GEMINI_MODEL
} from '$env/static/private';
import { GoogleGenAI } from '@google/genai';
import extractText from '$lib/extractText';

const parameters = {
    systemInstruction: '',
    temperature: 0.2,
    topP: 0.8,
    topK: 40,
}
const genAI = new GoogleGenAI({
    apiKey: VITE_GEMINI_SECRET,
});

async function generate(prompt, additionalData = {}) {
    const contents = Object.keys(additionalData).length ? [
        { text: prompt },
        { inlineData: additionalData },
    ] : prompt;

    return await genAI.models.generateContent({
        model: VITE_GEMINI_MODEL,
        contents,
        config: parameters,
    });
}

export default {
    chat: async (prompt) => {
        const response = await generate(prompt);
        return extractText(response);
    },
    interpret: async (prompt, file) => {
        const response = await generate(prompt, {
            mimeType: file.mime,
            data: file.data,
        });

        return extractText(response);
    },
};
