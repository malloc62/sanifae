<style>
    #content {
        background: var(--light-1);
        box-shadow: 0px 3px 5px 3px var(--dark-2);

        width: min(700px, 90vw);
        padding: 20px;
        padding-top: 8px;
        margin: 25px;

        border-radius: 25px;

        display: flex;
        flex-direction: column;
    }

    #header {
        font-weight: bold;
        
        font-size: 2rem;

        width: 100%;

        padding: 0;
    }

    #header {
        border-bottom: var(--dark-2) solid 2px;
    }

    #main {
        min-height: 250px;
        max-height: 500px;
        overflow-y: scroll;
    }

    #main.tiny {
        min-height: initial;
        height: 100px;
        overflow: hidden;
    }
</style>


<script>
    export let tiny = false;

    let form;
</script>

<div id='content'>
    <div id='header'>
        <slot name="header">
            Header
        </slot>
    </div>
    <div id='main' class='{tiny ? "tiny" : ""}'>
        <slot name="main">
            <p>Content</p>
        </slot>
    </div>
    <div id='footer'>
        <slot name="footer">
            <p>Footer</p>
        </slot>
    </div>
</div>