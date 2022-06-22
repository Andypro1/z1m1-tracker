<script context="module">
    import Tracker from '../Tracker.svelte';

    let coopGuid;

	export async function load({ params, fetch, session, stuff }) {
        coopGuid = params.coopGuid;

        return {
            props: {
                coopGuid: coopGuid
            }
        };
    }
</script>

<Tracker coopGuid={coopGuid} />