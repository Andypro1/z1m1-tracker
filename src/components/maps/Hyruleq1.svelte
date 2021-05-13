<script>
	import { onMount } from 'svelte';
	import { each } from 'svelte/internal';
    import tilesheet from '../tilesheet.js';
    import areamap from '../areamap.js'

    const mapTilesheet = new tilesheet(
        '/images/hyrule-q1-halfscale.png',
        2048, 704, 8, 16, 8, 16, 0
    );

    const mapState = [
        { active: false },
        { active: true },
        { active: false },
        { active: true },
        { active: true },
        { active: true },
        { active: false },
        { active: true },
        { active: false },
        { active: false },
        { active: true },
        { active: true },
        { active: true },
        { active: true },
        { active: true },
        { active: true },

        { active: true },
        { active: false },
        { active: true },
        { active: true },
        { active: true },
        { active: false },
        { active: true },
        { active: false },
        { active: false },
        { active: false },
        { active: true },
        { active: false },
        { active: true },
        { active: true },
        { active: true },
        { active: true },

        { active: false },
        { active: true },
        { active: true },
        { active: true },
        { active: true },
        { active: true },
        { active: true },
        { active: true },
        { active: true },
        { active: false },
        { active: false },
        { active: false },
        { active: true },
        { active: true },
        { active: false },
        { active: true },

        { active: false },
        { active: false },
        { active: false },
        { active: true },
        { active: true },
        { active: false },
        { active: false },
        { active: true },
        { active: false },
        { active: false },
        { active: false },
        { active: false },
        { active: true },
        { active: true },
        { active: false },
        { active: false },

        { active: false },
        { active: false },
        { active: true },
        { active: false },
        { active: true },
        { active: true },
        { active: true },
        { active: true },
        { active: true },
        { active: true },
        { active: true },
        { active: true },
        { active: false },
        { active: true },
        { active: true },
        { active: false },

        { active: false },
        { active: true },
        { active: false },
        { active: false },
        { active: false },
        { active: false },
        { active: true },
        { active: false },
        { active: false },
        { active: false },
        { active: false },
        { active: true },
        { active: false },
        { active: false },
        { active: true },
        { active: false },

        { active: false },
        { active: false },
        { active: true },
        { active: true },
        { active: true },
        { active: false },
        { active: true },
        { active: true },
        { active: true },
        { active: false },
        { active: true },
        { active: true },
        { active: false },
        { active: true },
        { active: false },
        { active: true },

        { active: true },
        { active: true },
        { active: false },
        { active: false },
        { active: true },
        { active: true },
        { active: true },
        { active: true },
        { active: true },
        { active: true },
        { active: false },
        { active: true },
        { active: true },
        { active: true },
        { active: false },
        { active: false }
    ];

    const roomStates = ['cleared', 'warp', 'shop', 'potion-shop', 'locked-sword', 'equip', 'quest'];
    const hyruleQ1Map = new areamap('Hyrule (Q1)', mapTilesheet, roomStates, mapState);

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

	export let name;

	onMount(() => {
  });
</script>

<div style="{cssVarStyles}">
  <h2>{name}</h2>
  <p>128x88 rooms.  8x16 tiles.  2048 x 704 px total.</p>

  <div class="map-grid">
    {#each mapState as cell,index (mapTilesheet.sectionStartCell() + index)}
        <p class="room" class:active={cell.active} class:oob={cell.outofbounds}></p>
    {/each}
  </div>
</div>

<style>
  .room {
    background-image: url(/images/hyrule-q1-halfscale.png);
  }

	/*  Target row cells  */
	.room:nth-child(-n+16) {
		background-position-y: 0;
	}

	.room:nth-child(n+17):nth-child(-n+32) {
		background-position-y: calc(1 * 100% / 7);
	}

	.room:nth-child(n+33):nth-child(-n+48) {
		background-position-y: calc(2 * 100% / 7);
	}

	.room:nth-child(n+49):nth-child(-n+64) {
		background-position-y: calc(3 * 100% / 7);
	}

	.room:nth-child(n+65):nth-child(-n+80) {
		background-position-y: calc(4 * 100% / 7);
	}

	.room:nth-child(n+81):nth-child(-n+96) {
		background-position-y: calc(5 * 100% / 7);
	}

	.room:nth-child(n+97):nth-child(-n+112) {
		background-position-y: calc(6 * 100% / 7);
	}

	.room:nth-child(n+113):nth-child(-n+128) {
		background-position-y: calc(7 * 100% / 7);
	}


	/*  Target column cells  */
	.room:nth-child(16n-15) {
		background-position-x: 0;
	}

	.room:nth-child(16n-14) {
		background-position-x: calc(1 * 100% / 15);
	}

	.room:nth-child(16n-13) {
		background-position-x: calc(2 * 100% / 15);
	}

	.room:nth-child(16n-12) {
		background-position-x: calc(3 * 100% / 15);
	}

	.room:nth-child(16n-11) {
		background-position-x: calc(4 * 100% / 15);
	}

	.room:nth-child(16n-10) {
		background-position-x: calc(5 * 100% / 15);
	}

	.room:nth-child(16n-9) {
		background-position-x: calc(6 * 100% / 15);
	}

	.room:nth-child(16n-8) {
		background-position-x: calc(7 * 100% / 15);
	}

	.room:nth-child(16n-7) {
		background-position-x: calc(8 * 100% / 15);
	}

	.room:nth-child(16n-6) {
		background-position-x: calc(9 * 100% / 15);
	}

	.room:nth-child(16n-5) {
		background-position-x: calc(10 * 100% / 15);
	}

	.room:nth-child(16n-4) {
		background-position-x: calc(11 * 100% / 15);
	}

	.room:nth-child(16n-3) {
		background-position-x: calc(12 * 100% / 15);
	}

	.room:nth-child(16n-2) {
		background-position-x: calc(13 * 100% / 15);
	}

	.room:nth-child(16n-1) {
		background-position-x: calc(14 * 100% / 15);
	}

	.room:nth-child(16n) {
		background-position-x: calc(15 * 100% / 15);
	}
</style>