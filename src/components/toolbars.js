import { writable } from 'svelte/store';

const Action = {
	cleared: { display: 'cleared', hotkeys: [' ', 'c'], name: 'cleared', mapClass: 'fas fa-check-circle' },
	warp: { display: 'warp', hotkeys: ['w'], name: 'warp', mapClass: 'fas fa-door-open', mapText: 'W' },
	equip: { display: 'equip', hotkeys: ['e'], name: 'equip', mapClass: 'fas fa-gavel', mapText: 'E' },
	quest: { display: 'quest', hotkeys: ['q'], name: 'quest', mapClass: 'fas fa-trophy', mapText: 'Q' },
	shop: { display: 'shop', hotkeys: ['s'], name: 'shop', image: true, mapText: 'shop' },
	potionShop: { display: 'potion shop', hotkeys: ['p'], name: 'potionShop', mapText: 'p.shop' },
	lockedSword: { display: 'locked sword', hotkeys: ['l'], name: 'lockedSword', mapText: 'sword' },

	Warp: {
		toHyrule: { display: 'Hyrule', hotkeys: ['wh', 'wo'], name: 'toHyrule', warpText: 'Hyrule' },
		toBrinstar: { display: 'Brinstar', hotkeys: ['wb'], name: 'toBrinstar', warpText: 'Brinstar' },
		toNorfair: { display: 'Norfair', hotkeys: ['wn'], name: 'toNorfair', warpText: 'Norfair' },
		toKraids: { display: 'Kraid\'s', hotkeys: ['wk'], name: 'toKraids', warpText: 'Kraid\'s' },
		toRidleys: { display: 'Ridley\'s', hotkeys: ['wr'], name: 'toRidleys', warpText: 'Ridley\'s' },
		toLevel1: { display: 'Level 1', hotkeys: ['w1'], name: 'toLevel1', warpText: 'Level 1' },
		toLevel2: { display: 'Level 2', hotkeys: ['w2'], name: 'toLevel2', warpText: 'Level 2' },
		toLevel3: { display: 'Level 3', hotkeys: ['w3'], name: 'toLevel3', warpText: 'Level 3' },
		toLevel4: { display: 'Level 4', hotkeys: ['w4'], name: 'toLevel4', warpText: 'Level 4' },
		toLevel5: { display: 'Level 5', hotkeys: ['w5'], name: 'toLevel5', warpText: 'Level 5' },
		toLevel6: { display: 'Level 6', hotkeys: ['w6'], name: 'toLevel6', warpText: 'Level 6' },
		toLevel7: { display: 'Level 7', hotkeys: ['w7'], name: 'toLevel7', warpText: 'Level 7' },
		toLevel8: { display: 'Level 8', hotkeys: ['w8'], name: 'toLevel8', warpText: 'Level 8' },
		toLevel9: { display: 'Level 9', hotkeys: ['w9'], name: 'toLevel9', warpText: 'Level 9' },
		toAnyRoad: { display: 'Any road', hotkeys: ['wa'], name: 'toAnyRoad', warpText: 'Any road'},
		toAnyRoad1: { display: 'Any road 1', hotkeys: ['wa1'], name: 'toAnyRoad1', warpText: 'Any road 1'},
		toAnyRoad2: { display: 'Any road 2', hotkeys: ['wa2'], name: 'toAnyRoad2', warpText: 'Any road 2'},
		toAnyRoad3: { display: 'Any road 3', hotkeys: ['wa3'], name: 'toAnyRoad3', warpText: 'Any road 3'},
		toAnyRoad4: { display: 'Any road 4', hotkeys: ['wa4'], name: 'toAnyRoad4', warpText: 'Any road 4'}
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
		{ name: 'dungeon', actions: [Action.cleared, Action.warp, Action.equip, Action.quest] },
		{ name: 'overworld', actions: [Action.cleared, Action.warp, Action.equip, Action.quest, Action.shop, Action.potionShop, Action.lockedSword] },
		{ name: 'warp', actions: [...Object.keys(Action.Warp).map(k => Action.Warp[k])] },
		{ name: 'equip', actions: [...Object.keys(Action.Equip).map(k => Action.Equip[k])] },
		{ name: 'quest', actions: [...Object.keys(Action.Quest).map(k => Action.Quest[k])] }
	];

	const getMainToolbar = (set) => {
		if(set.indexOf('overworld') >= 0)
			return _toolbars.filter(t => t.name === 'overworld');

		if(set.indexOf('dungeon') >= 0)
			return _toolbars.filter(t => t.name === 'dungeon');

		if(set.indexOf('zebes') >= 0)
			return _toolbars.filter(t => t.name === 'dungeon');
	};

	const getSubToolbar = () => {
		return _toolbars.filter(t => t.name === currentSubBar);
	};

	const isAToolbarAction = (action) => {
		return ['warp', 'equip', 'quest'].includes(action);
	};

	const setSubToolbar = (action) => {
		if(['warp', 'equip', 'quest'].includes(action)) {
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

		currentSubBar = '';
	};

	const getAction = (name) => {
		return Action[name];
	};

	const allActions = () => {
		return flattenObject(Action);
	}

	return Object.freeze({
		getMainToolbar,
		getSubToolbar,
		setSubToolbar,
		isAToolbarAction,
		getAction,
		allActions
	});
};

export default writable(Toolbars());