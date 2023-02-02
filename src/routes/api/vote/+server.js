import { tokenBackend, voteBackend } from '../../../lib/db.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies }) {
    var token = cookies.get('token') || '';

    var user = await tokenBackend({token});

    if (!user) return new Response('fail');

    var id = url.searchParams.get('post');
    var vote = url.searchParams.get('vote');

    voteBackend({user,id,vote});

    return new Response();
};