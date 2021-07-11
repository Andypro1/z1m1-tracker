<script context="module">
	export const ssr = false;
</script>

<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import '@fortawesome/fontawesome-free/css/all.css';
	import { tracker, trackerUpdated, actions, loadState, GlobalAction } from '../services/tracker.js';
	import Toolbars from "../components/Toolbars.svelte";
	import toolbars from '../components/toolbars.js';
	import Map from "../components/Map.svelte";

	// let tracker, trackerUpdated, actions, loadState, GlobalAction;
	let updateMapData;

	//  Route props
	export let coopGuid = '';
	export let storageKey = '';

	let activeHotkeySequence = '';
	let activeHotkeyAreaId = -1;

	const doLayout = (m) => {
		tracker.layout = m.name;

		styles['map-full-width'] = m.fullWidth;
		styles['map-full-height'] = m.fullHeight;
		styles['map-room-width'] = m.width;
		styles['map-room-height'] = m.height;
		styles['map-right-padding'] = m.rightPad;
		styles['map-bottom-padding'] = m.bottomPad;
	};

    //  Dynamic style vars
    let styles = {
      'shadow-color': 'rgb(128, 128, 128)'
    };

    $: cssVarStyles = Object.entries(styles)
		.map(([key, value]) => `--${key}:${value}`)
		.join(';');


	if(browser) {
		onMount(async () => {
			// alert(JSON.stringify(history.state));
			if(history.state.storageKey)
				storageKey = history.state.storageKey;

			updateMapData = (await import('../services/tracker.js')).updateMapData;

			//TODO: Not working.
			if(history.state.isNew) {
				const fresh = (await import('../services/tracker.js')).tracker;

				console.log(fresh.sessionTimestamp);

				tracker.sessionTimestamp = fresh.sessionTimestamp;
				tracker.curAreaMapIndex = fresh.curAreaMapIndex;
				tracker.layout = fresh.layout;
				tracker.actions = [...fresh.actions];
				tracker.areaMaps = [...fresh.areaMaps];

				return;
			}
			
			//  Load the tracking session if passed in
			if(history && history.state && history.state.track) {
				const state = await loadState(history.state.track);

				tracker.sessionTimestamp = state.sessionTimestamp;
				tracker.curAreaMapIndex = state.curAreaMapIndex;
				tracker.layout = state.layout;
				tracker.actions = [...state.actions];
				tracker.areaMaps = [...state.areaMaps];

				//  Also set stores used by components
				actions.set([...state.actions]);
			}

			if(storageKey) {
				const state = await loadState(storageKey);

				tracker.sessionTimestamp = state.sessionTimestamp;
				tracker.curAreaMapIndex = state.curAreaMapIndex;
				tracker.layout = state.layout;
				tracker.actions = [...state.actions];
				tracker.areaMaps = [...state.areaMaps];

				//  Also set stores used by components
				actions.set([...state.actions]);
			}
		});
	}

	const selectMap = (name) => {
		tracker.curAreaMapIndex = tracker.areaMaps.findIndex(e => e.name === name);
	};

	const getAreaCardHotkey = (name) => {
		const match = Object.values(GlobalAction).filter(ga => ga.name === name);
		
		if(match && match[0])
			return match[0].hotkeys[0];

		return '';
	};

	let mouseInMap = false;
	let [mouseX, mouseY] = [0, 0];

	const getAreaUnderCursor = (x, y) => {
		let elem = document.elementFromPoint(x, y);
		
		while(elem.parentElement && !elem.classList.contains('map-grid')) {
			if(elem.classList.contains('room') || elem.classList.contains('grid-region'))
				return elem.dataset.areaId;

			elem = elem.parentElement;
		}

		return -1;
	};


	const handleMouseMark = (areaId, cell, action, mouseX, mouseY, wasMarked) => {
		if(!wasMarked) {
			//  Affect the activeHotkey vars with mouse clicks for
			//  combined mouse-keyboard sequences
			const mouseMarkAreaId = getAreaUnderCursor(mouseX, mouseY);
			
			if(mouseMarkAreaId > -1) {
				activeHotkeySequence  = $toolbars.getAction(action).hotkeys[0];
				activeHotkeyAreaId    = mouseMarkAreaId;
			}
		}

		//  Force area stats reevaluation
		tracker.areaMaps = tracker.areaMaps;
	};


	const handleHotkey = (e, mouseInMap, mouseX, mouseY) => {
		e.preventDefault();
    	e.stopPropagation();

		//  Update sub-toolbar as needed
		if(['w', 'e', 'q'].includes(e.key)) {
			const subTb = e.key === 'w' ? 'warp' : (
				e.key === 'e' ? 'equip' : (
					e.key === 'q' ? 'quest' : ''
				)
			);

			if(subTb) {
				$toolbars.setSubToolbar(subTb);
				$toolbars = $toolbars;

				trackerUpdated();
			}
		}

		//  If inside of map, do:
		//	- build onto the active key combination
		//	- If the active key combination is valid for a matching Action, do the map action on the current tile/grid region.
		//	- If the active key combination is not a partial sequence, reset the active key combination
		if(mouseInMap) {
			//  First, find the current room and update activeHotkeySequence and activeHotkeyAreaId appropriately
			const curAreaId = getAreaUnderCursor(mouseX, mouseY);

			if(curAreaId === activeHotkeyAreaId) //hotkey sequence may continue
				activeHotkeySequence += e.key;
			else //changed rooms; start a new sequence
				activeHotkeySequence = e.key;

			activeHotkeyAreaId = curAreaId;

			const cutoverAreaIndex = tracker.areaMaps[tracker.curAreaMapIndex].map.rooms.length;
			const actions = $toolbars.allActions();
			const actionsArray = [...Object.keys(actions).map(k => actions[k])];
			const curKeySeq = activeHotkeySequence;
			let matchingActions = actionsArray.filter(a => a.hotkeys.includes(activeHotkeySequence));
			let partialSequences = actionsArray.filter(a => a.hotkeys.filter(h => (h.length > activeHotkeySequence.length) && h.startsWith(activeHotkeySequence)).length > 0);

			//  If not a valid sequence, reset to just the incoming key and check again
			if(matchingActions.length === 0) {
				activeHotkeySequence = e.key;
				matchingActions = actionsArray.filter(a => a.hotkeys.includes(activeHotkeySequence));
				partialSequences = actionsArray.filter(a => a.hotkeys.filter(h => (h.length > activeHotkeySequence.length) && h.startsWith(activeHotkeySequence)).length > 0);
			}

			if(matchingActions.length) {
				if(curAreaId !== -1) {
					updateMapData(curAreaId, true, matchingActions[0].name);
					tracker.areaMaps = tracker.areaMaps;
					return;
				}
			}
			else if(e.key === 'Escape') {
				//  Special case handling (ESC should unmark but doesn't have a corresponding toolbar action).
				//  If this needs to be expanded for multiple special cases I'll refactor
				if(curAreaId !== -1) {
					updateMapData(curAreaId, false, '');
					tracker.areaMaps = tracker.areaMaps;
					return;
				}
			}

			if(partialSequences.length === 0)
				activeHotkeySequence = '';
		}
		else { //outside of map
			//  - reset the active key combination
			activeHotkeySequence = '';
		}
			
		//  - Check for matching "outside map" keys (area cards, settings shortcuts (alt+h, alt+v, etc.)) and take action
		const globalAction = [...Object.keys(GlobalAction).map(k => GlobalAction[k])].filter(ga => ga.hotkeys.includes(e.key));
		
		if(globalAction && globalAction[0]) {
			//  TODO: Flesh out handling once non-area cards are added to global actions like tracker settings, etc.
			selectMap(globalAction[0].name);
			trackerUpdated();

			return;
		}
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
		<Toolbars set={tracker.areaMaps[tracker.curAreaMapIndex].map.class} />
		<div class="graph-paper map-options">
			<div class="map-option">
			  <label>
				<input type="checkbox" on:change={() => setTimeout(trackerUpdated, 0)}
					bind:checked={tracker.areaMaps[tracker.curAreaMapIndex].map.isHflipped} />
				Flip horizontally
			  </label>
			</div>
			<div class="map-option">
			  <label>
				<input type="checkbox" on:change={() => setTimeout(trackerUpdated, 0)}
					bind:checked={tracker.areaMaps[tracker.curAreaMapIndex].map.isVflipped} />
				Flip vertically
			  </label>
			</div>
		  </div>
	</section>
	<div class:bottom-cards-layout={tracker.layout === 'bottom'} class:side-cards-layout={tracker.layout === 'side'}>
		<section class="map-section">
			<Map layout={doLayout} trackerUpdated={trackerUpdated} handleHotkey={handleHotkey} handleMouseMark={handleMouseMark}
				data={tracker.areaMaps[tracker.curAreaMapIndex].map} actions={tracker.actions}/>
		</section>
		<section class="graph-paper area-cards">
			{#each tracker.areaMaps as area }
				<div class="area-card" on:click={() => { selectMap(area.name); trackerUpdated(); } }>
					<aside class="key-overlay" data-before={ getAreaCardHotkey(area.name) }></aside>
					<!-- { area.name } -->
					<aside>got: { area.stats.numEquipAcquired } { area.stats.numQuestAcquired }</aside>
					<aside>spots: { area.stats.markedEquipSpots }/{ area.stats.maxEquipSpots }
						{ area.stats.markedQuestSpots }/{ area.stats.maxQuestSpots }
						{ area.stats.markedUpgradeSpots }/{ area.stats.maxUpgradeSpots }</aside>
				</div>
				<!-- hyrule: { display: 'Hyrule', hotkeys: ['h'], name: 'Hyrule (Q1)' }, -->
			{/each}
		</section>
	</div>
</main>

<style global lang="scss">
	// * {
	// 	outline: 1px solid red;
	// }

	@import "../styles/overlays.scss";

	:global(body) {
		height: 100vh;
		background-color: #333;
	}

	main {
		height: 100vh;
		font-family: 'Baloo 2', cursive;
		font-weight: 400;

		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: space-between;
	}

	.top-bar {
		flex: 0 0 11.5rem;
		height: 11.5rem;
		max-height: 11.5rem;

		margin-top: 0.2rem;
		margin-left: 0.2rem;

		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: stretch;
	}

	.bottom-cards-layout {
		flex: 1 0 auto;

		display: flex;
		flex-direction: column;

		.area-cards {
			flex: 0 0 15rem;

			margin-top: auto;
			overflow: hidden;

			display: grid;
			grid-template-rows: repeat(2, 1fr);
			grid-template-columns: repeat(8, 1fr);
			gap: 0.3rem;

			.area-card {
				height: calc((15rem - 0.3rem) / 2);
			}
		}
	}

	.side-cards-layout {
		flex: 1 0 auto;

		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;

		.map-section {
			margin-left: auto;
		}

		.area-cards {
			flex: 0 0 15rem;
			height: 100%;

			padding-left: 0.5rem;
			margin-left: auto;
			overflow: hidden;

			display: grid;
			grid-template-rows: repeat(8, 1fr);
			grid-template-columns: 1fr 1fr;
			gap: 0.3rem;

			.area-card {
				//TODO: fix.  This only works when the map height takes up
				//  the full remaining height.  Most of the time, the overworld
				//  won't due to how vertically-challenged it is.
				height: calc(var(--map-full-height) / 8 * 1px - (0.3rem));
			}
		}
	}


	.graph-paper {
		background-color: #d9d3c5;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.54'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
	
		box-shadow: -10px 0 1rem 0 #000b,
					inset 0 0.5rem 1rem 0.3rem #0004;
	}

	.area-card {
		position: relative;
		overflow: hidden;

		border-radius: 0.5rem;
		
		background-image: url("/images/tb.action.equip.png");//, linear-gradient(rgba(185, 174, 110, 0.329),rgba(185, 174, 110, 0.329));
		background-image: url("/images/tb.action.equip.png"), linear-gradient(rgba(255, 254, 221, 0.9),rgba(255, 254, 221, 0.75));
		background-blend-mode: lighten;
		background-size: contain;
		
		cursor: pointer;
		padding: 1rem;

		.bottom-cards-layout .area-cards & {
			box-shadow: 0.2rem 0 0.2rem 0.2rem #0006;
		}

		.side-cards-layout .area-cards & {
			box-shadow: 0.2rem 0.2rem 0.2rem 0.2rem #0006;
		}
	}
</style>