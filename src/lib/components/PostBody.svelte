<style>
    img, video {
        max-width: 100px;
        margin: 5px;
    }

    .only-img {
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
                {:else if elem.type == 'video'}
                    {#if line.filter(x => x.type == 'video').length < 2}
                        <video class='only-img' alt='Video preview' controls>
                            <source src={elem.url}>
                        </video>
                    {:else}
                        <video alt='Video preview' controls>
                            <source src={elem.url}>
                        </video>
                    {/if}
                {:else if elem.type == 'link'}
                    <a href={elem.url}>{elem.display + ' '}</a>
                {:else if !elem.type}
                    {elem + ' '}
                {/if}
            {/each}
        </p>
    {/each}
</span>