<script>
    import { onMount } from "svelte";
    import tilesheet from "./tilesheet.js";
    import Overlay from "./Overlay.svelte";
    import Premark from "./Premark.svelte";
    import { actions, updateMapData } from '../services/tracker.js';
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
        setTimeout(sizeMapGrid, 0);
        initialLoad = true;
    });


    $: cssVarStyles = Object.entries(styles)
      .map(([key, value]) => `--${key}:${value}`)
      .join(";");


    $: getGridPosStyles = (pos) => {
      const row = Math.floor(pos / data.sectionCols);
      const col = pos - (row * data.sectionCols);

      return `
        grid-row: ${row+1};
        grid-column: ${col+1};
      `;
    };

    $: getRooms = () => {
        if(!data.isHflipped && !data.isVflipped)
            return data.rooms.map((r, i) => ({...r, areaId: i}));

        if(data.isHflipped && !data.isVflipped) {
            return data.rooms.map((r, i) => {
                const newSpot = ((data.sectionCols * Math.floor(i / data.sectionCols)) + data.sectionCols - 1) - (i % data.sectionCols);

                return {...data.rooms[newSpot], areaId: newSpot };
            });
        }

        if(data.isVflipped && !data.isHflipped) {
            const tmp = data.rooms
            .map((r, i) => {
                const newSpot = (Math.abs(data.sectionRows * data.sectionCols - i - 1));
                return {...data.rooms[newSpot], areaId: newSpot };
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
                return {...data.rooms[newSpot], areaId: newSpot };
            });
        }

        return data.rooms.map((r, i) => ({...r, areaId: i}));
    };


    const areaClick = (e, area, areaId) => {
      e.preventDefault();
      e.stopPropagation();

      //  Guard clause
      if(!(e.button >= 0 && e.button !== 3) || !$actions[e.button])
        return;

      const areaType = area.rowStart ? 'region' : 'room';
      const arrIndex = areaType === 'room' ? areaId : areaId - data.rooms.length;

      if(areaType === 'room' && (!area.active || area.outofbounds))
        return;

      let wasMarked = areaType === 'region' ? data.gridRegions[arrIndex].marked : data.rooms[arrIndex].marked;

      //  Special case(s) for actions that should not toggle the marked state
      wasMarked = $actions[e.button] === 'notYetAcquired' ? !wasMarked : wasMarked;

      updateMapData(areaId, !wasMarked, $actions[e.button]);
      data = data;

      $toolbars.setSubToolbar($actions[e.button]);
      $toolbars = $toolbars;

      handleMouseMark(areaId, area, $actions[e.button], mouseX, mouseY, wasMarked);
    };


    const sizeMapGrid = () => {
      const errorPx = 30;
      const [wWin, hWin, hTopBar] = [window.innerWidth, window.innerHeight, document.querySelector('.top-bar').clientHeight + errorPx];
      const ASSUMED_CARD_PAIR_SIZE = 255;
  
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
  
      const rPad = (mapTilesheet.sectionCols() - 1);
      const bPad = (mapTilesheet.sectionRows() - 1);

      layout(SCMapArea > BCMapArea ?
             {name: 'side',
              width: (wSCNewMap - rPad) / mapTilesheet.sectionCols(),
              height: (hSCNewMap - bPad) / mapTilesheet.sectionRows(),
              rightPad: rPad,
              bottomPad: bPad,
              fullWidth: wSCNewMap,
              fullHeight: hSCNewMap
            } :
             { name: 'bottom',
                width: (wBCNewMap - rPad) / mapTilesheet.sectionCols(),
                height: (hBCNewMap - bPad) / mapTilesheet.sectionRows(),
                rightPad: rPad,
                bottomPad: bPad,
                fullWidth: wBCNewMap,
                fullHeight: hBCNewMap
            });
    };
  </script>
  
  <svelte:window on:resize={sizeMapGrid} on:keydown="{(e) => handleHotkey(e, mouseInMap, mouseX, mouseY)}" />
  
  <div class="map-grid-container" style={cssVarStyles}>
    <div class="map-grid {data.class}"
      on:mousemove={(e) => { mouseX = e.clientX; mouseY = e.clientY; }} on:mouseenter={() => mouseInMap = true } on:mouseleave={() => mouseInMap = false }
      class:mirrored-h={data.isHflipped} class:mirrored-v={data.isVflipped}>
      {#each getRooms() as cell, pos}
        {#if !cell.outofbounds}
          <div
            class="room"
            class:active={cell.active}
            class:oob={cell.outofbounds}
            data-area-id={cell.areaId}
            style={getGridPosStyles(pos)}
            on:mousedown={(e) => areaClick(e, cell, cell.areaId)}
          >
            {#if !cell.marked && cell.premark}
              <Premark text={cell.premark} />
            {/if}

            <Overlay action={cell.action} draw={cell.marked} notAcquired={cell.notAcquired} />
          </div>
        {:else}
          <div></div>
        {/if}
      {/each}
      {#if data.gridRegions}
        {#each data.gridRegions as region, pos}
        <!--  TODO: refactor me pleeeeeeeeeeeeeease  -->
        {#if data.isHflipped && data.isVflipped}
        <div
          class="grid-region"
          data-area-id={data.rooms.length + pos}
          style="background-size: {region.bgSize}; background-position-x: {region.bgPosX}; background-position-y: {region.bgPosY}; grid-row: {data.sectionRows - region.rowStart + 1} / {data.sectionRows - region.rowEnd + 1}; grid-column: {data.sectionCols - region.colEnd + 2} / {data.sectionCols - region.colStart + 2};"
          on:mousedown={(e) => areaClick(e, region, data.rooms.length + pos)}
          >
          {#if !region.marked && region.premark}
            <Premark text={region.premark} />
          {/if}

          <Overlay action={region.action} draw={region.marked} notAcquired={region.notAcquired} isRegion="true" />
        </div>
          {:else if data.isVflipped}
            <div
              class="grid-region"
              data-area-id={data.rooms.length + pos}
              style="background-size: {region.bgSize}; background-position-x: {region.bgPosX}; background-position-y: {region.bgPosY}; grid-row: {data.sectionRows - region.rowStart + 1} / {data.sectionRows - region.rowEnd + 1}; grid-column: {region.colStart} / {region.colEnd};"
              on:mousedown={(e) => areaClick(e, region, data.rooms.length + pos)}
              >
              {#if !region.marked && region.premark}
                <Premark text={region.premark} />
              {/if}

              <Overlay action={region.action} draw={region.marked} notAcquired={region.notAcquired} isRegion="true" />
            </div>
          {:else if data.isHflipped}
            <div
              class="grid-region"
              data-area-id={data.rooms.length + pos}
              style="background-size: {region.bgSize}; background-position-x: {region.bgPosX}; background-position-y: {region.bgPosY}; grid-row: {region.rowStart} / {region.rowEnd}; grid-column: {data.sectionCols - region.colEnd + 2} / {data.sectionCols - region.colStart + 2};"
              on:mousedown={(e) => areaClick(e, region, data.rooms.length + pos)}
              >
              {#if !region.marked && region.premark}
                <Premark text={region.premark} />
              {/if}

              <Overlay action={region.action} draw={region.marked} notAcquired={region.notAcquired} isRegion="true" />
            </div>
          {:else}
            <div
              class="grid-region"
              data-area-id={data.rooms.length + pos}
              style="background-size: {region.bgSize}; background-position-x: {region.bgPosX}; background-position-y: {region.bgPosY}; grid-row: {region.rowStart} / {region.rowEnd}; grid-column: {region.colStart} / {region.colEnd};"
              on:mousedown={(e) => areaClick(e, region, data.rooms.length + pos)}
              >
              {#if !region.marked && region.premark}
                <Premark text={region.premark} />
              {/if}
              
              <Overlay action={region.action} draw={region.marked} notAcquired={region.notAcquired} isRegion="true" />
            </div>
          {/if}
        {/each}
      {/if}
    </div>
  </div>
  
  <style type="scss">
    @import "../styles/map-grid.scss";

    .grid-region {
      position: relative;
      align-self: stretch;
      z-index: 2;

      .zebes & {
        background-image: url(/images/zebes-quarterscale.png);
      }

      &:hover {
        z-index: 10;
        cursor: pointer;

        filter: drop-shadow(10px 10px 10px var(--shadow-color));
        -webkit-animation: scale-up-center 0.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
        animation: scale-up-center 0.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
      }

      &.active {
		    filter: saturate(120%);
      }
    }

    .mirrored-h .grid-region {
      transform: scaleX(-1);

      &:hover {
        -webkit-animation: mirrored-scale-up-center 0.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
        animation: mirrored-scale-up-center 0.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
      }
    }
  </style>