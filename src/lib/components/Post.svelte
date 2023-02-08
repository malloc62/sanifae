<script>
    import Area from '$lib/components/Area.svelte';

    import {formatPost} from '$lib/util.js';

    export let success, username, content, upvotes, downvotes, id;

    let query = (id) ? `/post/${id}` : '';
    
    let contentSplit = formatPost(content || '');

    let fData;

    function vote(v) {
        fData = (new FormData());

        fData.append('vote',v);
        fData.append('id',id);

        fetch('/api/vote', {
            method: 'POST',
            body: fData
        }).then(async x => {
            var j = (await x.json());
            upvotes = j.data.up;
            downvotes = j.data.down;
        })
    }
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

    img {
        max-width: 250px;
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
            <a href='/user/{username}'>
                {username}
            </a>
        </span>
        <span slot="main">
            {#each contentSplit as line}
                {#if line && line.type == 'img'}
                    <img src={line.url} alt='Image preview'>
                {:else}
                    <p>{line}</p>
                {/if}
            {/each}
        </span>
        <span slot="footer">
            <span class='vote-area'>
                <a on:click={() => vote('up')} href=''>
                    <img src='/upvote.svg' class='button' alt='Upvote'>
                </a>
                <span class='votes'>
                    {upvotes + 0}
                </span>
            </span>
            <span class='vote-area'>
                <a on:click={() => vote('down')} href=''>
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