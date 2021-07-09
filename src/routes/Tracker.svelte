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

	//  Affect the activeHotkey vars with mouse clicks for
	//  combined mouse-keyboard sequences
	const handleMouseMark = (areaId, cell, action, mouseX, mouseY) => {
		const mouseMarkAreaId = getAreaUnderCursor(mouseX, mouseY);

		if(mouseMarkAreaId > -1) {
			activeHotkeySequence  = $toolbars.getAction(action).hotkeys[0];
			activeHotkeyAreaId    = mouseMarkAreaId;
		}
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
		<div class="map-options">
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
		<section class="area-cards">
			{#each tracker.areaMaps as area }
				<div class="area-card" on:click={() => { selectMap(area.name); trackerUpdated(); } }>
					<aside class="key-overlay" data-before={ getAreaCardHotkey(area.name) }></aside>
					{ area.name }
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
		height: 100%;
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
			flex: 1 0 15rem;

			display: grid;
			grid-template-rows: repeat(2, 1fr);
			grid-template-columns: repeat(8, 1fr);
		}
	}

	.side-cards-layout {
		flex: 1 0 auto;

		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;

		.area-cards {
			flex: 0 0 15rem;
			height: 100%;

			display: grid;
			grid-template-rows: repeat(8, 1fr);
			grid-template-columns: 1fr 1fr;
			gap: 0.3rem;
		}
	}

	.area-card {
		position: relative;

		width: 3rem;
		height: 3rem;
		background-color: #ddd;
		cursor: pointer;
		padding: 1rem;
	}
</style>