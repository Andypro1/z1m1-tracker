<script>
	import { onMount } from 'svelte';
	//import { each } from 'svelte/internal';
	import tilesheet from '../tilesheet.js';
	//import areamap from '../areamap.js'
	import Overlay from '../Overlay.svelte';
	//import mapStore from '../mapStore.js';
	import { mapState } from './Hyruleq1.mapdata.js';

	//  Props
	export let name;
	export let action = '';
	export let action2 = '';

	const mapTilesheet = new tilesheet(
        '/images/hyrule-q1-halfscale.png',
        2048, 704, 8, 16, 8, 16, 0
    );

    //  Initialize this map with the current data store
    //  Um, dynamic mapState data seems to be persisted across component loads/unloads without the following!?!?:
    
    // let _store = mapStore;
    // _store.init(mapState);

    //const roomStates = ['cleared', 'warp', 'shop', 'potion-shop', 'locked-sword', 'equip', 'quest'];
    // const hyruleQ1Map = new areamap('Hyrule (Q1)', mapTilesheet, roomStates, mapState);

    //  Dynamic style vars
    let styles = {
      'map-cols': 16,
      'map-rows': 8,
      'level-cols': 16,
      'level-rows': 8,
      'shadow-color': 'rgb(97, 97, 35)',
      'bg-uri': `url("${mapTilesheet.bguri()}")`,
      'aspect': `${mapTilesheet.pxWidth() / mapTilesheet.pxHeight()}`
    };

    $: cssVarStyles = Object.entries(styles)
		.map(([key, value]) => `--${key}:${value}`)
		.join(';');

	onMount(() => {	});

  const markRoom = (e, cell, index, action) => {
    if(cell.active) {
      mapState[index].marked = true;
      mapState[index].action = action;
    }
  };
</script>

<div style="{cssVarStyles}">
  <h2>{name}</h2>
  <p>128x88 rooms.  8x16 tiles.  2048 x 704 px total.</p>

  <div class="map-grid">
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
	$maprows: 8;
	$mapcols: 16;
	$levelcols: 16;
	$levelrows: 8;
	$rowoffset: 0;
	$coloffset: 0;

	@mixin row-position {
		@for $i from 0 through $levelrows {
			&:nth-child(n+#{($i) * $levelcols + 1}):nth-child(-n+#{($i+1) * $levelcols}) {
				background-position-y: calc(#{$i + $rowoffset} * 100% / #{$maprows - 1});
			}
		}
	}

	@mixin col-position {
		@for $i from $levelcols through 1 {
			&:nth-child(#{$levelcols}n-#{$i - 1}) {
				background-position-x: calc(#{$levelcols + $coloffset - $i} * 100% / #{$mapcols - 1});
			}
		}
	}

  .room {
		background-image: url(/images/hyrule-q1-halfscale.png);
		
		@include row-position;
		@include col-position;
	}
</style>