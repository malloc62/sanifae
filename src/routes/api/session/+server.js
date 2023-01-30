import { tokenBackend } from '../../../lib/db.js';


/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies }) {
    var token = cookies.get('token') || '';

    var username = await tokenBackend({token});

    return new Response(username + '');
};