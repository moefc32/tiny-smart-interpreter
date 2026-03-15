<script>
    import '../app.css';
    import { Toaster } from 'svelte-sonner';

    let { children } = $props();
</script>

<svelte:head>
    <title>
        {import.meta.env.VITE_APP_NAME}
    </title>
</svelte:head>

{@render children()}

<Toaster
    richColors
    theme="system"
    position="bottom-center"
    toastOptions={{
        style: 'font-size: 1rem;',
    }}
/>
