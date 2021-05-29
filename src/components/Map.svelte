<script>
    import { onMount } from "svelte";
    //import { each } from 'svelte/internal';
    import tilesheet from "./tilesheet.js";
    //import areamap from '../areamap.js'
    import Overlay from "./Overlay.svelte";
    //import mapStore from '../mapStore.js';

    //  Props
    export let data = {};
    export let action = "";
    export let action2 = "";
    export let layout;
    export let flipH = false;
    export let flipV = false;
  
    //  Assign every dungeon room as active
    $: data.class.match(/(?:dungeon)|(?:zebes)/) && data.rooms.forEach(r => r.active = true);

    //  My state
    let initialLoad = false;
    let rMap;  //  Map display ratio for calculating layout
    $: styles = {
        "map-cols": data.cols,
        "map-rows": data.rows,
        "level-cols": data.sectionCols,
        "level-rows": data.sectionRows,
        "shadow-color": data.shadowColor,
        aspect: `${mapTilesheet.pxWidth() / mapTilesheet.pxHeight()}`,
    };

    //  This hack ensures that methods can be run when the
    //  <svelte:component>'s "this" binding changes in App.svelte
    //  because it isn't actually tearing down and mounting a new component;
    //  just changing "this" and all the props.
    //  The reactive rMap variable triggers the framework to call sizeMapGrid
    //  when all the props change by virtue of it being marked as reactive with $: rMap.
	$: if(initialLoad) {
		sizeMapGrid(rMap);
	}

    $: mapTilesheet = new tilesheet(
      '',
      data.pixelWidth,
      data.pixelHeight,
      data.rows,
      data.cols,
      data.sectionRows,
      data.sectionCols,
      data.sectionStartCell
    );
  
    $: rMap = (mapTilesheet.pxWidth() + (mapTilesheet.sectionCols() - 1)) /
           (mapTilesheet.pxHeight() + (mapTilesheet.sectionRows() - 1));

    onMount(() => {
        sizeMapGrid();
        initialLoad = true;
    });

    $: cssVarStyles = Object.entries(styles)
      .map(([key, value]) => `--${key}:${value}`)
      .join(";");

    const markRoom = (e, cell, index, action) => {
      if (cell.active) {
        data.rooms[index].marked = true;
        data.rooms[index].action = action;
      }
    };

    const sizeMapGrid = () => {
      const [wWin, hWin, hTopBar] = [window.innerWidth, window.innerHeight, document.querySelector('.top-bar').clientHeight];
      const ASSUMED_CARD_PAIR_SIZE = 240;
  
      const hSCAvail = hWin - hTopBar;
      const wSCAvail = wWin - ASSUMED_CARD_PAIR_SIZE;
      const rSCWin = wSCAvail / hSCAvail;
      
      const wSCNewMap = rSCWin < rMap ? wSCAvail : hSCAvail * rMap;
      const hSCNewMap = rSCWin < rMap ? wSCAvail / rMap : hSCAvail;
      const SCMapArea = wSCNewMap * hSCNewMap;
  
      const hBCAvail = hWin - hTopBar - ASSUMED_CARD_PAIR_SIZE;
      const wBCAvail = wWin;
      const rBCWin = wBCAvail / hBCAvail;
  
      const wBCNewMap = rBCWin < rMap ? wBCAvail : hBCAvail * rMap;
      const hBCNewMap = rBCWin < rMap ? wBCAvail / rMap : hBCAvail;
      const BCMapArea = wBCNewMap * hBCNewMap;
  
      layout(SCMapArea > BCMapArea ?
             {name: 'side',
              width: wSCNewMap / mapTilesheet.sectionCols(),
              height: hSCNewMap / mapTilesheet.sectionRows(),
              pad: mapTilesheet.sectionCols() - 1
            } :
             { name: 'bottom',
             width: wBCNewMap / mapTilesheet.sectionCols(),
             height: hBCNewMap / mapTilesheet.sectionRows(),
             pad: mapTilesheet.sectionRows() - 1
            });
    };
  </script>
  
  <svelte:window on:resize={sizeMapGrid} />
  
  <div class="map-grid-container" style={cssVarStyles}>
    <div class="map-grid {data.class}" class:mirrored-h={flipH} class:mirrored-v={flipV}>
      {#each data.rooms as cell, index (mapTilesheet.sectionStartCell() + index)}
        <div
          class="room"
          class:active={cell.active}
          class:oob={cell.outofbounds}
          on:click={(e) => markRoom(e, cell, index, action)}
          on:contextmenu={(e) => markRoom(e, cell, index, action2)}
        >
          <Overlay action={cell.action} draw={cell.marked} />
        </div>
      {/each}
    </div>
  </div>
  
  <style type="scss">
      @import "../styles/map-grid.scss";
  </style>