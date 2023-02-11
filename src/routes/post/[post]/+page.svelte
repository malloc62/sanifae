<script>
    import Post from '$lib/components/Post.svelte';

    /** @type {import('./$types').PageData} */
    export let data;
</script>
<Post
    success={data.data.success}
    username={data.data.username}
    content={data.data.content}
    upvotes={data.data.upvotes}
    downvotes={data.data.downvotes}
    id={data.data.id}
    isAuthor={data.isAuthor}
></Post>