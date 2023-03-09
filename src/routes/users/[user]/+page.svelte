<script>
    import Button from '$lib/components/Button.svelte'
    import Area from '$lib/components/Area.svelte';
    import PostList from '$lib/components/PostList.svelte';
    import FileUpload from '$lib/components/FileUpload.svelte';

    /** @type {import('./$types').PageData} */
    export let data;

    let uploadForm = {};

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

    .pfp {
        width: 50px;
        height: 50px;
        margin-right: 10px;
    }

    #header {
        display: flex;
        align-items: center;
    }
</style>

{#if userData}
    <Area>
        <span slot="header" id='header'>
            <img class='pfp' src='/pfp/{userData.username}.png'/>
            <a href='/users/{userData.username}'>
                {userData.username}
            </a>
        </span>
        <span slot="main">
            <div class='left'></div>
            <p>
                <b>Reputation:</b> {userData.reputation}
            </p>
            <p>
                <b>Upvotes:</b> {userData.upvotes}
            </p>
            <p>
                <b>Downvotes:</b> {userData.downvotes}
            </p>
            <h2>Roles</h2>
            <p>
                {#if userBio && userBio.rolesArr}
                    {#each userBio.rolesArr as role} 
                        <i class='follower'>{role}</i>
                    {/each}
                {/if}
            </p>

            <h2>Following</h2>
            {#each following as user}
                <a class='follower' href='/users/{user.following}'>
                    <img class='pfp' src='/pfp/{user.following}.png'/> 
                </a>
            {/each}

            <h2>Followers</h2>
            {#each followers as user}
                <a class='follower' href='/users/{user.username}'>
                    <img class='pfp' src='/pfp/{user.username}.png'/>    
                </a>
            {/each}
            {#if data.resAcc.data == userData.username}
                <h2>Set PFP</h2>
                <FileUpload bind:form={uploadForm} type='small' apiUrl={'/api/pfp'}/>
            {/if}
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
