<script>
	import { onMount } from 'svelte';
	import '@fortawesome/fontawesome-free/css/all.css';
	import { tracker, areaPairs, trackerUpdated, setActions, loadState } from '../services/tracker.js';
	import Toolbars from "../components/Toolbars.svelte";
	import Map from "../components/Map.svelte";

	//  Route props
	export let coopGuid = '';

	const doLayout = (m) => {
		tracker.layout = m.name;

		styles['map-room-width'] = m.width;
		styles['map-room-height'] = m.height;
		styles['map-padding'] = m.pad;
	};

	// const setActions = (newActions) => {
	// 	tracker.actions = newActions;
	// };

    //  Dynamic style vars
    let styles = {
      'shadow-color': 'rgb(128, 128, 128)'
    };

    $: cssVarStyles = Object.entries(styles)
		.map(([key, value]) => `--${key}:${value}`)
		.join(';');

	onMount(async () => {
		//  Load the tracking session if passed in
		if(history && history.state && history.state.track) {
			const state = await loadState(history.state.track);

			tracker.sessionTimestamp = state.sessionTimestamp;
			tracker.curAreaMapIndex = state.curAreaMapIndex;
			tracker.layout = state.layout;
			tracker.actions = [...state.actions];
			tracker.areaMaps = [...state.areaMaps];
		}
    });

	const selectMap = (name) => {
		tracker.curAreaMapIndex = tracker.areaMaps.findIndex(e => e.name === name);
	};
</script>

<svelte:window on:contextmenu="{(e) => e.preventDefault()}" />

<svelte:head>
	<!--  This isn't working.  -->
	<link rel="prefetch" href="/images/hyrule-q1-halfscale.png">
	<link rel="prefetch" href="/images/dungeons-halfscale.png">
	<link rel="prefetch" href="/images/zebes-quarterscale.png">
	<link rel="prefetch" href="/images/loz-npcs.png">
</svelte:head>

<main style="{cssVarStyles}">
	<section class="top-bar">
		<Toolbars actions={tracker.actions} set={tracker.areaMaps[tracker.curAreaMapIndex].map.class}
			trackerUpdated={trackerUpdated} setActions={setActions} />
		<div class="map-options">
			<div class="map-option">
			  <label>
				<input type="checkbox" on:click={() => trackerUpdated()}
					bind:checked={tracker.areaMaps[tracker.curAreaMapIndex].map.isHflipped} />
				Flip horizontally
			  </label>
			</div>
			<div class="map-option">
			  <label>
				<input type="checkbox" on:click={() => trackerUpdated()}
					bind:checked={tracker.areaMaps[tracker.curAreaMapIndex].map.isVflipped} />
				Flip vertically
			  </label>
			</div>
		  </div>
	</section>
	<div class:bottom-cards-layout={tracker.layout === 'bottom'} class:side-cards-layout={tracker.layout === 'side'}>
		<section class="map-section">
			<Map layout={doLayout} trackerUpdated={trackerUpdated} data={tracker.areaMaps[tracker.curAreaMapIndex].map} actions={tracker.actions}/>
		</section>
		<section class="area-cards">
			{#each areaPairs as area }
				<div class="area-card-column">
					<div class="area-card" on:click={() => { selectMap(area[0].name); trackerUpdated(); } }>{ area[0].name }</div>
					<div class="area-card" on:click={() => { selectMap(area[1].name); trackerUpdated(); } }>{ area[1].name }</div>
				</div>
			{/each}
		</section>
	</div>
</main>

<style global lang="scss">
	@import "../styles/overlays.scss";

	:global(body) {
		height: 100vh;
	}

	main {
		height: 100%;
		font-family: 'Baloo 2', cursive;
		font-weight: 400;

		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: space-between;
	}

	.top-bar {
		flex: 0 0 10rem;

		display: flex;
		justify-content: space-between;
		align-items: stretch;
	}

	.bottom-cards-layout {
		flex: 1 0 auto;

		display: flex;
		flex-direction: column;

		.area-cards {
			flex: 0 0 15rem;

			display: flex;
			flex-wrap: wrap;
			flex-direction: row;
			justify-content: space-between;
			align-items: auto;
			align-content: stretch;

			font-weight: 400;
		}

		.map-section {
			flex: 1 0 auto;

			padding-bottom: calc(1px * var(--map-padding));
		}
	}

	.side-cards-layout {
		flex: 1 0 auto;

		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;

		.area-cards {
			flex: 0 0 15rem;
			height: 100%;

			display: flex;
			flex-wrap: wrap;
			flex-direction: row;
			justify-content: space-between;
			align-content: stretch;

			font-weight: 400;
		}

		.area-card-column {
			flex: 1 0 1rem;
			margin: 1px;

			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: stretch;
		}

		.map-section {
			flex: 1 0 auto;

			padding-right: calc(1px * var(--map-padding));
		}
	}

	.area-card-column {
		flex: 1 0 1rem;
		margin: 1px;

		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-content: stretch;
	}

	.area-card {
		flex: 1 0 auto;

		background-color: #ddd;
		cursor: pointer;
		padding: 1rem;
	}
</style>