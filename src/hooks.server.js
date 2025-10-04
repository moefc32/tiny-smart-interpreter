import setSchema from '$lib/server/schema';

setSchema();

export async function handle({ event, resolve }) {
    return resolve(event);
}
