<script>
  export let text;
</script>

{#if text}<span class="premark">{text}</span>{/if}

<style>
  .premark {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    overflow: hidden;
    color: #fff;
    font:
      700 1.25rem/1 "Baloo 2",
      system-ui,
      sans-serif;
    text-shadow: 0 1px 2px #000;
    pointer-events: none;
  }
  :global(.mirrored-h) .premark {
    transform: scaleX(-1);
  }
</style>
