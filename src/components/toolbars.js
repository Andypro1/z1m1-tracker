import { writable } from 'svelte/store';

const Action = {
	cleared: { display: 'cleared', hotkeys: [' ', 'c'], name: 'cleared', mapClass: 'fas fa-check-circle' },
	warp: { display: 'warp', hotkeys: ['w'], name: 'warp', mapClass: 'fas fa-door-open', mapText: 'warp' },
	equip: { display: 'equip', hotkeys: ['e'], name: 'equip', mapClass: 'fas fa-gavel', mapText: 'equip' },
	quest: { display: 'quest', hotkeys: ['q'], name: 'quest', mapClass: 'fas fa-trophy', mapText: 'quest' },
	shop: { display: 'shop', hotkeys: ['s'], name: 'shop', image: true, mapText: 'shop' },
	potionShop: { display: 'potion shop', hotkeys: ['p'], name: 'potionShop', mapText: 'p.shop' },
	lockedSword: { display: 'locked sword', hotkeys: ['l'], name: 'lockedSword', mapText: 'sword' },

	Warp: {
		toHyrule: { display: 'Hyrule', hotkeys: ['wh'], name: 'toHyrule', mapText: 'Hyrule' },
		toBrinstar: { display: 'Brinstar', hotkeys: ['wb'], name: 'toBrinstar', mapText: 'Brinstar' },
		toNorfair: { display: 'Norfair', hotkeys: ['wn'], name: 'toNorfair', mapText: 'Norfair' },
		toKraids: { display: 'Kraid\'s', hotkeys: ['wk'], name: 'toKraids', mapText: 'Kraid\'s' },
		toRidleys: { display: 'Ridley\'s', hotkeys: ['wr'], name: 'toRidleys', mapText: 'Ridley\'s' },
		toLevel1: { display: 'Level 1', hotkeys: ['w1'], name: 'toLevel1', mapText: 'Level 1' },
		toLevel2: { display: 'Level 2', hotkeys: ['w2'], name: 'toLevel2', mapText: 'Level 2' },
		toLevel3: { display: 'Level 3', hotkeys: ['w3'], name: 'toLevel3', mapText: 'Level 3' },
		toLevel4: { display: 'Level 4', hotkeys: ['w4'], name: 'toLevel4', mapText: 'Level 4' },
		toLevel5: { display: 'Level 5', hotkeys: ['w5'], name: 'toLevel5', mapText: 'Level 5' },
		toLevel6: { display: 'Level 6', hotkeys: ['w6'], name: 'toLevel6', mapText: 'Level 6' },
		toLevel7: { display: 'Level 7', hotkeys: ['w7'], name: 'toLevel7', mapText: 'Level 7' },
		toLevel8: { display: 'Level 8', hotkeys: ['w8'], name: 'toLevel8', mapText: 'Level 8' },
		toLevel9: { display: 'Level 9', hotkeys: ['w9'], name: 'toLevel9', mapText: 'Level 9' },
		toAnyRoad1: { display: 'Any road 1', hotkeys: ['w11'], name: 'toAnyRoad1', mapText: 'Any road 1'},
		toAnyRoad2: { display: 'Any road 2', hotkeys: ['w22'], name: 'toAnyRoad2', mapText: 'Any road 2'},
		toAnyRoad3: { display: 'Any road 3', hotkeys: ['w33'], name: 'toAnyRoad3', mapText: 'Any road 3'},
		toAnyRoad4: { display: 'Any road 4', hotkeys: ['w44'], name: 'toAnyRoad4', mapText: 'Any road 4'}
	},

	Equip: {
		woodSword: { display: 'Wood sword', hotkeys: ['es'], name: 'woodSword', mapText: 'w.sword' },
		whiteSword: { display: 'White sword', hotkeys: ['ess'], name: 'whiteSword', mapText: 'w.sword' },
		magicalSword: { display: 'Magical sword', hotkeys: ['esss'], name: 'magicalSword', mapText: 'm.sword' },
		magicalRod: { display: 'Magical rod', hotkeys: ['er'], name: 'magicalRod', mapText: 'm.rod' },
		bait: { display: 'Bait', hotkeys: ['eb'], name: 'bait', mapText: 'Bait' },
		morphBall: { display: 'Morph ball', hotkeys: ['em'], name: 'morphBall', mapText: 'Morph ball' },
		morphBombs: { display: 'Morph bombs', hotkeys: ['emm'], name: 'morphBombs', mapText: 'Morph bombs' },
		iceBeam: { display: 'Ice beam', hotkeys: ['ei'], name: 'iceBeam', mapText: 'Ice beam' },
		longBeam: { display: 'Long beam', hotkeys: ['el'], name: 'longBeam', mapText: 'Long beam' },
		waveBeam: { display: 'Wave beam', hotkeys: ['ew'], name: 'waveBeam', mapText: 'Wave beam' },
		screwAttack: { display: 'Screw attack', hotkeys: ['essss'], name: 'screwAttack', mapText: 'Screw attack' },
		highJump: { display: 'High jump', hotkeys: ['eh'], name: 'highJump', mapText: 'High jump' }
	},

	Quest: {
		triforce1: { display: 'Triforce 1', hotkeys: ['q1'], name: 'triforce1', mapText: 'TF 1' },
		triforce2: { display: 'Triforce 2', hotkeys: ['q2'], name: 'triforce2', mapText: 'TF 2' },
		triforce3: { display: 'Triforce 3', hotkeys: ['q3'], name: 'triforce3', mapText: 'TF 3' },
		triforce4: { display: 'Triforce 4', hotkeys: ['q4'], name: 'triforce4', mapText: 'TF 4' },
		triforce5: { display: 'Triforce 5', hotkeys: ['q5'], name: 'triforce5', mapText: 'TF 5' },
		triforce6: { display: 'Triforce 6', hotkeys: ['q6'], name: 'triforce6', mapText: 'TF 6' },
		triforce7: { display: 'Triforce 7', hotkeys: ['q7'], name: 'triforce7', mapText: 'TF 7' },
		triforce8: { display: 'Triforce 8', hotkeys: ['q8'], name: 'triforce8', mapText: 'TF 8' },

		kraidTotem: { display: 'Kraid totem', hotkeys: ['qk'], name: 'kraidTotem', mapText: 'k.totem' },
		ridleyTotem: { display: 'Ridley totem', hotkeys: ['qr'], name: 'ridleyTotem', mapText: 'r.totem' }
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