import { backend, backendProxy } from '../../../lib/db/db.js';


/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies, params }) {
    const formEntries = url.searchParams;
    return await handleReq({
        cookies,
        params: formEntries,
        route: params.route
    });
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, request, params }) {

    const formEntries = (await request.formData()).entries();
    
    return await handleReq({
        cookies,
        params: formEntries,
        route: params.route
    });
}

async function handleReq({ cookies, params, route }) {
    var backendParams = {cookies};

    for (const [key, value] of params) {
        backendParams[key] = value + '';
    }

    return await mainApi({backendParams, route: route});
}

async function mainApi({backendParams, route}) {
    if (Object.keys(backend).indexOf(route) == -1) {
        return new Response(JSON.stringify({success: 'route doesn\'t exist'}));
    }

    var resData = await backendProxy({ route, backendParams });

    return new Response(JSON.stringify(resData));
};