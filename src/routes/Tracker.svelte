<script>
	import { onMount } from 'svelte';
	import '@fortawesome/fontawesome-free/css/all.css';
	import Map from "../components/Map.svelte";
    import storage from '../services/storage.js';

	import Hyruleq1 from "../components/maps/Hyruleq1.mapdata.js";
	import Level1 from "../components/maps/Level1q1.mapdata.js";
	import Level2 from "../components/maps/Level2q1.mapdata.js";
	import Level3 from "../components/maps/Level3q1.mapdata.js";
	import Level4 from "../components/maps/Level4q1.mapdata.js";
	import Level5 from "../components/maps/Level5q1.mapdata.js";
	import Level6 from "../components/maps/Level6q1.mapdata.js";
	import Level7 from "../components/maps/Level7q1.mapdata.js";
	import Level8 from "../components/maps/Level8q1.mapdata.js";
	import Level9 from "../components/maps/Level9q1.mapdata.js";
	import Brinstar from "../components/maps/Brinstar.mapdata.js";
	import Norfair from "../components/maps/Norfair.mapdata.js";
	import Kraids from "../components/maps/Kraids.mapdata.js";
	import Ridleys from "../components/maps/Ridleys.mapdata.js";

	//  Route props
	export let coopGuid = '';

	//  Global and session options
	let optNumMouseButtons = 5;
	let sessionTimestamp = + new Date();

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

	const mapUpdated = () => {
		const combinedData = {
			sessionTimestamp: sessionTimestamp,
			optNumMouseButtons: optNumMouseButtons,
			Hyruleq1,
			Level1,
			Level2, 
			Level3, 
			Level4, 
			Level5, 
			Level6, 
			Level7, 
			Level8, 
			Level9, 
			Brinstar, 
			Norfair, 
			Kraids, 
			Ridleys 
		};

		storage.saveData(combinedData);
		
		console.log(coopGuid);
	};

	let curToolbars = toolbars;//.filter(tb => tb.name === 'overworld');
	let curActions = [
			'cleared',
			'warp',
			'equip',
			'quest',
			'shop'
		];//.filter((a, i) => i < optNumMouseButtons);

	let curLCAction = 'cleared';
	let curRCAction = 'warp';
	let curMapLayout = 'bottom';
	let curMapComponent = Hyruleq1;

	$: curMapProps = { 
		data: curMap,
		actions: curActions,
		layout: doLayout,
		mapUpdated: mapUpdated,
		globalOptions: { optNumMouseButtons: optNumMouseButtons }
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

	$: tbActionClass = (action) => {
		const keycaps = {
			0: 'LC',
			1: 'MC',
			2: 'RC',
			3: '<C',
			4: '>C'
		};

		const i = curActions.findIndex(e => e === action);

		return {
			name: i >= 0 ? `button${i}` : '',
			keycap: keycaps[i]
		};
	};

	const selectMap = (name) => {
		curMap = areaMaps.filter(a => a.name === name)[0].map;
		curMapProps = { 
			data: curMap,
			actions: curActions,
			layout: doLayout,
			globalOptions: { optNumMouseButtons: optNumMouseButtons }
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
						<div class="action {tbActionClass(action).name}"
							on:mousedown={(e) => {
								e.preventDefault();
								e.stopPropagation();
								
								if(e.button >= 0 && e.button <= optNumMouseButtons) {
									curActions = curActions.map(a => a === action ? '' : a);
									curActions[e.button] = action;
								}
							}}
						>{ action }
						<aside class="key-overlay" class:hide-overlay={!tbActionClass(action).name} data-before={tbActionClass(action).keycap}></aside>
					</div>
					{/each}
				</div>
		 	 {/each}
		</div>
		<div class="map-options">
			<div class="map-option">
			  <label>
				<select bind:value={optNumMouseButtons}>
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
					<option value="4">4</option>
					<option value="5">5</option>
				</select>
				# of mouse buttons
			  </label>
			</div>
			<div class="map-option">
			  <label>
				<input type="checkbox" bind:checked={curMapProps.data.isHflipped} />
				Flip horizontally
			  </label>
			</div>
			<div class="map-option">
			  <label>
				<input type="checkbox" bind:checked={curMapProps.data.isVflipped} />
				Flip vertically
			  </label>
			</div>
		  </div>
	</section>
	<div class:bottom-cards-layout={curMapLayout === 'bottom'} class:side-cards-layout={curMapLayout === 'side'}>
		<section class="map-section">
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
		background-color: hsl(197, 38%, 76%);
		padding: 1rem;
		width: 8rem;
		height: 4.4rem;
		border-radius: 0.5rem;

		display: flex;
		justify-content: center;
		align-items: flex-end;
	}

	.action {
		position: relative;
		text-align: center;
		font-size: 1rem;
		font-weight: 600;
		overflow: hidden;
		

		&.button0:before,
		&.button1:before,
		&.button2:before,
		&.button3:before,
		&.button4:before {
			border: 1rem solid hsl(197, 38%, 30%);
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			padding: 0;
		}

		&:hover {
		z-index: 10;
		cursor: pointer;

		filter: drop-shadow(10px 10px 10px var(--shadow-color));
		-webkit-animation: scale-up-center 0.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
		animation: scale-up-center 0.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
	}

		&.button0 {
			//border: 1rem solid hsl(197, 38%, 30%);
			filter: drop-shadow(4px 4px 4px hsla(244, 100%, 30%, 50%));
		}

		&.button1 {
			border: 2px solid hsl(244, 100%, 30%);
			filter: drop-shadow(4px 4px 4px hsla(244, 100%, 30%, 50%));
		}

		&.button2 {
			border: 2px solid hsl(244, 100%, 30%);
			filter: drop-shadow(4px 4px 4px hsla(244, 100%, 30%, 50%));
		}

		&.button3 {
			border: 2px solid hsl(244, 100%, 30%);
			filter: drop-shadow(4px 4px 4px hsla(244, 100%, 30%, 50%));
		}

		&.button4 {
			border: 2px solid hsl(244, 100%, 30%);
			filter: drop-shadow(4px 4px 4px hsla(244, 100%, 30%, 50%));
		}
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


	//  Keyboard shortcut overlay styles
	.key-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100px;
		width: 1rem;
		height: 100px;
		height: 1rem;

		position: absolute;
		top: 0; left: 0;
		border-radius: 16px;
		border-radius: 0.16rem;
		border: 0px;
		font-size: 20px;
		font-size: 0.20rem;
		font-weight: bold;
		color: black;
		background: conic-gradient(white 0%, white 5%, silver 16%, white 23%, white 24%, silver 28%, gray 34%, #666 50%, gray 65%, white 75%) transparent;
		
		&.hide-overlay {
			display: none;
		}

		&:before {
			content: attr(data-before);
			position: absolute;
			display: block;
			top: 5px;
			top: 0.05rem;
			left: 10px;
			left: 0.10rem;
			width: 80px;
			width: 0.80rem;
			height: 80px;
			height: 0.80rem;
			border-radius: 16px;
			border-radius: 0.16rem;
			box-sizing: border-box;
			padding: 16px;
			padding: 0rem;
			font-size: 35px;
			font-size: 0.8rem;
			font-family: Arial;
			font-weight: normal;
			box-shadow: inset 0 0 13px #fff, 0 0 13px #fff,
						rgb(124, 124, 124) 0px 0px 43px inset;
			box-shadow: inset 0 0 0.13rem #fff, 0 0 0.13rem #fff,
						rgb(124, 124, 124) 0px 0px 0.43rem inset;
			background: linear-gradient(180deg, rgb(255, 255, 255) 16%, rgb(206, 206, 206) 92%, transparent 95%, rgb(206, 206, 206) 99%, rgb(206, 206, 206) 102%, rgb(206, 206, 206) 106%, rgb(206, 206, 206) 110%, rgb(206, 206, 206) 113%), linear-gradient(24.75deg, rgb(255, 255, 255) 33%, rgb(206, 206, 206) 37%, transparent 41%, rgb(206, 206, 206) 44%, rgb(206, 206, 206) 48%, rgb(206, 206, 206) 51%, rgb(206, 206, 206) 55%, rgb(206, 206, 206) 59%) transparent;
		}
	}
</style>