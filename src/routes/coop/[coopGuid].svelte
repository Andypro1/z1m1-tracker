<script context="module">
    import Tracker from '../Tracker.svelte';

    let coopGuid;

	export async function load({ page, fetch, session, context }) {
        coopGuid = page.params.coopGuid;
	
        return {
            props: {
                coopGuid: coopGuid
            }
        };
    }
</script>


<Tracker coopGuid={coopGuid} />