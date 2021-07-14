import { writable, get } from 'svelte/store';
import storage from '../services/storage.js';
import toolbars from '../components/toolbars.js';
import coopClient from '../services/coop-client.js';
import mapStats from '../components/areaStatistics.js';

import Hyruleq1 from "../components/maps/Hyruleq1.mapdata.js";
import ShopsAndStats from "../components/maps/ShopsAndStats.mapdata.js";
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


//  Must contain only JSON-serializable data (no functions, dates, js constants, etc.)
function trackerFactory() {
	const _trackData = {
		sessionTimestamp: +new Date(),
		curAreaMapIndex: 0,
		actions: [
			'cleared',
			'warp',
			'equip',
			'quest'
		],
		areaMaps: [
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
		]
	};

	const updateMapStats = (areaMapIndex) => {
		const area = _trackData.areaMaps[areaMapIndex].map;
		const cells = area.gridRegions ? area.rooms.concat(area.gridRegions) : area.rooms;
	
		const maxEquipSpots = cells.filter(c => c.premark === 'E').length;
		const maxQuestSpots = cells.filter(c => c.premark === 'Q').length;
		const maxUpgradeSpots = cells.filter(c => c.premark === 'U').length;
		const maxMinorSpots = cells.filter(c => c.premark === 'M').length;
	
		const totalValidCells = cells.filter(c => (c.active !== 'false') && !c.outofbounds).length;
	
		//  TODO: distinguish between marked and non-acquired gear so that users
		//  can see how much has been accounted for, even if not picked up (low priority)
		const markedEquipSpots = cells.filter(c => c.premark === 'E' && c.marked && !c.notAcquired).length;
		const markedQuestSpots = cells.filter(c => c.premark === 'Q' && c.marked && !c.notAcquired).length;
		const markedUpgradeSpots = cells.filter(c => c.premark === 'U' && c.marked && !c.notAcquired).length;
		const markedMinorSpots = cells.filter(c => c.premark === 'M' && c.marked && !c.notAcquired).length;
	
		const areaMarkedNames = cells
			.filter(c => c.action && c.marked && !c.notAcquired)
			.map(c => c.action);
	
		const equips = get(toolbars).equipActions().map(e => e.name);
		const quests = get(toolbars).questActions().map(q => q.name);
		
		const maxEquipInArea = area.class.indexOf('overworld') >= 0 ? 4 : 3;
		const maxQuestInArea = 2;

		const numEquipAcquired = areaMarkedNames.filter(a => equips.includes(a)).length;
		const numQuestAcquired = areaMarkedNames.filter(a => quests.includes(a)).length;
	
		_trackData.areaMaps[areaMapIndex].stats = {
			maxEquipSpots, maxQuestSpots, maxUpgradeSpots, maxMinorSpots,
			totalValidCells,
			markedEquipSpots, markedQuestSpots, markedUpgradeSpots, markedMinorSpots,
			maxEquipInArea, maxQuestInArea,
			numEquipAcquired, numQuestAcquired
		};
	};

	//  Hydrate all area map statistics before returning the tracker object to the caller
	_trackData.areaMaps.map((a, i) => updateMapStats(i));

	return _trackData;
};

export const tracker = trackerFactory();


export const GlobalAction = {
	hyrule: { display: 'Hyrule', hotkeys: ['h', 'o', '`'], name: 'Hyrule (Q1)' },
	brinstar: { display: 'Brinstar', hotkeys: ['b'], name: 'Brinstar' },
	norfair: { display: 'Norfair', hotkeys: ['n'], name: 'Norfair' },
	kraids: { display: 'Kraid\'s', hotkeys: ['k'], name: 'Kraid\'s' },
	ridleys: { display: 'Ridley\'s', hotkeys: ['r'], name: 'Ridley\'s' },
	level1: { display: 'Level 1', hotkeys: ['1'], name: 'Level 1 (Q1)' },
	level2: { display: 'Level 2', hotkeys: ['2'], name: 'Level 2 (Q1)' },
	level3: { display: 'Level 3', hotkeys: ['3'], name: 'Level 3 (Q1)' },
	level4: { display: 'Level 4', hotkeys: ['4'], name: 'Level 4 (Q1)' },
	level5: { display: 'Level 5', hotkeys: ['5'], name: 'Level 5 (Q1)' },
	level6: { display: 'Level 6', hotkeys: ['6'], name: 'Level 6 (Q1)' },
	level7: { display: 'Level 7', hotkeys: ['7'], name: 'Level 7 (Q1)' },
	level8: { display: 'Level 8', hotkeys: ['8'], name: 'Level 8 (Q1)' },
	level9: { display: 'Level 9', hotkeys: ['9'], name: 'Level 9 (Q1)' },
	shopsandstats: { display: 'Shops & stats', hotkeys: ['s'], name: 'Shops & stats' }
};


function actionsStore() {
	const { subscribe, set, update } = writable(tracker.actions);

	return Object.freeze({
		subscribe,
		set,
		setPosition: (a, i) => {
			update(arr => {
				//  Remove incoming action from all other slots
				let newActions = arr.map(e => e === a ? '' : e);

				//  Set incoming action to desired slot
				newActions[i] = a;

				//  Save list to original object and trigger a state save
				tracker.actions = newActions;
				trackerUpdated();

				return newActions;
			});
		}
	});
};

