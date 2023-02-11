<script>
    import Post from '$lib/components/Post.svelte';
    import Area from '$lib/components/Area.svelte';

    /** @type {import('./$types').PageData} */
    export let data;

    let userData = data.postJsonUser.data;
</script>

<Area>
    <span slot="header">
        <a href='/users/{userData.username}'>
            {userData.username}
        </a>
    </span>
    <span slot="main">
        <p>
            <b>Reputation:</b> {userData.reputation}
        </p>
        <p>
            <b>Upvotes:</b> {userData.upvotes}
        </p>
        <p>
            <b>Downvotes:</b> {userData.downvotes}
        </p>
    </span>
    <span slot="footer">
        
    </span>
</Area>

<h2>Posts</h2>

{#each data.postJson as data}
    <Post
        success={data.data.success}
        username={data.data.username}
        content={data.data.content}
        upvotes={data.data.upvotes}
        downvotes={data.data.downvotes}
        id={data.data.id}
        isAuthor={data.isAuthor}
    ></Post>
{/each}

<p>
    <a data-sveltekit-reload href='?page={data.id+1}'>Next page</a>
</p>
<p></p>