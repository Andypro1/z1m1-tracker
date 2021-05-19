import { writable } from 'svelte/store';

//  TODO: This store may not be needed since
//  map components appear to store their own state automatically
const mapStore = function() {
	const { subscribe, set, update } = writable([]);

    let _initialData;  //  Initial map data as set by init()

    function init(data) { _initialData = data; update(n => data); };

	return Object.freeze({
		subscribe,
		init: init,
		markRoom: (i, roomData) => update(m => m[i] = roomData),
		reset: () => set(_initialData)
	});
}

export default mapStore();