import { writable } from 'svelte/store';


const Action = {
	cleared: { display: 'cleared', hotkeys: [' ', 'a'], name: 'cleared', mapClass: 'fas fa-check-circle' },
	notYetAcquired: { display: 'not yet acquired', hotkeys: ['z'], name: 'notYetAcquired', mapClass: 'fas fa-asterisk' },
	warp: { display: 'warp', hotkeys: ['w'], name: 'warp', mapClass: 'fas fa-door-open', mapText: 'W' },
	equip: { display: 'equip', hotkeys: ['e'], name: 'equip', mapClass: 'fas fa-gavel', mapText: 'E' },
	quest: { display: 'quest', hotkeys: ['q'], name: 'quest', mapClass: 'fas fa-trophy', mapText: 'Q' },
	shop: { display: 'shop', hotkeys: ['s'], name: 'shop', shopText: 'shop', spriteIndex: 15 },
	custom1: { display: 'custom 1', hotkeys: ['c'], name: 'custom1', class: 'custom' },
	custom2: { display: 'custom 2', hotkeys: ['cc'], name: 'custom2', class: 'custom' },

	Warp: {
		toHyrule: { display: 'Hyrule', hotkeys: ['wh', 'wo', 'w`'], name: 'toHyrule', warpText: 'Hyrule', spriteIndex: 0},
		toBrinstar: { display: 'Brinstar', hotkeys: ['wb'], name: 'toBrinstar', warpText: 'Brinstar' , spriteIndex: 11},
		toNorfair: { display: 'Norfair', hotkeys: ['wn'], name: 'toNorfair', warpText: 'Norfair' , spriteIndex: 12},
		toKraids: { display: 'Kraid\'s', hotkeys: ['wk'], name: 'toKraids', warpText: 'Kraid\'s' , spriteIndex: 13},
		toRidleys: { display: 'Ridley\'s', hotkeys: ['wr'], name: 'toRidleys', warpText: 'Ridley\'s' , spriteIndex: 14},
		toTourian: { display: 'Tourian bridge', hotkeys: ['wt'], name: 'toTourian', warpText: 'T. bridge', spriteIndex: 17 },
		toLevel1: { display: 'Level 1', hotkeys: ['w1'], name: 'toLevel1', warpText: 'Level 1' , spriteIndex: 1},
		toLevel2: { display: 'Level 2', hotkeys: ['w2'], name: 'toLevel2', warpText: 'Level 2' , spriteIndex: 2},
		toLevel3: { display: 'Level 3', hotkeys: ['w3'], name: 'toLevel3', warpText: 'Level 3' , spriteIndex: 3},
		toLevel4: { display: 'Level 4', hotkeys: ['w4'], name: 'toLevel4', warpText: 'Level 4' , spriteIndex: 4},
		toLevel5: { display: 'Level 5', hotkeys: ['w5'], name: 'toLevel5', warpText: 'Level 5' , spriteIndex: 5},
		toLevel6: { display: 'Level 6', hotkeys: ['w6'], name: 'toLevel6', warpText: 'Level 6' , spriteIndex: 6},
		toLevel7: { display: 'Level 7', hotkeys: ['w7'], name: 'toLevel7', warpText: 'Level 7' , spriteIndex: 7},
		toLevel8: { display: 'Level 8', hotkeys: ['w8'], name: 'toLevel8', warpText: 'Level 8' , spriteIndex: 8},
		toLevel9: { display: 'Level 9', hotkeys: ['w9'], name: 'toLevel9', warpText: 'Level 9' , spriteIndex: 9},
		toAnyRoad: { display: 'Any road', hotkeys: ['wa'], name: 'toAnyRoad', warpText: 'Any road', spriteIndex: 10},
		toAnyRoad1: { display: 'Any road 1', hotkeys: ['wa1'], name: 'toAnyRoad1', warpText: 'Any road 1', spriteIndex: 10},
		toAnyRoad2: { display: 'Any road 2', hotkeys: ['wa2'], name: 'toAnyRoad2', warpText: 'Any road 2', spriteIndex: 10},
		toAnyRoad3: { display: 'Any road 3', hotkeys: ['wa3'], name: 'toAnyRoad3', warpText: 'Any road 3', spriteIndex: 10},
		toAnyRoad4: { display: 'Any road 4', hotkeys: ['wa4'], name: 'toAnyRoad4', warpText: 'Any road 4', spriteIndex: 10}
	},

	Equip: {
		woodenArrows: { display: 'Wooden arrows', hotkeys: ['ea'], name: 'woodenArrows', spriteIndex: 21 },
		silverArrows: { display: 'Silver arrows', hotkeys: ['eaa'], name: 'silverArrows', spriteIndex: 22 },
		bow: { display: 'Bow', hotkeys: ['eb'], name: 'bow', spriteIndex: 20 },
		bait: { display: 'Bait', hotkeys: ['ebb'], name: 'bait', spriteIndex: 14 },
		book: { display: 'Book', hotkeys: ['ebbb'], name: 'book', spriteIndex: 32 },
		woodenBoomerang: { display: 'Wooden boomerang', hotkeys: ['ebbbb'], name: 'woodenBoomerang', spriteIndex: 18 },
		magicalBoomerang: { display: 'Magical boomerang', hotkeys: ['ebbbbb'], name: 'magicalBoomerang', spriteIndex: 19 },
		blueCandle: { display: 'Blue candle', hotkeys: ['ec'], name: 'blueCandle', spriteIndex: 24 },
		redCandle: { display: 'Red candle', hotkeys: ['ecc'], name: 'redCandle', spriteIndex: 23 },
		highJump: { display: 'High jump', hotkeys: ['eh'], name: 'highJump', spriteIndex: 3 },
		iceBeam: { display: 'Ice beam', hotkeys: ['ei'], name: 'iceBeam', spriteIndex: 8 },
		magicalKey: { display: 'Magical key', hotkeys: ['ek'], name: 'magicalKey', spriteIndex: 34 },
		ladder: { display: 'Ladder', hotkeys: ['el'], name: 'ladder', spriteIndex: 30 },
		letter: { display: 'Letter', hotkeys: ['ell'], name: 'letter', spriteIndex: 13 },
		longBeam: { display: 'Long beam', hotkeys: ['elll'], name: 'longBeam', spriteIndex: 7 },
		morphBall: { display: 'Morph ball', hotkeys: ['em'], name: 'morphBall', spriteIndex: 2 },
		morphBombs: { display: 'Morph bombs', hotkeys: ['emm'], name: 'morphBombs', spriteIndex: 5 },
		powerBracelet: { display: 'Power bracelet', hotkeys: ['ep'], name: 'powerBracelet', spriteIndex: 27 },
		raft: { display: 'Raft', hotkeys: ['er'], name: 'raft', spriteIndex: 29 },
		magicalRod: { display: 'Magical rod', hotkeys: ['err'], name: 'magicalRod', spriteIndex: 31 },
		recorder: { display: 'Recorder', hotkeys: ['errr'], name: 'recorder', spriteIndex: 28 },
		blueRing: { display: 'Blue ring', hotkeys: ['errrr'], name: 'blueRing', spriteIndex: 25 },
		redRing: { display: 'Red ring', hotkeys: ['errrrr'], name: 'redRing', spriteIndex: 26 },
		woodSword: { display: 'Wood sword', hotkeys: ['es'], name: 'woodSword', spriteIndex: 15 },
		whiteSword: { display: 'White sword', hotkeys: ['ess'], name: 'whiteSword', spriteIndex: 16 },
		magicalSword: { display: 'Magical sword', hotkeys: ['esss'], name: 'magicalSword', spriteIndex: 17 },
		screwAttack: { display: 'Screw attack', hotkeys: ['essss'], name: 'screwAttack', spriteIndex: 6 },
		variaSuit: { display: 'Varia suit', hotkeys: ['ev'], name: 'variaSuit', spriteIndex: 4 },
		waveBeam: { display: 'Wave beam', hotkeys: ['ew'], name: 'waveBeam', spriteIndex: 9 }
	},

	Quest: {
		triforce1: { display: 'Triforce 1', hotkeys: ['q1'], name: 'triforce1', spriteIndex: 35, mapText: '1' },
		triforce2: { display: 'Triforce 2', hotkeys: ['q2'], name: 'triforce2', spriteIndex: 35, mapText: '2' },
		triforce3: { display: 'Triforce 3', hotkeys: ['q3'], name: 'triforce3', spriteIndex: 35, mapText: '3' },
		triforce4: { display: 'Triforce 4', hotkeys: ['q4'], name: 'triforce4', spriteIndex: 35, mapText: '4' },
		triforce5: { display: 'Triforce 5', hotkeys: ['q5'], name: 'triforce5', spriteIndex: 35, mapText: '5' },
		triforce6: { display: 'Triforce 6', hotkeys: ['q6'], name: 'triforce6', spriteIndex: 35, mapText: '6' },
		triforce7: { display: 'Triforce 7', hotkeys: ['q7'], name: 'triforce7', spriteIndex: 35, mapText: '7' },
		triforce8: { display: 'Triforce 8', hotkeys: ['q8'], name: 'triforce8', spriteIndex: 35, mapText: '8' },

		kraidTotem: { display: 'Kraid totem', hotkeys: ['qk'], name: 'kraidTotem', spriteIndex: 35, mapText: 'K' },
		ridleyTotem: { display: 'Ridley totem', hotkeys: ['qr'], name: 'ridleyTotem', spriteIndex: 35, mapText: 'R' }
	},

	Shop: {
		potionShop: { display: 'potion shop', hotkeys: ['sp'], name: 'potionShop', shopText: ' ', spriteIndex: 16 },
	}
};


