<script>
  import { onMount } from "svelte";
  //import { each } from 'svelte/internal';
  import tilesheet from "../tilesheet.js";
  //import areamap from '../areamap.js'
  import Overlay from "../Overlay.svelte";
  //import mapStore from '../mapStore.js';
  import { mapState } from "./Hyruleq1.mapdata.js";

  //  Props
  export let name;
  export let action = "";
  export let action2 = "";

  //  My state
  let flipH;
  let flipV;

  const mapTilesheet = new tilesheet(
    "/images/hyrule-q1-halfscale.png",
    2048,
    704,
    8,
    16,
    8,
    16,
    0
  );

  //  Initialize this map with the current data store
  //  Um, dynamic mapState data seems to be persisted across component loads/unloads without the following!?!?:

  // let _store = mapStore;
  // _store.init(mapState);

  //const roomStates = ['cleared', 'warp', 'shop', 'potion-shop', 'locked-sword', 'equip', 'quest'];
  // const hyruleQ1Map = new areamap('Hyrule (Q1)', mapTilesheet, roomStates, mapState);

  //  Dynamic style vars
  let styles = {
    "map-cols": 16,
    "map-rows": 8,
    "level-cols": 16,
    "level-rows": 8,
    "shadow-color": "rgb(97, 97, 35)",
    "bg-uri": `url("${mapTilesheet.bguri()}")`,
    aspect: `${mapTilesheet.pxWidth() / mapTilesheet.pxHeight()}`,
  };

  $: cssVarStyles = Object.entries(styles)
    .map(([key, value]) => `--${key}:${value}`)
    .join(";");

  onMount(() => {});

  const markRoom = (e, cell, index, action) => {
    if (cell.active) {
      mapState[index].marked = true;
      mapState[index].action = action;
    }
  };
</script>

<div style={cssVarStyles}>
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
    {#each mapState as cell, index (mapTilesheet.sectionStartCell() + index)}
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
  //TODO: Any way to dynamically assign from css var()s?  emotion.js?
  $maprows: 8;
  $mapcols: 16;
  $levelcols: 16;
  $levelrows: 8;
  $rowoffset: 0;
  $coloffset: 0;

  @import "../../styles/map-grid.scss";

  .room {
    background-image: url(/images/hyrule-q1-halfscale.png);
  }
</style>