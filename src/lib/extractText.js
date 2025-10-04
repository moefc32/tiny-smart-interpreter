export default function extractText(input) {
    try {
        const text =
            input?.response?.candidates?.[0]?.content?.parts?.[0]?.text ??
            input?.candidates?.[0]?.content?.parts?.[0]?.text ??
            input?.response?.candidates?.[0]?.content?.text;

        return text ?? JSON.stringify(input, null, 4);
    } catch (e) {
        console.error(e);
        return JSON.stringify(input, null, 4);
    }
}
