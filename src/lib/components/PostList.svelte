<script>
    import Post from '$lib/components/Post.svelte';
    import Button from '$lib/components/Button.svelte';
    import {setLocation} from '$lib/util.js';

    export let data;
</script>

<p>
    <Button clickFunc={() => { window.location.search = setLocation(window.location,'sort','hot')}}>Hot</Button>
    <Button clickFunc={() => { window.location.search = setLocation(window.location,'sort','rating')}}>Top</Button>
    <Button clickFunc={() => { window.location.search = setLocation(window.location,'sort','time')}}>Recent</Button>
</p>

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
            time={post.time}
        ></Post>
    {/each}
{/if}

<p>
    {#if data.id > 0}
        <Button clickFunc={() => { window.location.search = setLocation(window.location,'page',((data.id)-1)) }}>Previous page</Button>
    {/if}
    <Button clickFunc={() => { window.location.search = setLocation(window.location,'page',((data.id)+1)) }}>Next page</Button>
</p>