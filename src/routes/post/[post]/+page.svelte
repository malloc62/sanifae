<script>
    import Area from '$lib/Area.svelte';

    /** @type {import('./$types').PageData} */
    export let data;
    /** @type {import('./$types').ActionData} */
    export let form;
</script>

<style>
    .button {
        width: auto;
        height: 75px;
    }
    .votes {
        font-weight: bold;
        font-size: 1.5rem;
    }
    .vote-area {
        margin-right: 30px;
    }
</style>

{#if data.postJson.success}
    <Area>
        <p slot="header">
            Error
        </p>
        <p slot="main">
            {data.postJson.success}
        </p>
        <p slot="footer">
            Failed to get post.
        </p>
    </Area>
{:else}
    <Area>
        <p slot="header">
            <a href='/users/{data.postJson.username}'>
                {data.postJson.username}
            </a>
        </p>
        <p slot="main">
            {data.postJson.content}
        </p>
        <p slot="footer">
            <span class='vote-area'>
                <a href='?upvote'>
                    <img src='/upvote.svg' class='button' alt='Upvote'>
                </a>
                <span class='votes'>
                    {data.postJson.upvotes + 0}
                </span>
            </span>
            <span class='vote-area'>
                <a href='?downvote'>
                    <img src='/downvote.svg' class='button' alt='Downvote'>
                </a>
                <span class='votes'>
                    {data.postJson.downvotes + 0}
                </span>
            </span>
        </p>
    </Area>
{/if}