<script>
    import Area from '$lib/components/Area.svelte';

    import { handleSubmit } from '$lib/util.js';

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
    <form slot="main" action='/api/postCreate' method='POST' on:submit|preventDefault={async e => form = JSON.parse(await handleSubmit(e)) }>
        <p>
            <textarea name='content'></textarea>
        </p>
        <p>
            <input formaction="?/create" type='submit' value='Post'>
        </p>
    </form>
    <span slot="footer">
        <p>
            {#if form?.success}
                {#if form?.href}
                    <a href='{form?.href}'>{form?.success}</a>
                {:else}
                    {form?.success}
                {/if}
            {/if}
        </p>
        <p>Create a post for the world to see.</p>
        <h2>Post syntax</h2>
        <p>
            <b>img||filename.blah</b> embeds a user-uploaded file in this site
        </p>
    </span>
</Area>