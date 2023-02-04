<script>
    import Post from '$lib/Post.svelte';

    /** @type {import('./$types').PageData} */
    export let data;
</script>

<Post
    success={data.success}
    username={data.username}
    content={data.content}
    upvotes={data.upvotes}
    downvotes={data.downvotes}
></Post>