import { backend } from '../../../lib/db.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies, params }) {
    var backendParams = {cookies};

    for (const [key, value] of url.searchParams) {
        backendParams[key] = value;
    }

    return await main({backendParams, route: params.route});
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ url, cookies, request, params }) {
    var backendParams = {cookies};

    for (const [key, value] of (await request.formData()).entries()) {
        backendParams[key] = value;
    }

    return await main({backendParams, route: params.route});
}

async function main({backendParams, route}) {
    if (Object.keys(backend).indexOf(route) == -1) {
        return new Response(JSON.stringify({success: 'route doesn\'t exist'}));
    }

    var resData = await backend[route](backendParams);

    return new Response(JSON.stringify(resData));
};