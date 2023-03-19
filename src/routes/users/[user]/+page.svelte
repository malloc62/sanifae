<script>
    import Button from '$lib/components/Button.svelte'
    import Area from '$lib/components/Area.svelte';
    import PostList from '$lib/components/PostList.svelte';
    import FileUpload from '$lib/components/FileUpload.svelte';

    /** @type {import('./$types').PageData} */
    export let data;

    let uploadForm = {};

    let userData = data.postJsonUser.data;

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
        width: 100px;
        height: 100px;
        border-radius: 100%;
    }

    .pfp-small {
        width: 45px;
        height: 45px;
        border-radius: 100%;
    }

    #header {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }

    .sections {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    .sections div {
        text-align: right;
        max-height: 300px;
        overflow-y: auto;
    }

    .sections div:nth-child(1) {
        text-align: left;
    }

    .profile {
        align-items: center;
        flex-direction: column;  
        display: flex;
    }
</style>

{#if userData}
    <Area>
        <span slot="header" id='header'>
            <div class='profile'>
                <img class='pfp' src='/img/pfp/{userData.username}.png'/>
                <a href='/users/{userData.username}'>
                    {userData.username}
                </a>
            </div>
            <div>
                <Button clickFunc={follow}>
                    Follow
                </Button>
            </div>
        </span>
        <span slot="main">
            <p class='data'>
                <span class='follower'>
                    <b>{userData.reputation}</b> Reputation
                </span>
                <span class='follower'>
                    <b>{userData.upvotes}</b> Upvotes
                </span>
                <span class='follower'>
                    <b>{userData.downvotes}</b> Downvotes
                </span>
            </p>

            {#if userData.rolesArr}
                <p>
                    {#each userData.rolesArr as role} 
                        <b class='follower'>{role}</b>
                    {/each}
                </p>
            {/if}

            <div class='sections'>   
                <div>           
                <h2>{following.length} following</h2>
                    {#each following as user}
                        <a href='/users/{user.following}'>
                            <img class='pfp-small' src='/img/pfp/{user.following}.png'/> 
                        </a>
                    {/each}
                </div>

                <div>
                    <h2>{followers.length} followers</h2>
                    {#each followers as user}
                        <a href='/users/{user.username}'>
                            <img class='pfp-small' src='/img/pfp/{user.username}.png'/>    
                        </a>
                    {/each}
                </div>
            </div>

            {#if data.resAcc.data == userData.username}
                <h2>Set PFP</h2>
                <FileUpload bind:form={uploadForm} type='small' apiUrl={'/api/pfp'}/>
            {/if}
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

<PostList data={data} />
