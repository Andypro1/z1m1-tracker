<script>
	import { onMount } from 'svelte';
	import '@fortawesome/fontawesome-free/css/all.css';
	import { tracker, areaPairs, trackerUpdated, loadState, toolbars } from '../services/tracker.js';
	import Map from "../components/Map.svelte";

	//  Route props
	export let coopGuid = '';

	const doLayout = (m) => {
		tracker.layout = m.name;

		styles['map-room-width'] = m.width;
		styles['map-room-height'] = m.height;
		styles['map-padding'] = m.pad;
	};

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

	$: tbActionClass = (action) => {
		const keycaps = {
			0: 'LC',
			1: 'MC',
			2: 'RC',
			3: '<C',
			4: '>C'
		};

		const i = tracker.actions.findIndex(e => e === action);

		return {
			name: i >= 0 ? `button${i}` : '',
			keycap: keycaps[i]
		};
	};

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
		<div class="toolbars">
			{#each toolbars as tb, index (index)}
				<div class="toolbar">
					{#each tb.actions as action}
						<div class="action {tbActionClass(action).name}"
							on:mousedown={(e) => {
								e.preventDefault();
								e.stopPropagation();

								if(e.button >= 0) {
									tracker.actions = tracker.actions.map(a => a === action ? '' : a);
									tracker.actions[e.button] = action;

									trackerUpdated();
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