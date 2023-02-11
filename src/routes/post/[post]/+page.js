import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params, url }) {

    var id = params.post;

    await new Promise(resolve => setTimeout(resolve, 100));

    const res = await fetch(`/api/postGet?id=${id}`);
    const postJson = (await res.json());

    console.log(postJson);

    return postJson;
}