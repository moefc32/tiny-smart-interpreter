import { redirect } from '@sveltejs/kit';
import config from '$lib/server/config';
import model from '$lib/server/model/history'

export async function load({ url }) {
    const searchParams = url.searchParams;
    const hasInterpret = searchParams.has('interpret');
    const hasSettings = searchParams.has('settings');

    if (hasInterpret && hasSettings) {
        throw redirect(307, `${url.pathname}?interpret`);
    }

    if (!hasInterpret && !hasSettings && url.search) {
        throw redirect(307, url.pathname);
    }

    const chatHistory = await model.getData();

    return {
        activeTab: hasSettings ? 2 : hasInterpret ? 1 : 0,
        config: config.get(),
        chatHistory,
    };
}
