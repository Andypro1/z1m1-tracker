<script context="module">
    import Tracker from '../Tracker.svelte';

    /** @type {import('@sveltejs/kit').Handle} */
    export async function handle({ event, resolve }) {
        const response = await resolve(event, {
            ssr: false
        });

        return response;
    }
</script>

<Tracker></Tracker>