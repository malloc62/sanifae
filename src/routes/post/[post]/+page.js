/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params, url }) {
    var id = params.post;
    const res = await fetch(`/api/post?post=${id}`);
    const postJson = await res.json();

    var search = url.searchParams;

    var voteType = (search.get('upvote')) ? 1 : ((search.get('downvote')) ? 2 : 0);
    
    return { postJson };
}