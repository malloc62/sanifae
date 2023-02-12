/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params, url }) {
    var search = url.searchParams;

    var id = search.get('page') * 1;

    var sort =  search.get('sort') || 'rating';

    await new Promise(resolve => setTimeout(resolve, 100));

    const res = await fetch(`/api/postBulk?page=${id}&sort=${sort}`);
    const postJson = await res.json();

    return { postJson, id };
}