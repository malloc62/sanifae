import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params, url }) {
    var search = url.searchParams;

    var voteType = search.get('vote');

    var id = params.post;

    if (voteType) {
        var voteRes = await fetch(`/api/vote?post=${id}&vote=${voteType}`);
        var voteJson = await voteRes.text();

        if (voteJson == 'fail') {
            throw redirect(302, '/account');
        }
    }

    await new Promise(resolve => setTimeout(resolve, 100));

    const res = await fetch(`/api/post?post=${id}`);
    const postJson = await res.json();

    return postJson;
}