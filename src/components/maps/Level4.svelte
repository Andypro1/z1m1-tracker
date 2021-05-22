<script>
	import { onMount } from 'svelte';
	//import { each } from 'svelte/internal';
	import tilesheet from '../tilesheet.js';
	//import areamap from '../areamap.js'
	import Overlay from '../Overlay.svelte';
	//import mapStore from '../mapStore.js';
	import { mapState } from './Level4q1.mapdata.js';

  //  Props
	export let name;
	export let action = '';
	export let action2 = '';

  //  Assign every dungeon room as active
  mapState.forEach(r => r.active = true);

    const mapTilesheet = new tilesheet(
        '/images/dungeons-halfscale.png',
        2048, 1408, 16, 16, 4, 8, 0
    );

  // const roomStates = ['cleared', 'warp', 'equip', 'quest'];
  // const levelQ1Map = new areamap('Level 2', mapTilesheet, roomStates, mapState);

    //  Dynamic style vars
    let styles = {
      'map-cols': 16,
      'map-rows': 16,
      'level-cols': 4,
      'level-rows': 8,
      'shadow-color': 'rgb(136, 112, 0)',
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
  <h2>{name}</h2>
  <p>xxx rooms.  16x16 tiles.  2048 x 1408 px total.</p>

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
  $maprows: 16;
  $mapcols: 16;
	$levelcols: 4;
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
    background-image: url('/images/dungeons-halfscale.png');

		@include row-position;
		@include col-position;
  }
</style>