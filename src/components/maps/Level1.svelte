<script>
	import { onMount } from 'svelte';
	import { each } from 'svelte/internal';
    import tilesheet from '../tilesheet.js';
    import areamap from '../areamap.js'

    const mapTilesheet = new tilesheet(
        '/images/dungeons-halfscale.png',
        2048, 1408, 16, 16, 6, 6, 33
    );

    const mapState = [
        { outofbounds: true },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: false },
        { outofbounds: true },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: false },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: true },
        { outofbounds: true }
    ];

  const roomStates = ['cleared', 'warp', 'equip', 'quest'];
  const levelQ1Map = new areamap('Level 1', mapTilesheet, roomStates, mapState);

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

	export let name;

	onMount(() => {
    });
</script>

<div style="{cssVarStyles}">
  <h2>{name}</h2>
  <p>xxx rooms.  16x16 tiles.  2048 x 1408 px total.</p>

  <div class="map-grid">
    {#each mapState as cell,index (mapTilesheet.sectionStartCell() + index)}
      <p class="active room" class:oob={cell.outofbounds}></p>
    {/each}
  </div>
</div>

<style>
  .room {
    background-image: url('/images/dungeons-halfscale.png');
  }

  /*  Rows  */
	.room:nth-child(-n+6) {
		background-position-y: calc(2 * 100% / (var(--map-cols) - 1));
	}

  .room:nth-child(n+7):nth-child(-n+12) {
		background-position-y: calc(3 * 100% / (var(--map-cols) - 1));
	}

  .room:nth-child(n+13):nth-child(-n+18) {
		background-position-y: calc(4 * 100% / (var(--map-cols) - 1));
	}

  .room:nth-child(n+19):nth-child(-n+24) {
		background-position-y: calc(5 * 100% / (var(--map-cols) - 1));
	}

  .room:nth-child(n+25):nth-child(-n+30) {
		background-position-y: calc(6 * 100% / (var(--map-cols) - 1));
	}

  .room:nth-child(n+31):nth-child(-n+36) {
		background-position-y: calc(7 * 100% / (var(--map-cols) - 1));
	}

  /*  Columns  */
	.room:nth-child(6n-5) {
		background-position-x: calc(1 * 100% / (var(--map-rows) - 1));
	}

	.room:nth-child(6n-4) {
		background-position-x: calc(2 * 100% / (var(--map-rows) - 1));
	}

  .room:nth-child(6n-3) {
		background-position-x: calc(3 * 100% / (var(--map-rows) - 1));
	}

  .room:nth-child(6n-2) {
		background-position-x: calc(4 * 100% / (var(--map-rows) - 1));
	}

  .room:nth-child(6n-1) {
		background-position-x: calc(5 * 100% / (var(--map-rows) - 1));
	}

  .room:nth-child(6n) {
		background-position-x: calc(6 * 100% / (var(--map-rows) - 1));
	}
</style>