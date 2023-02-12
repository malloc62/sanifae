<style>
    img {
        max-width: 100px;
        margin: 5px;
    }

    img.only-img {
        max-width: 450px;
    }

    p {
        white-space: pre-wrap;
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
        <p>
            {#each line as elem}
                {#if elem && elem.type == 'img'}
                    {#if line.filter(x => x.type == 'img').length < 2}
                        <img src={elem.url} class='only-img' alt='Image preview'>
                    {:else}
                        <img src={elem.url} alt='Image preview'>
                    {/if}
                {:else if elem.type == 'link'}
                    <a href={elem.url}>{elem.display + ' '}</a>
                {:else}
                    {elem + ' '}
                {/if}
            {/each}
        </p>
    {/each}
</span>