<script>
	import { onMount } from 'svelte';
	import { each } from 'svelte/internal';
    import tilesheet from '../tilesheet.js';
    import areamap from '../areamap.js'

    const mapTilesheet = new tilesheet(
        '/images/zebes-quarterscale.png',
        1920, 1800, 30, 30, 15, 12, 421
    );

    const mapState = [
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: false },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: false },
        { outofbounds: true },

        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: true },

        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: true },

        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: true },

        { outofbounds: false },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: false },
        { outofbounds: false },
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
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: true },

        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: true },

        { outofbounds: false },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: false },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: false },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: false },

        { outofbounds: false },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
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
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: false },
        { outofbounds: true },
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
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: true },
        { outofbounds: false },
        { outofbounds: false },

        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },

        { outofbounds: false },
        { outofbounds: true },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },

        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },
        { outofbounds: false },

        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: true },
        { outofbounds: false }
    ];

  const roomStates = ['cleared', 'warp', 'equip', 'quest'];
  const levelQ1Map = new areamap('Kraid\'s Lair', mapTilesheet, roomStates, mapState);

    //  Dynamic style vars
    let styles = {
      'map-cols': 30,
      'map-rows': 30,
      'level-cols': 12,
      'level-rows': 15,
      'shadow-color': 'rgb(32, 56, 236)',
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
  <p>195 rooms.  30x30 tiles.  1920 x 1800 px total.</p>

  <div class="grid-container">
    {#each mapState as cell,index (mapTilesheet.sectionStartCell() + index)}
      <p class="hyrule-q1" class:active={cell.active} class:oob={cell.outofbounds}></p>
    {/each}
  </div>
</div>

<style>
  .oob {
    opacity: 0;
  }

  /* .hyrule-q1:not(.oob) {
		filter: saturate(120%)
	} */

	/* .hyrule-q1:not(.active) {
		filter: opacity(70%) saturate(70%)
	} */

	.hyrule-q1:not(.oob):hover {
		z-index: 10;
		cursor: pointer;

		filter: drop-shadow(10px 10px 10px var(--shadow-color));
		-webkit-animation: scale-up-center 0.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
		animation: scale-up-center 0.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
	}

  /* ----------------------------------------------
  * Generated by Animista on 2021-5-8 23:11:36
  * Licensed under FreeBSD License.
  * See http://animista.net/license for more info. 
  * w: http://animista.net, t: @cssanimista
  * ---------------------------------------------- */

  /**
  * ----------------------------------------
  * animation scale-up-center
  * ----------------------------------------
  */
  @-webkit-keyframes scale-up-center {
    0% {
      -webkit-transform: scale(1);
              transform: scale(1);
    }
    100% {
      -webkit-transform: scale(1.15);
              transform: scale(1.15);
    }
  }
  @keyframes scale-up-center {
    0% {
      -webkit-transform: scale(1);
              transform: scale(1);
    }
    100% {
      -webkit-transform: scale(1.15);
              transform: scale(1.15);
    }
  }

	.grid-container {
		display: grid;
    grid-template-columns: repeat(var(--level-cols), calc(100% / var(--level-cols)));
		grid-template-rows: repeat(var(--level-rows), calc(100% / var(--level-rows)));
		gap: 1px;
		aspect-ratio: var(--aspect);
    background-color: black;
	}

	.hyrule-q1 {
		display: flex;
		flex-direction: column;
		flex: 1;
    background: url(/images/zebes-quarterscale.png);
		background-size: calc(var(--map-cols) * 100%) calc(var(--map-rows) * 100%);
	}


  /*  Rows  */
	.hyrule-q1:nth-child(-n+12) {
		background-position-y: calc(15 * 100% / (var(--map-cols) - 1));
	}

  .hyrule-q1:nth-child(n+13):nth-child(-n+24) {
		background-position-y: calc(16 * 100% / (var(--map-cols) - 1));
	}

  .hyrule-q1:nth-child(n+25):nth-child(-n+36) {
		background-position-y: calc(17 * 100% / (var(--map-cols) - 1));
	}

  .hyrule-q1:nth-child(n+37):nth-child(-n+48) {
		background-position-y: calc(18 * 100% / (var(--map-cols) - 1));
	}

  .hyrule-q1:nth-child(n+49):nth-child(-n+60) {
		background-position-y: calc(19 * 100% / (var(--map-cols) - 1));
	}

  .hyrule-q1:nth-child(n+61):nth-child(-n+72) {
		background-position-y: calc(20 * 100% / (var(--map-cols) - 1));
	}

  .hyrule-q1:nth-child(n+73):nth-child(-n+84) {
		background-position-y: calc(21 * 100% / (var(--map-cols) - 1));
	}

  .hyrule-q1:nth-child(n+85):nth-child(-n+96) {
		background-position-y: calc(22 * 100% / (var(--map-cols) - 1));
	}

  .hyrule-q1:nth-child(n+97):nth-child(-n+108) {
		background-position-y: calc(23 * 100% / (var(--map-cols) - 1));
	}

  .hyrule-q1:nth-child(n+109):nth-child(-n+120) {
		background-position-y: calc(24 * 100% / (var(--map-cols) - 1));
	}

  .hyrule-q1:nth-child(n+121):nth-child(-n+132) {
		background-position-y: calc(25 * 100% / (var(--map-cols) - 1));
	}

  .hyrule-q1:nth-child(n+133):nth-child(-n+144) {
		background-position-y: calc(26 * 100% / (var(--map-cols) - 1));
	}

  .hyrule-q1:nth-child(n+145):nth-child(-n+156) {
		background-position-y: calc(27 * 100% / (var(--map-cols) - 1));
	}

  .hyrule-q1:nth-child(n+157):nth-child(-n+168) {
		background-position-y: calc(28 * 100% / (var(--map-cols) - 1));
	}

  .hyrule-q1:nth-child(n+169):nth-child(-n+180) {
		background-position-y: calc(29 * 100% / (var(--map-cols) - 1));
	}

  /*  Columns  */
  .hyrule-q1:nth-child(12n-11) {
		background-position-x: 0;
	}

  .hyrule-q1:nth-child(12n-10) {
		background-position-x: calc(1 * 100% / (var(--map-rows) - 1));
	}

  .hyrule-q1:nth-child(12n-9) {
		background-position-x: calc(2 * 100% / (var(--map-rows) - 1));
	}

  .hyrule-q1:nth-child(12n-8) {
		background-position-x: calc(3 * 100% / (var(--map-rows) - 1));
	}

  .hyrule-q1:nth-child(12n-7) {
		background-position-x: calc(4 * 100% / (var(--map-rows) - 1));
	}

  .hyrule-q1:nth-child(12n-6) {
		background-position-x: calc(5 * 100% / (var(--map-rows) - 1));
	}

  .hyrule-q1:nth-child(12n-5) {
		background-position-x: calc(6 * 100% / (var(--map-rows) - 1));
	}

  .hyrule-q1:nth-child(12n-4) {
		background-position-x: calc(7 * 100% / (var(--map-rows) - 1));
	}

  .hyrule-q1:nth-child(12n-3) {
		background-position-x: calc(8 * 100% / (var(--map-rows) - 1));
	}

  .hyrule-q1:nth-child(12n-2) {
		background-position-x: calc(9 * 100% / (var(--map-rows) - 1));
	}

  .hyrule-q1:nth-child(12n-1) {
		background-position-x: calc(10 * 100% / (var(--map-rows) - 1));
	}

  .hyrule-q1:nth-child(12n) {
		background-position-x: calc(11 * 100% / (var(--map-rows) - 1));
	}
</style>