export const actions = actionsStore();


export const trackerUpdated = () => {
	storage.saveData(tracker);
};


//  TODO: De-dupe this exported function with the member function trackerFactory.updateMapStats() above
export const updateMapStats = (areaMapIndex) => {
	const area = tracker.areaMaps[areaMapIndex].map;
	const cells = area.gridRegions ? area.rooms.concat(area.gridRegions) : area.rooms;

	const maxEquipSpots = cells.filter(c => c.premark === 'E').length;
	const maxQuestSpots = cells.filter(c => c.premark === 'Q').length;
	const maxUpgradeSpots = cells.filter(c => c.premark === 'U').length;
	const maxMinorSpots = cells.filter(c => c.premark === 'M').length;

	const totalValidCells = cells.filter(c => (c.active !== 'false') && !c.outofbounds).length;

	//  TODO: distinguish between marked and non-acquired gear so that users
	//  can see how much has been accounted for, even if not picked up (low priority)
	const markedEquipSpots = cells.filter(c => c.premark === 'E' && c.marked && !c.notAcquired).length;
	const markedQuestSpots = cells.filter(c => c.premark === 'Q' && c.marked && !c.notAcquired).length;
	const markedUpgradeSpots = cells.filter(c => c.premark === 'U' && c.marked && !c.notAcquired).length;
	const markedMinorSpots = cells.filter(c => c.premark === 'M' && c.marked && !c.notAcquired).length;

	const areaMarkedNames = cells
		.filter(c => c.action && c.marked && !c.notAcquired)
		.map(c => c.action);

	const equips = get(toolbars).equipActions().map(e => e.name);
	const quests = get(toolbars).questActions().map(q => q.name);
	
	const maxEquipInArea = area.class.indexOf('overworld') >= 0 ? 4 : 3;
	const maxQuestInArea = 2;

	const numEquipAcquired = areaMarkedNames.filter(a => equips.includes(a)).length;
	const numQuestAcquired = areaMarkedNames.filter(a => quests.includes(a)).length;

	tracker.areaMaps[areaMapIndex].stats = {
		maxEquipSpots, maxQuestSpots, maxUpgradeSpots, maxMinorSpots,
		totalValidCells,
		markedEquipSpots, markedQuestSpots, markedUpgradeSpots, markedMinorSpots,
		maxEquipInArea, maxQuestInArea,
		numEquipAcquired, numQuestAcquired
	};
};


export const getCell = (areaId) => {
	const regionsStartAreaId = tracker.areaMaps[tracker.curAreaMapIndex].map.rooms.length;
	const isRegion           = areaId >= regionsStartAreaId;

	return isRegion ? tracker.areaMaps[tracker.curAreaMapIndex].map.gridRegions[areaId - regionsStartAreaId] :
		tracker.areaMaps[tracker.curAreaMapIndex].map.rooms[areaId];
};


export const updateMapData = async (areaId, marked, actionName) => {
	const regionsStartAreaId = tracker.areaMaps[tracker.curAreaMapIndex].map.rooms.length;
	const isRegion           = areaId >= regionsStartAreaId;

	//  isReminder is a simple toggle stored in the area as a boolean
	const isReminder         = actionName === 'notYetAcquired';

	if(isRegion) {
		if(isReminder) {
			tracker.areaMaps[tracker.curAreaMapIndex].map.gridRegions[areaId - regionsStartAreaId].notAcquired = 
				!tracker.areaMaps[tracker.curAreaMapIndex].map.gridRegions[areaId - regionsStartAreaId].notAcquired;
		}
		else {
			tracker.areaMaps[tracker.curAreaMapIndex].map.gridRegions[areaId - regionsStartAreaId].marked = marked;
			tracker.areaMaps[tracker.curAreaMapIndex].map.gridRegions[areaId - regionsStartAreaId].action = actionName;
		}

		//  Clear notAcquired property if cell was unmarked
		if(!marked)
			tracker.areaMaps[tracker.curAreaMapIndex].map.gridRegions[areaId - regionsStartAreaId].notAcquired = undefined;
	}
	else { //room
		if(isReminder) {
			tracker.areaMaps[tracker.curAreaMapIndex].map.rooms[areaId].notAcquired = 
				!tracker.areaMaps[tracker.curAreaMapIndex].map.rooms[areaId].notAcquired;
		}
		else {
			tracker.areaMaps[tracker.curAreaMapIndex].map.rooms[areaId].marked = marked;
			tracker.areaMaps[tracker.curAreaMapIndex].map.rooms[areaId].action = actionName;
		}

		//  Clear notAcquired property if cell was unmarked
		if(!marked)
			tracker.areaMaps[tracker.curAreaMapIndex].map.rooms[areaId].notAcquired = undefined;
	}

	//  Tell all "subscribers" about our state change (coop if enabled, current map statistics, and local storage)
	get(coopClient).send(`${tracker.curAreaMapIndex} ${areaId} ${marked} ${actionName}`);

	updateMapStats(tracker.curAreaMapIndex);
	trackerUpdated();
};

export const loadState = async (storageKey) => {
	const data = await storage.loadData(storageKey);
	
	return data;
};