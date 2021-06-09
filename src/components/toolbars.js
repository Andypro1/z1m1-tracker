
const Toolbars = () => {
	const _toolbars = [
		{ name: 'dungeon', actions: ['cleared', 'warp', 'equip', 'quest'] },
		{ name: 'overworld', actions: ['cleared', 'warp', 'equip', 'quest', 'shop', 'potionShop', 'lockedSword'] },
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

export default Toolbars();