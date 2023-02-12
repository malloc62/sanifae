<script>
    import Post from '$lib/components/Post.svelte';
    import Button from '$lib/components/Button.svelte'

    export let data;
</script>

{#if data && data.postJson && data.postJson.data}
    {#each data.postJson.data as post}
        <Post
            success={post.success}
            username={post.username}
            content={post.content}
            upvotes={post.upvotes}
            downvotes={post.downvotes}
            id={post.id}
            isAuthor={post.isAuthor}
        ></Post>
    {/each}
{/if}

<p>
    <Button clickFunc={() => { window.location.search = 'page=' + ((data.id)-1) }}>Previous page</Button>
    <Button clickFunc={() => { window.location.search = 'page=' + ((data.id)+1) }}>Next page</Button>
</p>