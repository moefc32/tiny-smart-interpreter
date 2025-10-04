<script>
    import { toast } from 'svoast';

    let prompt = '';

    async function submit() {
        try {
        } catch (e) {
            console.error(e);
            toast.error('Cannot get proper response, please try again!');
        }
    }
</script>

<h1>Welcome to SvelteKit</h1>
<p>
    Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the
    documentation
</p>
