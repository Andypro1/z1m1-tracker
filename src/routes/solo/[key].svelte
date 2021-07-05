<script context="module">
    import Tracker from '../Tracker.svelte';

    export const ssr = false;
    
    let key;

	export async function load({ page, fetch, session, context }) {
        key = page.params.key;
	
        return {
            props: {
                key: key
            }
        };
    }
</script>

<Tracker storageKey={key}></Tracker>