const flattenObject = (obj) => {
	const flattened = {};

	Object.keys(obj).forEach((key) => {
		if(!obj[key].display) {
			Object.assign(flattened, flattenObject(obj[key]));
		} else {
			flattened[key] = obj[key];
		}
	});

	return flattened;
};


const Toolbars = () => {
	let currentSubBar = 'warp';

	const _toolbars = [
		{ name: 'dungeon', actions: [Action.cleared, Action.notYetAcquired, Action.warp, Action.equip, Action.quest, Action.custom1, Action.custom2] },
		{ name: 'overworld', actions: [Action.cleared, Action.notYetAcquired, Action.shop, Action.warp, Action.equip, Action.quest, Action.custom1, Action.custom2] },
		{ name: 'warp', actions: [...Object.keys(Action.Warp).map(k => Action.Warp[k])] },
		{ name: 'equip', actions: [...Object.keys(Action.Equip).map(k => Action.Equip[k])] },
		{ name: 'quest', actions: [...Object.keys(Action.Quest).map(k => Action.Quest[k])] },
		{ name: 'shop', actions: [...Object.keys(Action.Shop).map(k => Action.Shop[k])] }
	];

	const getMainToolbar = (set) => {
		if(set.indexOf('overworld') >= 0)
			return _toolbars.filter(t => t.name === 'overworld');
		else
			return _toolbars.filter(t => t.name === 'dungeon');
	};

	const getCurrentSubBarName = () => {
		return currentSubBar;
	}

	const getSubToolbar = () => {
		return _toolbars.filter(t => t.name === currentSubBar);
	};

	const isAToolbarAction = (action) => {
		return ['warp', 'equip', 'quest', 'shop'].includes(action);
	};

	const setSubToolbar = (action) => {
		if(['warp', 'equip', 'quest', 'shop'].includes(action)) {
			currentSubBar = action;
			return;
		}

		if(Object.keys(Action.Warp).includes(action)) {
			currentSubBar = 'warp';
			return;
		}

		if(Object.keys(Action.Equip).includes(action)) {
			currentSubBar = 'equip';
			return;
		}

		if(Object.keys(Action.Quest).includes(action)) {
			currentSubBar = 'quest';
			return;
		}

		if(Object.keys(Action.Shop).includes(action)) {
			currentSubBar = 'shop';
			return;
		}
	};

	const getAction = (name) => {
		return flattenObject(Action)[name];
	};


	//  Manages metadata for equipment and quest actions that are considered single use items.
	//  If the items have been placed in the tracker, a "used" class is added to the toolbar action
	//  to alert the player to its use.
	const updateActionUsedStatus = (wasMarked, actionName, areaMapIndex, areaId) => {
		const equipIndex       = _toolbars.findIndex(t => t.name === 'equip');
		const questIndex       = _toolbars.findIndex(t => t.name === 'quest');
		const encodedArea	   = (areaMapIndex * 1000) + areaId;
		
		//  First remove existing used metadata for this location, if present
		const removeEindex = _toolbars[equipIndex].actions.findIndex(a => Array.isArray(a.usedArea) && a.usedArea.includes(encodedArea));
		const removeQindex = _toolbars[questIndex].actions.findIndex(a => Array.isArray(a.usedArea) && a.usedArea.includes(encodedArea));

		if(removeEindex >= 0) {
			_toolbars[equipIndex].actions[removeEindex].usedArea = _toolbars[equipIndex].actions[removeEindex].usedArea.filter(a => a !== encodedArea);
			_toolbars[equipIndex].actions[removeEindex].used = _toolbars[equipIndex].actions[removeEindex].usedArea.length ? true : undefined;
		}

		if(removeQindex >= 0) {
			_toolbars[questIndex].actions[removeQindex].usedArea = _toolbars[questIndex].actions[removeQindex].usedArea.filter(a => a !== encodedArea);
			_toolbars[questIndex].actions[removeQindex].used = _toolbars[questIndex].actions[removeQindex].usedArea.length ? true : undefined;
		}


		if(wasMarked) {
			//  Find the matching equip or quest action, and mark used along with used location metadata
			const equipActionIndex = _toolbars[equipIndex].actions.findIndex(a => a.name === actionName);
			const questActionIndex = _toolbars[questIndex].actions.findIndex(a => a.name === actionName);

			if(equipActionIndex >= 0) {
				_toolbars[equipIndex].actions[equipActionIndex].used = wasMarked;
				_toolbars[equipIndex].actions[equipActionIndex].usedArea =
					Array.isArray(_toolbars[equipIndex].actions[equipActionIndex].usedArea) ?
					[..._toolbars[equipIndex].actions[equipActionIndex].usedArea, encodedArea] : [encodedArea];
			}

			if(questActionIndex >= 0) {
				_toolbars[questIndex].actions[questActionIndex].used = wasMarked;
				_toolbars[questIndex].actions[questActionIndex].usedArea =
					Array.isArray(_toolbars[questIndex].actions[questActionIndex].usedArea) ?
					[..._toolbars[questIndex].actions[questActionIndex].usedArea, encodedArea] : [encodedArea];
			}
		}
	};


	//  Iterate through all tracker map data to hydrate all toolbar action metadata (used status)
	const hydrateAllMetadata = async (areaMaps) => {
		const equipIndex       = _toolbars.findIndex(t => t.name === 'equip');
		const questIndex       = _toolbars.findIndex(t => t.name === 'quest');

		//  Reset all action metadata
		_toolbars[equipIndex].actions = _toolbars[equipIndex].actions.map(a => { a.used = undefined; a.usedArea = undefined; return a; });
		_toolbars[questIndex].actions = _toolbars[questIndex].actions.map(a => { a.used = undefined; a.usedArea = undefined; return a; });


		for(let areaMapIndex = 0; areaMapIndex < areaMaps.length; ++areaMapIndex) {
			const cells = areaMaps[areaMapIndex].map.gridRegions ?
				areaMaps[areaMapIndex].map.rooms.concat(areaMaps[areaMapIndex].map.gridRegions) :
				areaMaps[areaMapIndex].map.rooms;

			cells.forEach((c, i) => {
				const ea = _toolbars[equipIndex].actions.findIndex(e => e.name === c.action);
				const qa = _toolbars[questIndex].actions.findIndex(q => q.name === c.action);

				if(ea >= 0) {
					const encodedArea = (areaMapIndex * 1000) + i;

					_toolbars[equipIndex].actions[ea].used = true;
					_toolbars[equipIndex].actions[ea].usedArea = Array.isArray(_toolbars[equipIndex].actions[ea].usedArea) ?
						[..._toolbars[equipIndex].actions[ea].usedArea, encodedArea] : [encodedArea];
				}

				if(qa >= 0) {
					const encodedArea = (areaMapIndex * 1000) + i;

					_toolbars[questIndex].actions[qa].used = true;
					_toolbars[questIndex].actions[qa].usedArea = Array.isArray(_toolbars[questIndex].actions[qa].usedArea) ?
						[..._toolbars[questIndex].actions[qa].usedArea, encodedArea] : [encodedArea];
				}
			});
		}
	};

	const allActions = () => {
		return flattenObject(Action);
	}

	const questActions = () => {
		return Object.keys(Action.Quest).map(k => Action.Quest[k])
			.concat(Action.quest);
	}

	const equipActions = () => {
		return Object.keys(Action.Equip).map(k => Action.Equip[k])
		.concat(Action.equip);
	}

	return Object.freeze({
		getMainToolbar,
		getSubToolbar,
		setSubToolbar,
		isAToolbarAction,
		getAction,
		updateActionUsedStatus,
		hydrateAllMetadata,
		questActions,
		equipActions,
		allActions,
		getCurrentSubBarName
	});
};

export default writable(Toolbars());