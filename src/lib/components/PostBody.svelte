<style>
    img {
        max-width: 250px;
        display: block;
    }
</style>

<script>
    import {formatPost} from '$lib/util.js';

    export let content = '';

    let contentSplit;
    $: contentSplit = formatPost(content || '');

    console.log(contentSplit);
</script>

<span>
    {#each contentSplit as line}
        {#if line && line.type == 'img'}
            <img src={line.url} alt='Image preview'>
        {:else}
            <p>{line}</p>
        {/if}
    {/each}
</span>