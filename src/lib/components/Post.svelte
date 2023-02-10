<script>
    import Area from '$lib/components/Area.svelte';
    import PostButton from '$lib/components/PostButton.svelte';
    import PostBody from '$lib/components/PostBody.svelte';

    export let success, username, content, upvotes, downvotes, id;

    let query = (id) ? `/post/${id}` : '';

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
    <Area>
        <span slot="header">
            <a href='/user/{username}'>
                {username}
            </a>
        </span>
        <span slot="main">
            <PostBody content={content} />
        </span>
        <span slot="footer">
            <PostButton
                clickFunc={() => vote('up')}
                data={upvotes * 1}
                icon='/upvote.svg'
            />
            <PostButton
                clickFunc={() => vote('down')}
                data={downvotes * 1}
                icon='/downvote.svg'
            />
            {#if id}
                <PostButton
                    href='/post/{id}'
                    icon='/view.svg'
                />
            {/if}
        </span>
    </Area>
{/if}