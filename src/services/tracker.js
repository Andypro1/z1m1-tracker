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

//  Global and session options
// export let sessionTimestamp = + new Date();

export const tracker = {
	sessionTimestamp: +new Date(),
	curAreaMapIndex: 0,
	layout: 'bottom',
	actions: [
		'cleared',
		'warp',
		'equip',
		'quest',
		'shop'
	],
	areaMaps: [
		{ name: 'Hyrule (Q1)', map: Hyruleq1.data},
		{ name: 'Level 9 (Q1)', map: Level9.data},
		{ name: 'Shops', map: Level1.data},
		{ name: 'Potion shops', map: Level2.data},
		{ name: 'Level 1 (Q1)', map: Level1.data},
		{ name: 'Level 5 (Q1)', map: Level5.data},
		{ name: 'Level 2 (Q1)', map: Level2.data},
		{ name: 'Level 6 (Q1)', map: Level6.data},
		{ name: 'Level 3 (Q1)', map: Level3.data},
		{ name: 'Level 7 (Q1)', map: Level7.data},
		{ name: 'Level 4 (Q1)', map: Level4.data},
		{ name: 'Level 8 (Q1)', map: Level8.data},
		{ name: 'Kraid\'s', map: Kraids.data},
		{ name: 'Ridley\'s', map: Ridleys.data},
		{ name: 'Brinstar', map: Brinstar.data},
		{ name: 'Norfair', map: Norfair.data}
	]
};

export const areaPairs = tracker.areaMaps.reduce((a,v,i,o) => {
		if(i % 2 === 0)
			a.push(o.slice(i, i+2));
			return a;
	}, []);

export const toolbars = [
	{ name: 'dungeon', actions: ['cleared', 'warp', 'equip', 'quest'] },
	{ name: 'overworld', actions: ['cleared', 'warp', 'shop', 'potionShop', 'lockedSword', 'equip', 'quest'] }
];

// export let curMap = {
// 	area: areaMaps.filter(a => a.name === 'Hyrule (Q1)')[0].map,
// 	layout: 'bottom',
// 	toolbars: toolbars,
// 	actions: [
// 		'cleared',
// 		'warp',
// 		'equip',
// 		'quest',
// 		'shop'
// 	]
// };

export const mapUpdated = () => {
	// const combinedData = {
	// 	sessionTimestamp: sessionTimestamp,
	// 	Hyruleq1,
	// 	Level1,
	// 	Level2, 
	// 	Level3, 
	// 	Level4, 
	// 	Level5, 
	// 	Level6, 
	// 	Level7, 
	// 	Level8, 
	// 	Level9, 
	// 	Brinstar, 
	// 	Norfair, 
	// 	Kraids, 
	// 	Ridleys 
	// };

	// storage.saveData(combinedData);
	storage.saveData(tracker);
};

export const loadState = async (storageKey) => {
	const data = await storage.loadData(storageKey);
	
	return data;
};

