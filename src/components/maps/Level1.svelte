<script>
	import { onMount } from 'svelte';
	//import { each } from 'svelte/internal';
	import tilesheet from '../tilesheet.js';
	//import areamap from '../areamap.js'
	import Overlay from '../Overlay.svelte';
	//import mapStore from '../mapStore.js';
	import { mapState } from './Level1q1.mapdata.js';

  //  Props
	export let name;
	export let action = '';
	export let action2 = '';

  //  My state
  let flipH;
  let flipV;

  //  Assign every dungeon room as active
  mapState.forEach(r => r.active = true);

    const mapTilesheet = new tilesheet(
        '/images/dungeons-halfscale.png',
        2048, 1408, 16, 16, 6, 6, 33
    );

    //  Initialize this map with the current data store
    //  Um, dynamic mapState data seems to be persisted across component loads/unloads without the following!?!?:

  //const roomStates = ['cleared', 'warp', 'equip', 'quest'];
  //const levelQ1Map = new areamap('Level 1', mapTilesheet, roomStates, mapState);

    //  Dynamic style vars
    let styles = {
      'map-cols': 16,
      'map-rows': 16,
      'level-cols': 6,
      'level-rows': 6,
      'shadow-color': 'rgb(0, 128, 136)',
      'bg-uri': `url("${mapTilesheet.bguri()}")`,
      'aspect': `${mapTilesheet.pxWidth() / mapTilesheet.pxHeight()}`
    };

    $: cssVarStyles = Object.entries(styles)
		.map(([key, value]) => `--${key}:${value}`)
		.join(';');

	onMount(() => { });

  const markRoom = (e, cell, index, action) => {
    if(cell.active) {
      mapState[index].marked = true;
      mapState[index].action = action;
    }
  };
</script>

<div style="{cssVarStyles}">
  <div class="map-options">
    <div class="map-option">
      <label>
        <input type="checkbox" bind:checked={flipH} />
        Flip horizontally
      </label>
    </div>
    <div class="map-option">
      <label>
        <input type="checkbox" bind:checked={flipV} />
        Flip vertically
      </label>
    </div>
  </div>
  <div class="map-grid" class:mirrored-h={flipH} class:mirrored-v={flipV}>
    {#each mapState as cell,index (mapTilesheet.sectionStartCell() + index)}
        <div class="room" class:active={cell.active} class:oob={cell.outofbounds}
          on:click={(e) => markRoom(e, cell, index, action) }
		  on:contextmenu={(e) => markRoom(e, cell, index, action2) }>
          <Overlay action={cell.action} draw={cell.marked} />
  		</div>
    {/each}
  </div>
</div>

<style type="scss">
  //TODO: Any way to dynamically assign from css var()s?  emotion.js?
  $maprows: 16;
  $mapcols: 16;
	$levelcols: 6;
	$levelrows: 6;
  $rowoffset: 2;
  $coloffset: 1;

  @import "../../styles/map-grid.scss";

  .room {
    background-image: url('/images/dungeons-halfscale.png');
  }
</style>