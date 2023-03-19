<style>
    .button {
        padding: 0.5rem;
        border: none;
        border-bottom: solid var(--dark-3) 3px;

        font-family: 'Open Sans';

        margin-right: 0.2rem;
    }

    .button a {
        color: var(--dark-1);
        font-weight: bold;
        font-size: 1rem;
    }

</style>

<script>
    export let clickFunc = () => {};
    export let button = '';
</script>

<button on:click={clickFunc} class='button'>
    <a href='#'><slot/></a>
</button>