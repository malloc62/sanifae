<style>
    .button {
        padding: 0.5rem;
        background-color: var(--dark-3);
        border: none;

        font-family: 'Open Sans';
        
        border-radius: 2rem;

        margin: 0.2rem;
    }

    .button a {
        color: var(--light-1);
        font-weight: bold;
    }

</style>

<script>
    export let clickFunc = () => {};
    export let button = '';
</script>

<button on:click={clickFunc} class='button'>
    <a href='#'><slot/></a>
</button>