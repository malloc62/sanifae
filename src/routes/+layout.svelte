<style>
    :global(:root) {
        --dark-1: #1a1b1d;
        --dark-2: #22242b;

        --light-1: #ffffff;
        
        --hyperlink: #97b9eb;

        color: var(--light-1);
        font-family: 'Open Sans';
    }

    :global(a) {
        color: var(--hyperlink);
        text-decoration: none;
    }

    :global(input, textarea) {
        border: 0;
        border-radius: 0.2rem;
    }

    #content {
        background: var(--dark-2);

        height: 100vh;
        width: calc(100vw - 50px);
        padding: 25px;

        display: flex;
        flex-direction: column;
        align-items: center;

        overflow-y: scroll;
    }

    #logo {
        background: var(--dark-1);

        padding: 10px;

        border-radius: 50px;

        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;

        position: sticky;
        top: 0;
    }

    #logo a {
        padding: 10px;
    }

    #logo img {
        height: auto;
        width: 125px;

        display: block;
    }
</style>

<script>
    /** @type {import('./$types').PageData} */
    export let data;
</script>

<div id='content'>
    <div id='logo'>
        <a href='/'>
            <img src='/logo_sanifae.svg' alt='Sanifae Logo'>
        </a>
        {#if data.username && data.username != 'false'}
            <a href='/users/{data.username}'>
                {data.username}
            </a>
            <a href='/logout'>
                Log out
            </a>
            <a href='/new_post'>
                Create
            </a>
        {:else}
            <a href='/account'>
                Log in / Register
            </a>
        {/if}
    </div>
    <slot></slot>
</div>

