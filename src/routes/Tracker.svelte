<script>
	import { onMount } from 'svelte';
	import '@fortawesome/fontawesome-free/css/all.css';
	import { tracker, areaPairs, trackerUpdated, actions, loadState } from '../services/tracker.js';
	import Toolbars from "../components/Toolbars.svelte";
	import toolbars from '../components/toolbars.js';
	import Map from "../components/Map.svelte";

	//  Route props
	export let coopGuid = '';

	let activeHotkeySequence = '';
	let activeHotkeyRoomIndex = -1;

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

			//  Also set stores used by components
			actions.set([...state.actions]);
		}
    });

	const selectMap = (name) => {
		tracker.curAreaMapIndex = tracker.areaMaps.findIndex(e => e.name === name);
	};

	let mouseInMap = false;
	let [mouseX, mouseY] = [0, 0];

	const getRoomIndexUnderCursor = (x, y) => {
		let elem = document.elementFromPoint(x, y);

		while(elem.parentElement && !elem.classList.contains('map-grid')) {
			if(elem.classList.contains('room'))
				return elem.dataset.roomIndex;

			elem = elem.parentElement;
		}

		return -1;
	};


	const handleMouseMark = (roomIndex, cell, action, mouseX, mouseY) => {
		const isToolbarAction = $toolbars.isAToolbarAction(action);

		if(isToolbarAction) {
			activeHotkeySequence  = $toolbars.getAction(action).hotkeys[0];
			activeHotkeyRoomIndex = getRoomIndexUnderCursor(mouseX, mouseY);
		}
	}


	const handleHotkey = (e, mouseInMap, mouseX, mouseY) => {
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
			//  First, find the current room and update activeHotkeySequence nad activeHotkeyRoomIndex appropriately
			const curRoomIndex = getRoomIndexUnderCursor(mouseX, mouseY);

			if(curRoomIndex === activeHotkeyRoomIndex) //hotkey sequence may continue
				activeHotkeySequence += e.key;
			else //changed rooms; start a new sequence
				activeHotkeySequence = e.key;

			activeHotkeyRoomIndex = curRoomIndex;

			//console.log(`prev room: ${activeHotkeyRoomIndex}.  cur room: ${curRoomIndex}.  active seq.: ${activeHotkeySequence}`);

			const actions = $toolbars.allActions();
			const actionsArray = [...Object.keys(actions).map(k => actions[k])];
			const curKeySeq = activeHotkeySequence;
			let matchingActions = actionsArray.filter(a => a.hotkeys.includes(activeHotkeySequence));
			let partialSequences = actionsArray.filter(a => a.hotkeys.filter(h => (h.length > activeHotkeySequence.length) && h.startsWith(activeHotkeySequence)).length > 0);

			//TODO: fix algorithm for handling key sequences in the proper order

			//  If not a valid sequence, reset to just the incoming key and check again
			if(matchingActions.length === 0) {
				activeHotkeySequence = e.key;
				matchingActions = actionsArray.filter(a => a.hotkeys.includes(activeHotkeySequence));
				partialSequences = actionsArray.filter(a => a.hotkeys.filter(h => (h.length > activeHotkeySequence.length) && h.startsWith(activeHotkeySequence)).length > 0);
			}

			if(matchingActions.length) {
				if(curRoomIndex !== -1) {
					const curRoom = tracker.areaMaps[tracker.curAreaMapIndex].map.rooms[curRoomIndex];
	
					if(curRoom.active && !curRoom.outofbounds) {
						tracker.areaMaps[tracker.curAreaMapIndex].map.rooms[curRoomIndex].marked = true;
						tracker.areaMaps[tracker.curAreaMapIndex].map.rooms[curRoomIndex].action = matchingActions[0].name;

						trackerUpdated();
					}
				}
			}

			if(partialSequences.length === 0)
				activeHotkeySequence = '';
		}

		//  If outside of map, do:
		//  - reset the active key combination
		//  - Check for matching "outside map" keys (area cards, settings shortcuts (alt+h, alt+v, etc.)) and take action
		//  Don't forget ESC to clear current tile
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
			<Map layout={doLayout} trackerUpdated={trackerUpdated} handleHotkey={handleHotkey} handleMouseMark={handleMouseMark}
				data={tracker.areaMaps[tracker.curAreaMapIndex].map} actions={tracker.actions}/>
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