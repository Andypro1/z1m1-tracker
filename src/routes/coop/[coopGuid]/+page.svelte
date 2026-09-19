<script>
  import { page } from "$app/state";
  import Tracker from "../../Tracker.svelte";
</script>

<Tracker storageKey={page.state?.storageKey ?? ""} />
