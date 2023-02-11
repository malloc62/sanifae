<script>
    import Post from '$lib/components/Post.svelte';
    import Button from '$lib/components/Button.svelte'

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
    <Button clickFunc={() => { window.location.search = 'page=' + ((data.id)-1) }}>Previous page</Button>
    <Button clickFunc={() => { window.location.search = 'page=' + ((data.id)+1) }}>Next page</Button>
</p>