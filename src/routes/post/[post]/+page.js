import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params, url }) {

    var id = params.post;

    await new Promise(resolve => setTimeout(resolve, 100));

    var f = (new FormData());

    f.append('id',id);
    const res = await fetch(`/api/postGet`, {
        method: 'POST',
        body: f
    });
    const postJson = (await res.json()).data;

    console.log(postJson);

    return postJson;
}