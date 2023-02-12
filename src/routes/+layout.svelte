<style>    
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

</style>

<script>
    /** @type {import('./$types').PageData} */
    export let data;

    import Header from '$lib/components/Header.svelte';
</script>

<div id='content'>
    <Header data={data} />
    <slot />
</div>

