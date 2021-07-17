<script>
    import toolbars from './toolbars.js';
    import Warp from "./WarpUnderlay.svelte";

    //  Props
    export let action;
    export let draw     = false;
    export let custom;
    export let isRegion = false;
    export let notAcquired = false;

    const actList = $toolbars.allActions();
</script>

{#if draw}
    <div class="overlay" class:region={isRegion}>
        {#if typeof actList[action].warpText === 'undefined'}
          <div class="marked-backdrop"></div>
        {/if}
        {#if actList[action].mapClass}
          <i class="backdrop-icon {action} {actList[action] && actList[action].mapClass}"></i>
        {/if}
        {#if actList[action].warpText && (typeof actList[action].spriteIndex !== 'undefined')}
          <Warp spriteIndex={actList[action].spriteIndex} />
        {:else if actList[action] && actList[action].spriteIndex }
          <div class="icon {action} sprite-index{actList[action].spriteIndex}"></div>
        {/if}
        {#if actList[action] && (actList[action].mapText || actList[action].warpText) }
          <div class:label={actList[action].mapText} class:warp-label={actList[action].warpText}>
            <b>{actList[action].mapText || actList[action].warpText}</b>
          </div>
        {/if}
        {#if notAcquired}
          <i class="backdrop-icon notAcquired fas fa-asterisk"></i>
        {/if}
    </div>
{/if}

{#if custom}
    <div class="custom custom{custom}"></div>
{/if}

<style type="scss">
  /*  Marked map action styles  */
  .overlay {
    width: 100%;
    padding-bottom: calc(100% * 1 / var(--aspect) * var(--map-cols) / var(--map-rows));
    font-family: 'Baloo 2', cursive;
		font-weight: 600;

    overflow: hidden;
  }

  //  Overrides for grid regions
  .overlay.region {
    padding-bottom: 0;
    height: 100%;
  }

  /*  Override content flipping if we're in a mirrored map  */
  :global(.mirrored-h .overlay) {
    transform: scaleX(-1);
  }

  .backdrop-icon {
    width: 95%;
    height: 90%;

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    opacity: 0.7;
    z-index: -10;
    display: block;
    font-size: calc(var(--map-room-height) * 0.8px);

    display: flex;
    justify-content: center; /* align horizontal */
    align-items: center; /* align vertical */
  }

  .marked-backdrop {
    width: 95%;
    height: 90%;

    background: black;
    .zebes .overlay & { background-color: rgb(216, 216, 216); }    

    border-radius: 2rem;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    opacity: 0.7;
    z-index: -10;
  }

  .custom {
    position: absolute;
    top: 0; left: 0;

    width: 100%;
    height: calc(var(--map-room-height) * 1px);

    &.custom1 {
      box-shadow: inset 0 0 0.5rem 0.3rem red;
    }

    &.custom2 {
      box-shadow: inset 0 0 0.5rem 0.3rem rgb(0, 89, 255);
    }
  }

  .label {
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 20;

      color: rgb(255, 255, 255);
      font-size: calc(var(--map-room-height) * 1px);
      padding-top: calc(var(--map-room-height) * 0.005rem);
      white-space: nowrap;
      overflow: hidden;

      display: flex;
      justify-content: center; /* align horizontal */
      align-items: center; /* align vertical */
  }

  .warp-label {
    width: 100%;
    height: 100%;
    position: absolute;

    color: rgb(255, 255, 255);
    font-size: calc(var(--map-room-height) * 0.20px);
    white-space: nowrap;
    overflow: hidden;

    display: flex;
    justify-content: center;
    align-items: flex-end;
  }

  .backdrop-icon.cleared {
    color: rgb(132, 192, 117);

    font-size: 1rem;

    display: flex;
    justify-content: left; /* align horizontal */
    align-items: flex-start; /* align vertical */
  }

  .backdrop-icon.notAcquired {
    color: rgb(238, 255, 0);

    font-size: 1rem;

    opacity: 1;
    z-index: 30;

    display: flex;
    justify-content: flex-end; /* align horizontal */
    align-items: flex-start; /* align vertical */
  }

  .backdrop-icon.cleared::before,
  .backdrop-icon.notAcquired::before {
    margin: calc(var(--map-room-height) * 0.005brem);
  }

  .backdrop-icon.quest {
    color: rgb(241, 221, 40);
  }

  .backdrop-icon.warp {
    color: rgb(145, 184, 235);
  }

  .backdrop-icon.equip {
    color: rgb(190, 177, 158);
  }

  .backdrop-icon.shop {
		background-position-x: 0;
  }

  //  Icon art for each equipment type  \\
  .icon {
    position: absolute;
    width: calc(var(--map-room-height) * 0.8px);
    height: 80%;
    z-index: 10;

    top: 0; left: 0; right: 0; bottom: 0;
    margin: auto;

    background: url(/images/sprites-16px.png) no-repeat;
    background-size: auto 100%;
    image-rendering: crisp-edges;
    image-rendering: pixelated;

    //  Class rules for each sprite in sprites-16px.png
		@for $i from 0 through 39 {
			&.sprite-index#{$i} {
				background-position: calc(#{$i} * 100% / 61.5);
			}
		}
  }
</style>