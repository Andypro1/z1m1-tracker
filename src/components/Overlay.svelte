<script>
    import toolbars from './toolbars.js';

    //  Props
    export let action;
    export let draw     = false;
    export let isRegion = false;

    const actList = $toolbars.allActions();

    //  Dynamic style vars
    // let ovstyles = {
    //   'cols': 13,
    //   'rows': 1
    // };

    // $: cssOvStyles = Object.entries(ovstyles)
		// .map(([key, value]) => `--${key}:${value}`)
		// .join(';');
</script>

{#if draw}
    <div class="overlay" class:region={isRegion}>
        <i class="icon {action} {actList[action] && actList[action].mapClass}"></i>
        {#if actList[action] && actList[action].mapText }
          <div class="label"><b>{actList[action] && actList[action].mapText}</b></div>
        {/if}
        {#if actList[action] && actList[action].image }
          <div class="iconimage"></div>
        {/if}
    </div>
{/if}

<style type="scss">
  /*  Marked map action styles  */
  .overlay {
    width: 100%;
    padding-bottom: calc(100% * 1 / var(--aspect) * var(--map-cols) / var(--map-rows));
    /*  needs to be done on the parent in order to affect the background-image.  Not important for now  */
    /* filter: opacity(70%) saturate(70%); */
    /* opacity: 0.5; */

    font-family: 'Baloo 2', cursive;
		font-weight: 600;
  }

  //  Overrides for grid regions
  .overlay.region {
    padding-bottom: 0;
    height: 100%;

    .zebes & .icon {
      background: rgb(216, 216, 216);
      border-radius: 0.7rem;

      width: 95%;
      height: 90%;
    }
  }

  /*  Override content flipping if we're in a mirrored map  */
  :global(.mirrored-h .overlay) {
    transform: scaleX(-1);
  }

  .zebes .overlay .icon {
      background-color: rgb(216, 216, 216);
  }

  .icon {
    width: 95%;
    height: 90%;
    
    background: black;
    border-radius: 2rem;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    opacity: 0.7;
    z-index: -10;

    font-size: 2rem;

    display: flex;
    justify-content: center; /* align horizontal */
    align-items: center; /* align vertical */
  }

  .overlay .label {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;

      color: rgb(255, 255, 255);

      display: flex;
        justify-content: center; /* align horizontal */
        align-items: center; /* align vertical */
  }

  .label b {
    height: 100%;
    margin: auto;
    overflow: hidden;
    text-align: center;
  }

  .label b::first-letter {
      font-size: 3rem;
      text-transform: uppercase;
  }

  .icon.cleared {
    color: rgb(132, 192, 117);
    /* filter: brightness(75%); */

    font-size: 1rem;

    display: flex;
    justify-content: left; /* align horizontal */
    align-items: flex-start; /* align vertical */
  }

  .icon.cleared::before {
    margin: 0.45rem;
  }

  .icon.quest {
    color: rgb(241, 221, 40);
  }

  .icon.warp {
    color: rgb(145, 184, 235);
  }

  .icon.equip {
    color: rgb(190, 177, 158);
  }

  .icon.shop {
		background-position-x: 0;
  }

  .iconimage {
    position: absolute;
    left: 0; right: 0; top: 0; bottom: 0;
    margin: auto;
    background-image: url(/images/loz-npcs.png);
    background-size: calc(var(--cols) * 100%) calc(var(--rows) * 100%);
    width: 32px;
    height: 32px;

    z-index: -1;
  }
</style>