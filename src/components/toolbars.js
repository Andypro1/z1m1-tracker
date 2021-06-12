import { writable } from 'svelte/store';

const Action = {
	cleared: { display: 'cleared', hotkeys: [' ', 'c'], name: 'cleared' },
	warp: { display: 'warp', hotkeys: ['w'], name: 'warp' },
	equip: { display: 'equip', hotkeys: ['e'], name: 'equip' },
	quest: { display: 'quest', hotkeys: ['q'], name: 'quest' },
	shop: { display: 'shop', hotkeys: ['s'], name: 'shop' },
	potionShop: { display: 'potion shop', hotkeys: ['p'], name: 'potionShop' },
	lockedSword: { display: 'locked sword', hotkeys: ['l'], name: 'lockedSword' }
};

const Toolbars = () => {
	const _toolbars = [
		{ name: 'dungeon', actions: [Action.cleared, Action.warp, Action.equip, Action.quest] },
		{ name: 'overworld', actions: [Action.cleared, Action.warp, Action.equip, Action.quest, Action.shop, Action.potionShop, Action.lockedSword] },
		{ name: 'warp', actions: ['cleared', 'warp', 'shop', 'potionShop', 'lockedSword', 'equip', 'quest'] },
		{ name: 'equip', actions: ['cleared', 'warp', 'shop', 'potionShop', 'lockedSword', 'equip', 'quest'] },
		{ name: 'quest', actions: ['cleared', 'warp', 'shop', 'potionShop', 'lockedSword', 'equip', 'quest'] },
		{ name: 'shop', actions: ['cleared', 'warp', 'shop', 'potionShop', 'lockedSword', 'equip', 'quest'] }
	];

	const getMainToolbar = (set) => {
		if(set.indexOf('overworld') >= 0)
			return _toolbars.filter(t => t.name === 'overworld');
		
		if(set.indexOf('dungeon') >= 0)
			return _toolbars.filter(t => t.name === 'dungeon');

		if(set.indexOf('zebes') >= 0)
			return _toolbars.filter(t => t.name === 'dungeon');
	};

	return Object.freeze({
		getMainToolbar
	});
};

export default writable(Toolbars());