/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
    const res = await fetch(`/api/session`);
    const username = await res.text();
    
    return { username };
}