<script>
    import Area from '$lib/Area.svelte';

    /** @type {import('./$types').PageData} */
    export let data;
    /** @type {import('./$types').ActionData} */
    export let form;
</script>

<Area>
    <p slot="header">
        Log in / Register
    </p>
    <form slot="main" method='POST'>
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
            <input formaction="?/login" type='submit' value='Log in'>
        </p>
        <p>
            <input formaction="?/register" type='submit' value='Register'>
        </p>
    </form>
    <p slot="footer">
        {#if form?.success}
            <p>{form?.success}</p>
        {/if}
        By using the Sanifae service, you agree to the <a href='https://insfa.net/rules'>Terms of Service</a>.
    </p>
</Area>