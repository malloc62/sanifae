<style>
    #content {
        background: var(--dark-1);

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

    #main {
        min-height: 250px;
    }
</style>

<div id='content'>
    <div id='header'>
        <slot name="header">
            Header
        </slot>
    </div>
    <div id='main'>
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