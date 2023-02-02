<script>
    import Area from '$lib/Area.svelte';

    export let success, username, content, upvotes, downvotes, id;

    let query = (id) ? `/post/${id}` : '';
    
    let contentSplit = content.split('\n');
</script>

<style>
    .button {
        width: auto;
        height: 35px;
    }
    .votes {
        font-weight: bold;
        font-size: 1.5rem;
    }
    .vote-area {
        margin-right: 30px;
    }
</style>

{#if success}
    <Area>
        <p slot="header">
            Error
        </p>
        <p slot="main">
            {success}
        </p>
        <p slot="footer">
            Failed to get post.
        </p>
    </Area>
{:else}
    <Area tiny='{!!id}'>
        <span slot="header">
            <a href='/users/{username}'>
                {username}
            </a>
        </span>
        <span slot="main">
            {#each contentSplit as line}
                <p>{line}</p>
            {/each}
        </span>
        <span slot="footer">
            <span class='vote-area'>
                <a data-sveltekit-reload href='{query}?vote=up'>
                    <img src='/upvote.svg' class='button' alt='Upvote'>
                </a>
                <span class='votes'>
                    {upvotes + 0}
                </span>
            </span>
            <span class='vote-area'>
                <a data-sveltekit-reload href='{query}?vote=down'>
                    <img src='/downvote.svg' class='button' alt='Downvote'>
                </a>
                <span class='votes'>
                    {downvotes + 0}
                </span>
            </span>
            {#if id}
                <span class='vote-area'>
                    <a href='/post/{id}'>
                        <img src='/view.svg' class='button' alt='View'>
                    </a>
                </span>
            {/if}
        </span>
    </Area>
{/if}