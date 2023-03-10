<script>
    import Area from '$lib/components/Area.svelte';
    import { handleSubmit } from '$lib/util.js';

    export let form = {};
    export let action = '/';
    export let name = 'Empty form';

    let submitFunc = async e => form = JSON.parse(await handleSubmit(e))
</script>

<Area handleSubmit=''>
    <span slot="header">
        {name}
    </span>

    <span slot='main'>
        <form action={action} on:submit|preventDefault={submitFunc} method='POST'>
            <slot></slot>
        </form>
    </span>
    <p slot="footer">
        {#if form?.success}
            <p>{form?.success}</p>
        {/if}
        By using the Sanifae service, you agree to the <a href='/tos'>Terms of Service</a>.
    </p>
</Area>