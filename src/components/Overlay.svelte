<script>
    export let action;
    export let draw = false;

    const actionIcons = {
        cleared: { classes: 'fas fa-check-circle' },
        quest: { classes: 'fas fa-trophy', text: 'quest' },
        warp: { classes: 'fas fa-door-open', text: 'warp' },
        equip: { classes: 'fas fa-gavel', text: 'equip' },
        shop: { image: true, text: 'shop' },
        potionShop: { text: 'p.shop' },
        lockedSword: { text: 'sword' }
    };

    //  Dynamic style vars
    let ovstyles = {
      'cols': 13,
      'rows': 1
    };

    $: cssOvStyles = Object.entries(ovstyles)
		.map(([key, value]) => `--${key}:${value}`)
		.join(';');
</script>

{#if draw}
    <div class="overlay" style={cssOvStyles}>
        <i class="icon {action} {actionIcons[action].classes}"></i>
        {#if actionIcons[action].text }
          <div class="label"><b>{actionIcons[action].text}</b></div>
        {/if}
        {#if actionIcons[action].image }
          <div class="iconimage"></div>
        {/if}
    </div>
{/if}

<style>
  /*  Marked map action styles  */
  .overlay {
    /* filter: brightness(15%); */
    width: 100%;
    padding-bottom: calc(100% * 1 / var(--aspect) * var(--map-cols) / var(--map-rows));
    /*  needs to be done on the parent in order to affect the background-image.  Not important for now  */
    /* filter: opacity(70%) saturate(70%); */
    /* opacity: 0.5; */

    font-family: 'Baloo 2', cursive;
		font-weight: 600;
  }

  .icon {
    width: calc(100% - 0.5rem);
    height: calc(100% - 0.5rem);
    background: black;
    border-radius: 50%;
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

  /* .icon.shop img {
    clip-path: inset(0 60px 0 0);
    object-fit: cover;
    margin: auto;
  } */
</style>