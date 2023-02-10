<style>
    .votes {
        font-weight: bold;
        font-size: 1.5rem;
    }
    .vote-area {
        margin-right: 30px;
    }

    .button {
        width: auto;
        height: 35px;
    }

</style>

<script>
    export let clickFunc = () => {};
    export let href = '#';
    export let data = ' ';
    export let icon = '/upvote.svg';
</script>

<span class='vote-area'>
    <a on:click={clickFunc} href='{href}'>
        <img src='{icon}' class='button' alt='Vote button'>
    </a>
    <span class='votes'>
        {data}
    </span>
</span>