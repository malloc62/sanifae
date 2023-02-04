/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
    const res = await fetch(`/api/token`);

    const username = await res.json();

    return { username: username.data };
}