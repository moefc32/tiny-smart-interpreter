import {
    VITE_GEMINI_SECRET,
    VITE_GEMINI_MODEL
} from '$env/static/private';
import { GoogleGenAI } from '@google/genai';
import config from './db/model/config';
import extractText from '$lib/extractText';

const genAI = new GoogleGenAI({
    apiKey: VITE_GEMINI_SECRET,
});

export default {
    chat: async (prompt, chatHistory) => {
        const chat = genAI.chats.create({
            model: VITE_GEMINI_MODEL,
            history: chatHistory,
            config: config.get(),
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
            config: config.get(),
        });

        return extractText(response);
    },
};
