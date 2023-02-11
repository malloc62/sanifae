<style>
    :global(:root) {
        --dark-1: #2b2f36;
        --dark-2: #d8d8d8;
        --dark-3: rgb(73, 138, 236);

        --light-1: #ffffff;
        --light-2: #f8f8f8;
        
        --hyperlink: rgb(139, 171, 219);

        font-family: 'Open Sans';
    }

    :global(a) {
        color: var(--hyperlink);
        text-decoration: none;
    }

    :global(input, textarea) {
        border: 0;
        border-radius: 0.2rem;
        box-shadow: 0px 2px 2.5px 0px var(--dark-2);
    }

    #content {
        background: var(--light-2);

        height: 100vh;
        width: calc(100vw - 50px);
        padding: 25px;
        padding-top: 0px;

        display: flex;
        flex-direction: column;
        align-items: center;

        overflow-y: scroll;
    }

    #logo {

        width: calc(100vw - 20px);

        background: var(--dark-1);

        padding: 5px;

        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;

        position: sticky;
        top: 0;
    }

    #logo a {
        padding: 10px;
        color: var(--light-1);
        font-weight: bold;
    }

    #logo img {
        height: 30px;
        width: auto;

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
            <img src='/icon_sanifae.svg' alt='Sanifae Logo'>
        </a>
        {#if data.username && data.username != 'false'}
            <a href='/user/{data.username}'>
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

