<script>
	import { onMount } from 'svelte';
	// import Hyruleq1 from './components/maps/Hyruleq1.svelte';
	// import Level1 from './components/maps/Level1.svelte';
	// import Level2 from './components/maps/Level2.svelte';
	// import Level3 from './components/maps/Level3.svelte';
	// import Level4 from './components/maps/Level4.svelte';
	// import Level5 from './components/maps/Level5.svelte';
	// import Level6 from './components/maps/Level6.svelte';
	// import Level7 from './components/maps/Level7.svelte';
	// import Level8 from './components/maps/Level8.svelte';
	// import Level9 from './components/maps/Level9.svelte';
	// import Kraids from './components/maps/Kraids.svelte';
	import '@fortawesome/fontawesome-free/css/all.css';

	import Map from "./components/Map.svelte";
	import Hyruleq1 from "./components/maps/Hyruleq1.mapdata.js";
	import Level1 from "./components/maps/Level1q1.mapdata.js";
	import Level2 from "./components/maps/Level2q1.mapdata.js";
	import Level3 from "./components/maps/Level3q1.mapdata.js";
	import Level4 from "./components/maps/Level4q1.mapdata.js";
	import Level5 from "./components/maps/Level5q1.mapdata.js";
	import Level6 from "./components/maps/Level6q1.mapdata.js";
	import Level7 from "./components/maps/Level7q1.mapdata.js";
	import Level8 from "./components/maps/Level8q1.mapdata.js";
	import Level9 from "./components/maps/Level9q1.mapdata.js";
	import Brinstar from "./components/maps/Brinstar.mapdata.js";
	import Norfair from "./components/maps/Norfair.mapdata.js";
	import Kraids from "./components/maps/Kraids.mapdata.js";
	import Ridleys from "./components/maps/Ridleys.mapdata.js";

	const areaMaps = [
		{ name: 'Hyrule (Q1)', map: Hyruleq1},
		{ name: 'Level 9 (Q1)', map: Level9},
		{ name: 'Shops', map: Level1},
		{ name: 'Potion shops', map: Level2},
		{ name: 'Level 1 (Q1)', map: Level1},
		{ name: 'Level 5 (Q1)', map: Level5},
		{ name: 'Level 2 (Q1)', map: Level2},
		{ name: 'Level 6 (Q1)', map: Level6},
		{ name: 'Level 3 (Q1)', map: Level3},
		{ name: 'Level 7 (Q1)', map: Level7},
		{ name: 'Level 4 (Q1)', map: Level4},
		{ name: 'Level 8 (Q1)', map: Level8},
		{ name: 'Kraid\'s', map: Kraids},
		{ name: 'Ridley\'s', map: Ridleys},
		{ name: 'Brinstar', map: Brinstar},
		{ name: 'Norfair', map: Norfair}
	];

	const areaPairs = areaMaps.reduce((a,v,i,o) => {
			if(i % 2 === 0)
				a.push(o.slice(i, i+2));
				return a;
		}, []);
	
	let curMap = areaMaps.filter(a => a.name === 'Hyrule (Q1)')[0].map;
	
	const toolbars = [
		{ name: 'dungeon', actions: ['cleared', 'warp', 'equip', 'quest'] },
		{ name: 'overworld', actions: ['cleared', 'warp', 'shop', 'potionShop', 'lockedSword', 'equip', 'quest'] }
	];

	const doLayout = (m) => {
		curMapLayout = m.name;

		styles['map-room-width'] = m.width;
		styles['map-room-height'] = m.height;
		styles['map-padding'] = m.pad;
	};

	let curToolbars = toolbars;//.filter(tb => tb.name === 'overworld');
	let curLCAction = 'cleared';
	let curRCAction = 'warp';
	let curMapLayout = 'bottom';
	let curMapFlipH = false;
	let curMapFlipV = false;

	let curMapComponent = Hyruleq1;
	$: curMapProps = { 
		data: curMap, action: curLCAction, action2: curRCAction,
		layout: doLayout, flipH: curMapFlipH, flipV: curMapFlipV
	};

    //  Dynamic style vars
    let styles = {
      'shadow-color': 'rgb(128, 128, 128)'
    };

    $: cssVarStyles = Object.entries(styles)
		.map(([key, value]) => `--${key}:${value}`)
		.join(';');

	onMount(() => {
    });

	const selectMap = (name) => {
		curMap = areaMaps.filter(a => a.name === name)[0].map;
		curMapProps = { 
			data: curMap, action: curLCAction, action2: curRCAction,
			layout: doLayout, flipH: curMapFlipH, flipV: curMapFlipV
		};
		curMapComponent = Map;
	};

	selectMap(areaMaps[0].name);
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
		<div class="toolbars">
			{#each curToolbars as tb,index (index)}
				<div class="toolbar">
					{#each tb.actions as action}
						<div class="action" class:lcselected={ curLCAction === action }
							class:rcselected={ curRCAction === action }
							on:click={() => { curLCAction = action; }}
							on:contextmenu={(e) => { curRCAction = action }}
						>{ action }</div>
					{/each}
				</div>
		 	 {/each}
		</div>
		<div class="map-options">
			<div class="map-option">
			  <label>
				<input type="checkbox" bind:checked={curMapFlipH} />
				Flip horizontally
			  </label>
			</div>
			<div class="map-option">
			  <label>
				<input type="checkbox" bind:checked={curMapFlipV} />
				Flip vertically
			  </label>
			</div>
		  </div>
	</section>
	<div class:bottom-cards-layout={curMapLayout === 'bottom'} class:side-cards-layout={curMapLayout === 'side'}>
		<section class="map-section">
			<!-- <Map data={curMap} action={curLCAction} action2={curRCAction} layout={doLayout}
				flipH={curMapFlipH} flipV={curMapFlipV} /> -->
				<svelte:component this={curMapComponent} {...curMapProps} />
		</section>
		<section class="area-cards">
			{#each areaPairs as area }
				<div class="area-card-column">
					<div class="area-card" on:click={() => { selectMap(area[0].name); } }>{ area[0].name }</div>
					<div class="area-card" on:click={() => { selectMap(area[1].name); } }>{ area[1].name }</div>
				</div>
			{/each}
		</section>
	</div>
</main>

<style global lang="scss">
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

	.toolbars {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-content: space-around;
	}

	.toolbar {
		flex: 1 0 auto;

		display: flex;
		align-content: center;
		align-items: center;

		margin: 0.2rem;
	}

	.toolbar .action {
		margin: 0.1rem;
		background-color: beige;
		padding: 0.8rem;
		width: 3.0rem;
		height: 3.0rem;
		border-radius: 0.4rem;
	}

	.action:hover {
		z-index: 10;
		cursor: pointer;

		filter: drop-shadow(10px 10px 10px var(--shadow-color));
		-webkit-animation: scale-up-center 0.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
		animation: scale-up-center 0.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
	}

	.action.lcselected {
		border: 1px dotted red;
	}

	.action.rcselected {
		border: 1px dotted blue;
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