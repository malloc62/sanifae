/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params, url }) {
    var search = url.searchParams;

    var voteType = search.get('vote');

    var id = search.get('page') * 1;

    var user = params.user + '';

    await new Promise(resolve => setTimeout(resolve, 100));

    const res = await fetch(`/api/postBulk?user=${user}&page=${id}`);
    const postJson = await res.json();

    const resUser = await fetch(`/api/userGet?user=${user}`);
    const postJsonUser = (await resUser.json()) || {};

    return { postJson, id, postJsonUser };
}