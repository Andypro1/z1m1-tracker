<script>
    export let action;
    export let draw = false;

    const actionIcons = {
        cleared: 'fa fa-check-circle',
        quest: 'fa fa-trophy',
        warp: 'fa fa-door-open',
        equip: 'fa fa-gavel'
    };

      // e.currentTarget.classList.add('marked');
      // e.currentTarget.classList.add('cleared');
      // e.currentTarget.classList.add('fas');
      // e.currentTarget.classList.add('fa-check-circle');
      // e.currentTarget.classList.remove('active'); 
</script>

{#if draw}
    <div class="overlay">
        <div class="icon {action} {actionIcons[action]}">
        </div>
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

    color: rgb(31, 128, 7);
    font-size: 2rem;

    display: flex;
    justify-content: center; /* align horizontal */
    align-items: center; /* align vertical */
  }

  /* .icon.cleared {
    filter: brightness(75%);
  } */
</style>