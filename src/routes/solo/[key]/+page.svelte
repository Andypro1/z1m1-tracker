<script>
  import Tracker from "../../Tracker.svelte";

  export let data;
</script>

<Tracker storageKey={data.key} />
