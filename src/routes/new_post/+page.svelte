<script>
    import Area from '$lib/Area.svelte';

    /** @type {import('./$types').PageData} */
    export let data;
    /** @type {import('./$types').ActionData} */
    export let form;
</script>

<style>
    textarea {
        width: 10rem;
        height: 10rem;
    }
</style>

<Area>
    <p slot="header">
        Create Post
    </p>
    <form slot="main" method='POST'>
        <p>
            <textarea name='content'></textarea>
        </p>
        <p>
            <input formaction="?/create" type='submit' value='Post'>
        </p>
    </form>
    <p slot="footer">
        {#if form?.success}
            <p>{form?.success}</p>
        {/if}
        Create a post for the world to see.
    </p>
</Area>