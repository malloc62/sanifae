<script>
    import PostList from '$lib/components/PostList.svelte';

    /** @type {import('./$types').PageData} */
    export let data;
</script>

<PostList data={data} />