<script>
    import toolbars from './toolbars.js';

    //  Props
    export let text;
    // export let isRegion = false;
</script>

{#if text}
    <!-- <div class="overlay" class:region={isRegion}> -->
    <div class="premark">
        <!-- <div class="marked-backdrop"></div> -->
        <div>{text}</div>
    </div>
{/if}

<style type="scss">
  .premark {
    width: 100%;
    height: 100%;
    position: absolute;

    display: flex;
    justify-content: center;
    align-items: center;

    color: rgb(255, 255, 255);
    opacity: 0.9;
    font-size: calc(var(--map-room-height) * 1px);
    white-space: nowrap;
    overflow: hidden;
  }

  /*  Override content flipping if we're in a mirrored map  */
  :global(.mirrored-h .premark) {
    transform: scaleX(-1);
  }
</style>