<script context="module">
	export const ssr = false;
</script>

<script>
	import { goto, invalidate, prefetch, prefetchRoutes } from '$app/navigation';
	import { onMount } from "svelte";
	import { browser } from '$app/env';
	import storage from "../services/storage";

	let storageSaves = [];

	const generateCoopGuid = () => {
		return 13;
	};

	const trash = (id) => {
		storage.deleteData(id);
		storageSaves = storage.listSaves();
	};

	if(browser) {
		onMount(async () => {
			storageSaves = storage.listSaves();
		});
	}

	const newCoop = () => {
		const r = Math.random().toString(36).substring(7);

		goto(`/coop/${r}`, { state: { coopGuid: r, isNew: true } });
	};

	const loadCoop = (id) => {
		const r = Math.random().toString(36).substring(7);

		goto(`/coop/${r}`, { state: { coopGuid: r, storageKey: id } });
	}
</script>

<!-- <svelte:window on:resize={} /> -->

<main>
	<section>
		<h1>Zelda-Metroid Crossover Randomizer Tracker</h1>

		<p>This is a progress tracker for your play sessions of the NES Legend of Zelda and Metroid randomizers and vanilla games.</p>
			
		<p>While designed specifically for <a href="https://z1m1.info/">Zelda 1 / Metroid 1</a>, it will suffice in a pinch for other randomizers.</p>
	</section>
	
	<nav>
		<h2>New session</h2>
		<div class="startnew">
			<a href="/solo" class="btn">
				<div>Start tracking solo</div>
				<div class="icon sprite-index36"></div>
			</a>
			<a on:click={() => newCoop()} class="btn">
				<div>Start tracking coop</div>
				<div class="bros">
					<div class="icon sprite-index37"></div>
					<div class="icon sprite-index38"></div>
				</div>
			</a>
		</div>

		<h2>Previous sessions</h2>
		<table class="prev-sessions">
			<thead>
				<th>Actions</th>
				<th>Label</th>
				<th>Date played</th>
			</thead>
			<tbody>
				{#each storageSaves as item }
					<tr>
						<td>
							<div class="actions">
								<a href="/solo/{item.key}">Resume solo <i class="fas fa-gavel"></i></a>
								<a on:click={() => loadCoop(item.key)}>Resume coop</a>
								<button on:click={() => trash(item.key)}>Trash</button>
							</div>
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
	:global(html) {
		user-select: initial !important;
	}
	
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
		font-size: 1.2rem;

		user-select: initial !important;
	}

	h1 {
		font-size: 2.2rem;
	}

	section {
		margin: 1rem 0;
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

	.prev-sessions {
		margin: 0.5rem 0;
	}

	nav {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: space-between;
	}

	nav .startnew {
		margin: 1rem;
		display: flex;
		justify-content: space-around;

		& .btn {
			width: 15rem;
			height: 8rem;

			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: center;

			background-color: black;
			border: 2px solid yellow;
			border-radius: 0.5rem;
			position: relative;
			
			&:hover {
				background-color: Gray;
			}
		}
	}

	.bros {
		width: 90%;
		margin: auto;

		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}

	tr {
		line-height: 2.5rem;
	}

	.actions {
		text-align: center;

		& a {
			margin: 0.5rem;
			padding: 0 0.8rem;

			background-color: black;
			border: 2px solid yellow;
			border-radius: 0.5rem;
			position: relative;
			
			&:hover {
				background-color: Gray;
			}
		}
	}

  //  Icon art for each sprite  \\
  .icon {
    width: 4rem;
    height: 4rem;

    top: 0; left: 0; right: 0; bottom: 0;
    margin: auto;

    background: url(/images/sprites-16px.png) no-repeat;
    background-size: auto 100%;
    image-rendering: crisp-edges;
    image-rendering: pixelated;

    //  Class rules for each sprite in sprites-16px.png
		@for $i from 0 through 39 {
			&.sprite-index#{$i} {
				background-position: calc(#{$i} * 100% / 61.5);
			}
		}
  }
</style>
