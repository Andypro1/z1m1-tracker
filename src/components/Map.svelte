<script>
    import { onMount } from "svelte";
    //import { each } from 'svelte/internal';
    import tilesheet from "./tilesheet.js";
    //import areamap from '../areamap.js'
    import Overlay from "./Overlay.svelte";
    //import mapStore from '../mapStore.js';
    import { actions } from '../services/tracker.js';
    import toolbars from './toolbars.js';

    //  Props
    export let data = {};
    export let layout;
    export let trackerUpdated;
    export let handleHotkey;
    export let handleMouseMark;
  
    //  My state
    let initialLoad = false;
    let rMap;  //  Map display ratio for calculating layout
    let mouseInMap = false;
    let [mouseX, mouseY] = [0, 0];

    $: styles = {
        "map-cols": data.cols,
        "map-rows": data.rows,
        "level-cols": data.sectionCols,
        "level-rows": data.sectionRows,
        "shadow-color": data.shadowColor,
        aspect: `${mapTilesheet.pxWidth() / mapTilesheet.pxHeight()}`,
    };

    //  Assign every dungeon and zebes room as active
    $: data.class.match(/(?:dungeon)|(?:zebes)/) && data.rooms.forEach(r => r.active = true);

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
  
    $: rMap = (mapTilesheet.pxWidth() * (mapTilesheet.sectionCols() / mapTilesheet.tileCols()) + (mapTilesheet.sectionCols() - 1)) /
           (mapTilesheet.pxHeight() * (mapTilesheet.sectionRows() / mapTilesheet.tileRows()) + (mapTilesheet.sectionRows() - 1));

    onMount(() => {
        sizeMapGrid();
        initialLoad = true;
    });

    $: cssVarStyles = Object.entries(styles)
      .map(([key, value]) => `--${key}:${value}`)
      .join(";");

    $: getRooms = () => {
        if(!data.isHflipped && !data.isVflipped)
            return data.rooms.map((r, i) => ({...r, roomIndex: i}));

        if(data.isHflipped && !data.isVflipped) {
            return data.rooms.map((r, i) => {
                const newSpot = ((data.sectionCols * Math.floor(i / data.sectionCols)) + data.sectionCols - 1) - (i % data.sectionCols);

                return {...data.rooms[newSpot], roomIndex: newSpot };
            });
        }

        if(data.isVflipped && !data.isHflipped) {
            const tmp = data.rooms
            .map((r, i) => {
                const newSpot = (Math.abs(data.sectionRows * data.sectionCols - i - 1));
                return {...data.rooms[newSpot], roomIndex: newSpot };
            });

            return tmp.map((r, i, a) => {
                const newSpot = ((data.sectionCols * Math.floor(i / data.sectionCols)) + data.sectionCols - 1) - (i % data.sectionCols);
                return a[newSpot];
            });
        }

        if(data.isVflipped && data.isHflipped) {
            return data.rooms
            .map((r, i) => {
                const newSpot = (Math.abs(data.sectionRows * data.sectionCols - i - 1));
                return {...data.rooms[newSpot], roomIndex: newSpot };
            });
        }

        return data.rooms.map((r, i) => ({...r, roomIndex: i}));
    };

    
    const markRoom = (roomIndex, cell, action) => {
      if(!cell.active || cell.outofbounds)
        return;

      const wasMarked = data.rooms[roomIndex].marked;

      data.rooms[roomIndex].marked = !wasMarked;
      data.rooms[roomIndex].action = action;

      $toolbars.setSubToolbar(action);
      $toolbars = $toolbars;

      trackerUpdated();

      if(!wasMarked)
        handleMouseMark(roomIndex, cell, action, mouseX, mouseY);
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
  
  <svelte:window on:resize={sizeMapGrid} on:keydown="{(e) => handleHotkey(e, mouseInMap, mouseX, mouseY)}" />
  
  <div class="map-grid-container" style={cssVarStyles}>
    <div class="map-grid {data.class}"
      on:mousemove={(e) => { mouseX = e.pageX; mouseY = e.pageY; }} on:mouseenter={() => mouseInMap = true } on:mouseleave={() => mouseInMap = false }
      class:mirrored-h={data.isHflipped} class:mirrored-v={data.isVflipped}>
      {#each getRooms() as cell}
        <div
          class="room"
          class:active={cell.active}
          class:oob={cell.outofbounds}
          data-room-index={cell.roomIndex}
          on:mousedown={(e) => {
            e.preventDefault();
            e.stopPropagation();

            if((e.button >= 0 && e.button !== 3) && $actions[e.button])
              markRoom(cell.roomIndex, cell, $actions[e.button]);
          }}
        >
          <Overlay action={cell.action} draw={cell.marked} />
        </div>
      {/each}
    </div>
  </div>
  
  <style type="scss">
      @import "../styles/map-grid.scss";
  </style>