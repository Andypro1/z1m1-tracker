<script>
	import { onMount } from "svelte";
	import { Link } from "svelte-routing";
	import storage from "../services/storage";

	const generateCoopGuid = () => {
		return 13;
	};
</script>

<!-- <svelte:window on:resize={} /> -->

<main>
	<nav>
		<h2>Start here</h2>
		<Link to="solo">Start tracking solo</Link>
		<Link to="coop/{generateCoopGuid()}">Start tracking coop</Link>

		<h2>Previous tracknig sessions</h2>
		<table>
			<thead>
				<th>Actions</th>
				<th>Label</th>
				<th>Date played</th>
			</thead>
			<tbody>
				{#each storage.listSaves() as item, index }
					<tr>
						<td>
							Resume tracking
							Trash
						</td>
						<td>
							{#if item.label}
								{item.label}
							{:else}
								<input placeholder="Add a label" on:blur={(e) => e.target.value && storage.addLabel(item.key, e.target.value)}/>
							{/if}
						</td>
						<td>
							{item.display}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</nav>
</main>

<style type="scss">
</style>
