import model from '$lib/server/model/history.js'

export async function load() {
    const chatHistory = await model.getData();

    return {
        chatHistory,
    };
}
