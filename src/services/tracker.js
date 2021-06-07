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
	export let optNumMouseButtons = 5;
	export let sessionTimestamp = + new Date();

	export const areaMaps = [
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

	export const areaPairs = areaMaps.reduce((a,v,i,o) => {
			if(i % 2 === 0)
				a.push(o.slice(i, i+2));
				return a;
		}, []);
	
	export const toolbars = [
		{ name: 'dungeon', actions: ['cleared', 'warp', 'equip', 'quest'] },
		{ name: 'overworld', actions: ['cleared', 'warp', 'shop', 'potionShop', 'lockedSword', 'equip', 'quest'] }
	];

	export const mapUpdated = () => {
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
	};

	// export let curToolbars = toolbars;//.filter(tb => tb.name === 'overworld');
	// export let curActions = [
	// 		'cleared',
	// 		'warp',
	// 		'equip',
	// 		'quest',
	// 		'shop'
	// 	];//.filter((a, i) => i < optNumMouseButtons);


    export let curMap = {
        area: areaMaps.filter(a => a.name === 'Hyrule (Q1)')[0].map,
        layout: 'bottom',
        toolbars: toolbars,
        actions: [
			'cleared',
			'warp',
			'equip',
			'quest',
			'shop'
		]
    };

	// export let curMapLayout = 'bottom';
	// export let curMapComponent = Hyruleq1;

	// export let curMap;//areaMaps.filter(a => a.name === 'Hyrule (Q1)')[0].map;