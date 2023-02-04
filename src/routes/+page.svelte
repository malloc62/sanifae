<script>
    import Post from '$lib/Post.svelte';

    /** @type {import('./$types').PageData} */
    export let data;
</script>

{#each data.postJson.data as post}
    <Post
        success={post.success}
        username={post.username}
        content={post.content}
        upvotes={post.upvotes}
        downvotes={post.downvotes}
        id={post.id}
    ></Post>
{/each}

<p>
    <a data-sveltekit-reload href='?page={data.id+1}'>Next page</a>
</p>
<p></p>