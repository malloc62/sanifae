import { postGetBackend } from '../../../lib/db.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies }) {
    var id = url.searchParams.get('post');

    var postData = await postGetBackend({ id });

    return new Response(JSON.stringify(postData));
};