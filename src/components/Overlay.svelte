<script>
    export let action;
    export let draw = false;

    const actionIcons = {
        cleared: 'fas fa-check-circle',
        quest: 'fas fa-trophy',
        warp: 'fas fa-door-open',
        equip: 'fas fa-gavel'
    };
</script>

{#if draw}
    <div class="overlay">
        <i class="icon {action} {actionIcons[action]}"></i>
        <div class="label"><b>{action}</b></div>
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
      font-size: 4rem;
      text-transform: uppercase;
  }

  .icon.cleared {
    color: rgb(132, 192, 117);
    /* filter: brightness(75%); */
  }

  .icon.quest {
    color: rgb(241, 221, 40);
  }

  /* .icon.quest::before {
      content: 'Q';
  } */

  .icon.warp {
    color: rgb(145, 184, 235);
  }

  .icon.equip {
    color: rgb(190, 177, 158);
  }
</style>