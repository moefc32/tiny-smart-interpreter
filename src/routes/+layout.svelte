<script>
    import '../app.css';
    import { Toasts } from 'svoast';
</script>

<svelte:head>
    <title>
        {import.meta.env.VITE_APP_NAME}
    </title>
</svelte:head>

<slot />
<Toasts position={'bottom-center'} />
