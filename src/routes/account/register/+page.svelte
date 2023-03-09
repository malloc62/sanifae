<script>
    import Area from '$lib/components/Area.svelte';
    import { handleSubmit } from '$lib/util.js';

    export let form = {};

    let submitFunc = async e => form = JSON.parse(await handleSubmit(e))
</script>

<Area handleSubmit=''>
    <p slot="header">
        Register
    </p>

    <span slot='main'>
        <h2>Register</h2>
        <form action='/api/register' on:submit|preventDefault={submitFunc} method='POST'>
            <p>
                Username: <input name='user'>
            </p>
            <p>
                Password: <input type='password' name='pass'>
            </p>
            <p>
                Confirm Password: <input type='password' name='pass2'>
            </p>
            <p>
                <input type='submit' value='Register'>
            </p>
        </form>
    </span>
    <p slot="footer">
        {#if form?.success}
            <p>{form?.success}</p>
        {/if}
        By using the Sanifae service, you agree to the <a href='/tos'>Terms of Service</a>.
    </p>
</Area>