import { postGetBulkBackend } from '../../../lib/db.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies }) {
    var page = url.searchParams.get('page') * 1;

    var postData = await postGetBulkBackend({ rows: 5, page });

    return new Response(JSON.stringify(postData));
};