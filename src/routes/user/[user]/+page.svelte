<script>
    import Button from '$lib/components/Button.svelte'
    import Area from '$lib/components/Area.svelte';
    import PostList from '$lib/components/PostList.svelte';

    /** @type {import('./$types').PageData} */
    export let data;

    let userData = data.postJsonUser.data;
    let userBio = data.postJsonUserBio.data;

    let following = data.postJsonUser.following;
    let followers = data.postJsonUser.followers;

    function follow() {
        let fData = (new FormData());

        fData.append('target',userData.username);

        fetch('/api/follow', {
            method: 'POST',
            body: fData
        }).then(async x => {
            let xJson = (await x.json()).data;
            following = xJson.following;
            followers = xJson.followers;
        })
    }
</script>

<style>
    .follower {
        margin-right: 1.5rem;
    }
</style>

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
            {#if userBio && userBio.roles == 69} 
                <p><b>This user is an Owner.</b></p>
            {/if}

            <h2>Following</h2>
            {#each following as user}
                <a class='follower' href='/user/{user}'>{user.following}</a>
            {/each}

            <h2>Followers</h2>
            {#each followers as user}
                <a class='follower' href='/user/{user}'>{user.username}</a>
            {/each}
        </span>
        <span slot="footer">
            <Button clickFunc={follow}>
                Follow
            </Button>
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
