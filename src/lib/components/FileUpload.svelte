<script>
    import Button from '$lib/components/Button.svelte';

    export let form;

    let fileInput;
    let files;
    let preview;

    function getBase64(image) {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = e => {
            preview = e.target.result;
            uploadFunction(e.target.result);
        };
    };

    async function uploadFunction(imgBase64) {
        const imgData = imgBase64.split(',').pop();

        var fData = (new FormData());

        fData.append('img',imgData);
        fData.append('extension',fileInput.value.split('.').pop());

        form = await fetch(`/api/fileCreate`, {
            method: 'POST',
            body: fData
        }).then(x => x.json());
    };
</script>

<style>

    .hidden {
        display: none;
    }

    img {
        max-width: 250px;
    }
</style>

<form action='/api/postCreate' method='POST' >
    {#if preview}
        <img src={preview} alt="Image preview"/>
    {:else}
        <img src='/icon_sanifae.svg' alt="Image preview"/>
    {/if}
    <input class="hidden" id="file-to-upload" type="file" bind:files bind:this={fileInput} on:change={() => getBase64(files[0])}/>
    <p> 
        <Button class="upload-btn" clickFunc={ () => fileInput.click() }>Upload</Button>
    </p>
</form>