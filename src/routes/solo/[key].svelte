<script context="module">
    import Tracker from "../Tracker.svelte";

    let key;

    /** @type {import('@sveltejs/kit').Handle} */
    export async function handle({ event, resolve }) {
        const response = await resolve(event, {
            ssr: false
        });

        return response;
    }

    export async function load({ params, fetch, session, stuff }) {
        key = params.key;

        return {
            props: {
                key: key,
            },
        };
    }
</script>

<Tracker storageKey={key} />
