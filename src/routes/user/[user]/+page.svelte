<script>
    import Button from '$lib/components/Button.svelte'
    import Area from '$lib/components/Area.svelte';
    import PostList from '$lib/components/PostList.svelte';

    /** @type {import('./$types').PageData} */
    export let data;

    let userData = data.postJsonUser.data;
</script>

{#if userData}
    <Area>
        <span slot="header">
            <a href='/users/{userData.username}'>
                {userData.username}
            </a>
        </span>
        <span slot="main">
            <p>
                <b>Reputation:</b> {userData.reputation}
            </p>
            <p>
                <b>Upvotes:</b> {userData.upvotes}
            </p>
            <p>
                <b>Downvotes:</b> {userData.downvotes}
            </p>
        </span>
        <span slot="footer">
            
        </span>
    </Area>
{:else}
    <Area>
        <span slot="header">
            <a href='/users/{data.user}'>
                {data.user}
            </a>
        </span>
        <span slot="main">
        </span>
        <span slot="footer">
            This user does not have any statistics available.
        </span>
    </Area>
{/if}

<h2>Posts</h2>

<PostList data={data} />
