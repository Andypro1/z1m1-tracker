<script context="module">
	export const ssr = false;
</script>

<script>
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/env';
	import { page } from "$app/stores";
	import '@fortawesome/fontawesome-free/css/all.css';
	import { tracker, trackerUpdated, loadRawData, getRawData, updateMapStats,
		updateMapMetadata, hydrateAllToolbarMetadata, getCell, actions, loadState, GlobalAction } from '../services/tracker.js';
	import Toolbars from "../components/Toolbars.svelte";
	import toolbars from '../components/toolbars.js';
	import coopClient from '../services/coop-client.js';
	import Map from "../components/Map.svelte";

	let { coopGuid } = $page.params;

	// let tracker, trackerUpdated, actions, loadState, GlobalAction;
	let updateMapData;

	//  Route props
	export let storageKey = '';

	//  My props
	let activeHotkeySequence = '';
	let activeHotkeyAreaId = -1;
	$: layout = 'bottom';


	const doLayout = (m) => {
		layout = m.name;

		styles['map-full-width'] = m.fullWidth;
		styles['map-full-height'] = m.fullHeight;
		styles['map-room-width'] = m.width;
		styles['map-room-height'] = m.height;
		styles['map-right-padding'] = m.rightPad;
		styles['map-bottom-padding'] = m.bottomPad;
	};


	const loadAllData = async (data) => {
		console.log(`loadAllData(): len(${data.length})`);

		const state = await loadRawData(data);

		console.log(`processed data len: ${JSON.stringify(state).length}`);

		//  Only update areaMaps.  Thus far, all other properties
		//  are ones that shouldn't be shared between coop partners
		tracker.areaMaps = [...state.areaMaps];

		await hydrateAllToolbarMetadata();
	};


	const dataFromPartner = async (areaId, marked, actionName, areaMapIndex, excludeResend) => {
		const areaMapIndexnum = +areaMapIndex;
		const areaIdnum = +areaId;
		const isMarked = (marked === 'true');

		await updateMapData(areaIdnum, isMarked, actionName, areaMapIndexnum, excludeResend);

		tracker.areaMaps = tracker.areaMaps;
	};


	const metadataFromPartner = async (areaMapIndex, propName, propValue, excludeResend) => {
		const areaMapIndexnum = +areaMapIndex;
		const propValueBool   = (propValue === 'true');

		await updateMapMetadata(areaMapIndexnum, propName, propValueBool, excludeResend);

		tracker.areaMaps = tracker.areaMaps;
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
			if(history && history.state && history.state.storageKey)
				storageKey = history.state.storageKey;

			updateMapData = (await import('../services/tracker.js')).updateMapData;

			if(storageKey) {
				const state = await loadState(storageKey);

				tracker.sessionTimestamp = state.sessionTimestamp;
				tracker.curAreaMapIndex = state.curAreaMapIndex;
				// tracker.layout = state.layout;
				tracker.actions = [...state.actions];
				tracker.areaMaps = [...state.areaMaps];

				//  Also set stores used by components
				actions.set([...state.actions]);

				await hydrateAllToolbarMetadata();
			}
			else {
				// TODO: Find a better way to create a fresh copy of the tracker data.
				// Ensure initialization routines that are typically run get run here.
				// TODO2:  This is STILL not working.  Repro:
				//			- Start tracking coop
				//			- mark some rooms
				//			- back button
				//			- Start tracking solo (or coop).  Stale data loads from .mapdata.js imports.
				const Hyruleq1 = (await import("../components/maps/Hyruleq1.mapdata.js")).default;
				const ShopsAndStats = (await import("../components/maps/ShopsAndStats.mapdata.js")).default;
				const Level1 = (await import("../components/maps/Level1q1.mapdata.js")).default;
				const Level2 = (await import("../components/maps/Level2q1.mapdata.js")).default;
				const Level3 = (await import("../components/maps/Level3q1.mapdata.js")).default;
				const Level4 = (await import("../components/maps/Level4q1.mapdata.js")).default;
				const Level5 = (await import("../components/maps/Level5q1.mapdata.js")).default;
				const Level6 = (await import("../components/maps/Level6q1.mapdata.js")).default;
				const Level7 = (await import("../components/maps/Level7q1.mapdata.js")).default;
				const Level8 = (await import("../components/maps/Level8q1.mapdata.js")).default;
				const Level9 = (await import("../components/maps/Level9q1.mapdata.js")).default;
				const Brinstar = (await import("../components/maps/Brinstar.mapdata.js")).default;
				const Norfair = (await import("../components/maps/Norfair.mapdata.js")).default;
				const Kraids = (await import("../components/maps/Kraids.mapdata.js")).default;
				const Ridleys = (await import("../components/maps/Ridleys.mapdata.js")).default;
				const mapStats = (await import ('../components/areaStatistics.js')).default;

				tracker.sessionTimestamp = +new Date();

				console.log(tracker.sessionTimestamp);

				tracker.curAreaMapIndex = 0;
				tracker.actions = [
						'cleared',
						'warp',
						'equip',
						'quest'
					];
				tracker.areaMaps = [
					{ name: 'Hyrule (Q1)', map: Hyruleq1.data, stats: mapStats},
					{ name: 'Shops & stats', map: ShopsAndStats.data, stats: mapStats},
					{ name: 'Level 1 (Q1)', map: Level1.data, stats: mapStats},
					{ name: 'Level 2 (Q1)', map: Level2.data, stats: mapStats},
					{ name: 'Level 3 (Q1)', map: Level3.data, stats: mapStats},
					{ name: 'Level 4 (Q1)', map: Level4.data, stats: mapStats},
					{ name: 'Level 5 (Q1)', map: Level5.data, stats: mapStats},
					{ name: 'Level 6 (Q1)', map: Level6.data, stats: mapStats},
					{ name: 'Level 7 (Q1)', map: Level7.data, stats: mapStats},
					{ name: 'Level 8 (Q1)', map: Level8.data, stats: mapStats},
					{ name: 'Level 9 (Q1)', map: Level9.data, stats: mapStats},
					{ name: 'Brinstar', map: Brinstar.data, stats: mapStats},
					{ name: 'Norfair', map: Norfair.data, stats: mapStats},
					{ name: 'Kraid\'s', map: Kraids.data, stats: mapStats},
					{ name: 'Ridley\'s', map: Ridleys.data, stats: mapStats}
				];

				//  Also set stores used by components
				actions.set([
					'cleared',
					'warp',
					'equip',
					'quest'
				]);

				//  Hydrate all area map statistics
				tracker.areaMaps.map((a, i) => updateMapStats(i));
			}

			//  Need to wait to initialize coop to ensure we have a valid storage key (sessionTimestamp)
			if(coopGuid) {
				var res = await $coopClient.enable(coopGuid, tracker.sessionTimestamp, loadAllData, getRawData, dataFromPartner, metadataFromPartner);

				console.log(res);
			}
			else {
				var res = await $coopClient.disable();
			}
		});


		onDestroy(async () => {
			$coopClient.disable();
		});
	}

	const selectMap = (name) => {
		tracker.curAreaMapIndex = tracker.areaMaps.findIndex(e => e.name === name);

		if(tracker.areaMaps.findIndex(e => e.name === name).length < 1)
			console.error(`No area map was found with name ${name}.  Logic bug.`);
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

		//  Force toolbars reevaluation
		$toolbars = $toolbars;
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
				if((curAreaId !== -1) && (getCell(curAreaId).active !== false)) {
					updateMapData(curAreaId, true, matchingActions[0].name);
					tracker.areaMaps = tracker.areaMaps;
					$toolbars = $toolbars;
					return;
				}
			}
			else if(e.key === 'Escape') {
				//  Special case handling (ESC should unmark but doesn't have a corresponding toolbar action).
				//  If this needs to be expanded for multiple special cases I'll refactor
				if(curAreaId !== -1) {
					updateMapData(curAreaId, false, '');
					tracker.areaMaps = tracker.areaMaps;
					$toolbars = $toolbars;
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

<main style="{cssVarStyles}">
	<section class="top-bar">
		<Toolbars set={tracker.areaMaps[tracker.curAreaMapIndex].map.class} />
		<div class="graph-paper map-options">
			<div class="map-option">
			  <label>
				<input type="checkbox" on:change={() => setTimeout(async () =>
					await updateMapMetadata(tracker.curAreaMapIndex, 'isHflipped', tracker.areaMaps[tracker.curAreaMapIndex].map.isHflipped), 0)}
					bind:checked={tracker.areaMaps[tracker.curAreaMapIndex].map.isHflipped} />
				Flip horizontally
			  </label>
			</div>
			<div class="map-option">
			  <label>
				<input type="checkbox" on:change={() => setTimeout(async () =>
					await updateMapMetadata(tracker.curAreaMapIndex, 'isVflipped', tracker.areaMaps[tracker.curAreaMapIndex].map.isVflipped), 0)}
					bind:checked={tracker.areaMaps[tracker.curAreaMapIndex].map.isVflipped} />
				Flip vertically
			  </label>
			</div>
		  </div>
	</section>
	<div class:bottom-cards-layout={layout === 'bottom'} class:side-cards-layout={layout === 'side'}>
		<section class="map-section">
			<Map layout={doLayout} trackerUpdated={trackerUpdated} handleHotkey={handleHotkey} handleMouseMark={handleMouseMark}
				data={tracker.areaMaps[tracker.curAreaMapIndex].map} actions={tracker.actions}/>
		</section>
		<section class="graph-paper area-cards">
			{#each tracker.areaMaps as area }
				<div class="area-card" on:click={() => { selectMap(area.name); trackerUpdated(); } }>
					<aside class="key-overlay" data-before={ getAreaCardHotkey(area.name) }></aside>
					<div class="name">{ area.name }</div>
					<div class="stat-bars">
						<div class="equip-acquired" class:overmarked={area.stats.numEquipAcquired > area.stats.maxEquipInArea}>
							{#if area.stats.maxEquipInArea > 0}
								<div class:full={area.stats.numEquipAcquired > 0}></div>
							{/if}
							{#if area.stats.maxEquipInArea > 1}
								<div class:full={area.stats.numEquipAcquired > 1}></div>
							{/if}
							{#if area.stats.maxEquipInArea > 2}
								<div class:full={area.stats.numEquipAcquired > 2}></div>
							{/if}
							{#if area.stats.maxEquipInArea > 3}
								<div class:full={area.stats.numEquipAcquired > 3}></div>
							{/if}
						</div>
						<div class="quest-acquired" class:overmarked={area.stats.numQuestAcquired > area.stats.maxQuestInArea}>
							{#if area.stats.maxQuestInArea > 0}
								<div class:full={area.stats.numQuestAcquired > 0}></div>
							{/if}
							{#if area.stats.maxQuestInArea > 1}
								<div class:full={area.stats.numQuestAcquired > 1}></div>
							{/if}
						</div>
						<div class="equip-spots" class:empty={area.stats.maxEquipSpots === 0}>
							{#if area.stats.maxEquipSpots > 0}
								<div class:full={area.stats.markedEquipSpots > 0}></div>
							{/if}
							{#if area.stats.maxEquipSpots > 1}
								<div class:full={area.stats.markedEquipSpots > 1}></div>
							{/if}
							{#if area.stats.maxEquipSpots > 2}
								<div class:full={area.stats.markedEquipSpots > 2}></div>
							{/if}
							{#if area.stats.maxEquipSpots > 3}
								<div class:full={area.stats.markedEquipSpots > 3}></div>
							{/if}
							{#if area.stats.maxEquipSpots > 4}
								<div class:full={area.stats.markedEquipSpots > 4}></div>
							{/if}
							{#if area.stats.maxEquipSpots > 5}
								<div class:full={area.stats.markedEquipSpots > 5}></div>
							{/if}
							{#if area.stats.maxEquipSpots > 6}
								<div class:full={area.stats.markedEquipSpots > 6}></div>
							{/if}
							{#if area.stats.maxEquipSpots > 7}
								<div class:full={area.stats.markedEquipSpots > 7}></div>
							{/if}
							{#if area.stats.maxEquipSpots > 8}
								<div class:full={area.stats.markedEquipSpots > 8}></div>
							{/if}
							{#if area.stats.maxEquipSpots > 9}
								<div class:full={area.stats.markedEquipSpots > 9}></div>
							{/if}
						</div>
						<div class="quest-spots" class:empty={area.stats.maxQuestSpots === 0}>
							{#if area.stats.maxQuestSpots > 0}
								<div class:full={area.stats.markedQuestSpots > 0}></div>
							{/if}
							{#if area.stats.maxQuestSpots > 1}
								<div class:full={area.stats.markedQuestSpots > 1}></div>
							{/if}
							{#if area.stats.maxQuestSpots > 2}
								<div class:full={area.stats.markedQuestSpots > 2}></div>
							{/if}
							{#if area.stats.maxQuestSpots > 3}
								<div class:full={area.stats.markedQuestSpots > 3}></div>
							{/if}
							{#if area.stats.maxQuestSpots > 4}
								<div class:full={area.stats.markedQuestSpots > 4}></div>
							{/if}
							{#if area.stats.maxQuestSpots > 5}
								<div class:full={area.stats.markedQuestSpots > 5}></div>
							{/if}
							{#if area.stats.maxQuestSpots > 6}
								<div class:full={area.stats.markedQuestSpots > 6}></div>
							{/if}
							{#if area.stats.maxQuestSpots > 7}
								<div class:full={area.stats.markedQuestSpots > 7}></div>
							{/if}
							{#if area.stats.maxQuestSpots > 8}
								<div class:full={area.stats.markedQuestSpots > 8}></div>
							{/if}
							{#if area.stats.maxQuestSpots > 9}
								<div class:full={area.stats.markedQuestSpots > 9}></div>
							{/if}
						</div>
						<div class="upgrade-spots" class:empty={area.stats.maxUpgradeSpots === 0}>
							{#if area.stats.maxUpgradeSpots > 0}
								<div class:full={area.stats.markedUpgradeSpots > 0}></div>
							{/if}
							{#if area.stats.maxUpgradeSpots > 1}
								<div class:full={area.stats.markedUpgradeSpots > 1}></div>
							{/if}
							{#if area.stats.maxUpgradeSpots > 2}
								<div class:full={area.stats.markedUpgradeSpots > 2}></div>
							{/if}
							{#if area.stats.maxUpgradeSpots > 3}
								<div class:full={area.stats.markedUpgradeSpots > 3}></div>
							{/if}
							{#if area.stats.maxUpgradeSpots > 4}
								<div class:full={area.stats.markedUpgradeSpots > 4}></div>
							{/if}
							{#if area.stats.maxUpgradeSpots > 5}
								<div class:full={area.stats.markedUpgradeSpots > 5}></div>
							{/if}
							{#if area.stats.maxUpgradeSpots > 6}
								<div class:full={area.stats.markedUpgradeSpots > 6}></div>
							{/if}
							{#if area.stats.maxUpgradeSpots > 7}
								<div class:full={area.stats.markedUpgradeSpots > 7}></div>
							{/if}
							{#if area.stats.maxUpgradeSpots > 8}
								<div class:full={area.stats.markedUpgradeSpots > 8}></div>
							{/if}
							{#if area.stats.maxUpgradeSpots > 9}
								<div class:full={area.stats.markedUpgradeSpots > 9}></div>
							{/if}
							{#if area.stats.maxUpgradeSpots > 10}
								<div class:full={area.stats.markedUpgradeSpots > 10}></div>
							{/if}
							{#if area.stats.maxUpgradeSpots > 11}
								<div class:full={area.stats.markedUpgradeSpots > 11}></div>
							{/if}
						</div>
					</div>
				</div>
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

	//  CSS preloading of all tracker image assets
	:global(body::after) {
		position:absolute; width:0; height:0; overflow:hidden; z-index:-1; // hide images
		content:  // load images
			url(/images/hyrule-q1-halfscale.png)
			url(/images/zebes-quarterscale.png)
			url(/images/dungeons-halfscale.png)
			url(/images/sprites-16px.png)
			url(/images/sprites-warp.png)
			url(/images/sparkle.png)
			url(/images/tb.action.quest.png)
			url(/images/tb.action.equip.png)
			url(/images/tb.action.warp.png)
			url(/images/zelda-text.png);
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
				height: 100%;
			}
		}
	}


	.graph-paper {
		background-color: #d9d3c5;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.3'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");

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

		.name {
			position: absolute;
			right: 0; top: 0;
			margin: 0 0.4rem;

			text-align: center;
			font-variant: small-caps;
			font-weight: bold;
		}
	}

	/***************************
	**  Area card stats bars  **
	***************************/

	.stat-bars {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;

		position: absolute;
		bottom: 0; left: 0;
		width: 100%;
		height: calc(100% - 1rem);

		.empty {
			display: none !important;
		}

		.equip-acquired {
			width: 70%;
			margin-top: 0.3rem;
			height: 5px;
			position: relative;

			display: flex;
			flex-direction: row;
			justify-content: stretch;
			align-items: center;

			div {
				height: 5px;
				flex: 1;

				box-shadow: 1px 0 0 0 black;
				border-bottom: 1px dashed gray;

				background: linear-gradient(to left, transparent 50%, #00ff 50%) right;
				background-size: 200% 100%;
				background-position: right bottom;
				transition: all 0.4s ease;
			}

			&.overmarked {
				&:after {
					position: absolute;
					top: -1rem; right: -0.8rem;
					content: '*';

					color: red;
					font-weight: bold;
					font-size: 2rem;
				}
			}

			& .full {
				box-shadow: none;
				border-bottom: none;
				background-position: left bottom;
				transition: all 0.4s ease;
			}

			&:before {
				content: 'E';
				font-weight: bold;
				font-size: 0.7rem;
				position: absolute;
				top: -0.5rem; left: -0.5rem;
			}
		}

		.quest-acquired {
			margin-bottom: auto;

			width: 70%;
			margin-top: 0.3rem;
			height: 5px;
			position: relative;

			display: flex;
			flex-direction: row;
			justify-content: stretch;
			align-items: center;

			div {
				height: 5px;
				flex: 1;

				box-shadow: 1px 0 0 0 black;
				border-bottom: 1px dashed gray;

				background: linear-gradient(to left, transparent 50%, #f00f 50%) right;
				background-size: 200% 100%;
				background-position: right bottom;
				transition: all 0.4s ease;
			}

			&.overmarked {
				&:after {
					position: absolute;
					top: -1rem; right: -0.8rem;
					content: '*';

					color: red;
					font-weight: bold;
					font-size: 2rem;
				}
			}

			& .full {
				box-shadow: none;
				border-bottom: none;
				background-position: left bottom;
				transition: all 0.4s ease;
			}

			&:before {
				content: 'Q';
				font-weight: bold;
				font-size: 0.7rem;
				position: absolute;
				top: -0.5rem; left: -0.5rem;
			}
		}

		.equip-spots {
			width: 70%;
			margin-top: 0.3rem;
			height: 5px;
			position: relative;

			display: flex;
			flex-direction: row;
			justify-content: stretch;
			align-items: center;

			div {
				height: 5px;
				flex: 1;

				box-shadow: 1px 0 0 0 black;
				border-bottom: 1px dashed gray;

				background: linear-gradient(to left, transparent 50%, #00ff 50%) right;
				background-size: 200% 100%;
				background-position: right bottom;
				transition: all 0.4s ease;
			}

			& .full {
				box-shadow: none;
				border-bottom: none;
				background-position: left bottom;
				transition: all 0.4s ease;
			}

			&:before {
				content: 'E';
				font-weight: bold;
				font-size: 0.7rem;
				position: absolute;
				top: -0.5rem; left: -0.5rem;
			}
		}

		.quest-spots {
			width: 70%;
			margin-top: 0.3rem;
			height: 5px;
			position: relative;

			display: flex;
			flex-direction: row;
			justify-content: stretch;
			align-items: center;

			div {
				height: 5px;
				flex: 1;

				box-shadow: 1px 0 0 0 black;
				border-bottom: 1px dashed gray;

				background: linear-gradient(to left, transparent 50%, #f00f 50%) right;
				background-size: 200% 100%;
				background-position: right bottom;
				transition: all 0.4s ease;
			}

			& .full {
				box-shadow: none;
				border-bottom: none;
				background-position: left bottom;
				transition: all 0.4s ease;
			}

			&:before {
				content: 'Q';
				font-weight: bold;
				font-size: 0.7rem;
				position: absolute;
				top: -0.5rem; left: -0.5rem;
			}
		}

		.upgrade-spots {
			width: 70%;
			margin-top: 0.3rem;
			height: 5px;
			position: relative;

			display: flex;
			flex-direction: row;
			justify-content: stretch;
			align-items: center;

			div {
				height: 5px;
				flex: 1;

				box-shadow: 1px 0 0 0 black;
				border-bottom: 1px dashed gray;

				background: linear-gradient(to left, transparent 50%, rgb(0, 190, 0) 50%) right;
				background-size: 200% 100%;
				background-position: right bottom;
				transition: all 0.4s ease;
			}

			& .full {
				box-shadow: none;
				border-bottom: none;
				background-position: left bottom;
				transition: all 0.4s ease;
			}

			&:before {
				content: 'U';
				font-weight: bold;
				font-size: 0.7rem;
				position: absolute;
				top: -0.5rem; left: -0.5rem;
			}
		}
	}
</style>