<script context="module">
	export const ssr = false;
</script>

<script>
	import { onMount } from "svelte";
	import storage from "../services/storage";

	const generateCoopGuid = () => {
		return 13;
	};
</script>

<!-- <svelte:window on:resize={} /> -->

<main>
	<section>
		<h1>Zelda-Metroid Crossover Randomizer Tracker</h1>

		<p>This is a progress tracker for your play sessions of the NES Legend of Zelda and Metroid randomizers and vanilla games.</p>
			
		<p>While designed specifically for <a href="https://z1m1.info/">Zelda 1 / Metroid 1</a>, it will suffice in a pinch for other randomizers.</p>

		<p>Begin tracking by yourself with the start tracking solo button, or allow friends and coop players to help track with start tracking coop.</p>
	</section>
	
	<nav>
		<h2>Start here</h2>
		<a href="/solo">Start tracking solo</a>
		<a href="/coop/{generateCoopGuid()}">Start tracking coop</a>

		<h2>Previous sessions</h2>
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
							<a href="/solo/{item.key}" state={{ track: item.key }}>Resume solo</a>
							<a href="/coop/{generateCoopGuid()}" state={{ track: item.key }}>Resume coop</a>
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
	:global(body) {
		height: 100vh;
		background-color: #333;
	}

	main {
		margin: auto;
		width: 60rem;
		height: 100%;

		color: white;

		font-family: 'Baloo 2', cursive;
		font-weight: 400;
		font-size: 1.4rem;

		user-select: initial !important;
	}

	section {
		margin: 2rem 0;
	}

	section p {
		margin: 1rem 0;
	}

	:global(a) {
		color: cyan;
        text-decoration: none;
    }

	:global(a:visited) {
		color: cyan;
	}

	:global(a:hover) {
		color: white;
	}

	nav {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: space-between;
	}
</style>
