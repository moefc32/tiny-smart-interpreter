import {
    VITE_GEMINI_SECRET,
    VITE_GEMINI_MODEL
} from '$env/static/private';
import { GoogleGenAI } from '@google/genai';
import extractText from '$lib/extractText';

const parameters = {
    systemInstruction:
        'You are a personal AI assistant. Always respond in plain text only. Do not use markdown, lists, asterisks, or any other formatting symbols.',
    temperature: 0.5,
    topP: 0.8,
    topK: 40,
}
const genAI = new GoogleGenAI({
    apiKey: VITE_GEMINI_SECRET,
});

export default {
    chat: async (prompt, chatHistory) => {
        const chat = genAI.chats.create({
            model: VITE_GEMINI_MODEL,
            history: chatHistory,
            config: parameters,
        });

        const response = await chat.sendMessage({
            message: prompt,
        });

        return extractText(response);
    },
    interpret: async (prompt, file) => {
        const response = await genAI.models.generateContent({
            model: VITE_GEMINI_MODEL,
            contents: [
                { text: prompt },
                {
                    inlineData: {
                        mimeType: file.mime,
                        data: file.data,
                    },
                }],
            config: parameters,
        });

        return extractText(response);
    },
};
