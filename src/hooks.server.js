import setSchema from '$lib/server/db/init';

setSchema();

export async function handle({ event, resolve }) {
    return resolve(event);
}
