<script>
  import toolbars from "./toolbars.js";
  import Shop from "./ShopUnderlay.svelte";
  import Warp from "./WarpUnderlay.svelte";

  export let action;
  export let draw = false;
  export let custom;
  export let isRegion = false;
  export let notAcquired = false;
  $: actionData = $toolbars.allActions()[action] ?? {};
</script>

{#if draw}
  <div class="overlay" class:region={isRegion}>
    {#if actionData.warpText === undefined}<div
        class="marked-backdrop"
      ></div>{/if}
    {#if action === "cleared"}<span class="cleared" aria-label="Cleared">✓</span
      >{/if}
    {#if actionData.warpText !== undefined && actionData.spriteIndex !== undefined}
      <Warp spriteIndex={actionData.spriteIndex} />
    {:else if actionData.spriteIndex !== undefined && actionData.shopText !== undefined}
      <Shop spriteIndex={actionData.spriteIndex} />
    {:else if actionData.spriteIndex !== undefined}
      <i
        class="sprite"
        style={`--sprite-index:${actionData.spriteIndex}`}
        aria-hidden="true"
      ></i>
    {/if}
    {#if actionData.mapText || actionData.warpText || actionData.shopText}
      <b class:small-label={actionData.warpText || actionData.shopText}
        >{actionData.mapText || actionData.warpText || actionData.shopText}</b
      >
    {/if}
    {#if notAcquired}<span class="not-acquired" aria-label="Not acquired"
        >✱</span
      >{/if}
  </div>
{/if}

{#if custom}<div class="custom custom{custom}"></div>{/if}

<style>
  .overlay,
  .custom {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }
  .overlay {
    container-type: size;
    isolation: isolate;
  }
  :global(.mirrored-h) .overlay,
  :global(.mirrored-h) .custom {
    transform: scaleX(-1);
  }
  .marked-backdrop {
    position: absolute;
    inset: 6%;
    z-index: 0;
    border-radius: 28%;
    background: #000b;
  }
  :global(.zebes) .marked-backdrop {
    background: #d8d8d8c7;
  }
  .sprite {
    position: absolute;
    z-index: 1;
    left: 50%;
    top: 50%;
    width: min(80cqw, 80cqh);
    aspect-ratio: 1;
    transform: translate(-50%, -50%);
    background: url("/images/sprites-16px.png") no-repeat;
    background-size: auto 100%;
    background-position-x: calc(var(--sprite-index) * 100% / 61.5);
    image-rendering: pixelated;
  }
  b {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: grid;
    place-items: center;
    color: #fff;
    overflow: hidden;
    padding-inline: 0.15rem;
    font-size: 1.25rem;
    line-height: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-shadow: 0 1px 2px #000;
  }
  b.small-label {
    align-items: end;
    padding-bottom: 0.2rem;
    font-size: 0.75rem;
  }
  .cleared,
  .not-acquired {
    position: absolute;
    z-index: 3;
    display: grid;
    width: 1.5rem;
    height: 1.5rem;
    place-items: center;
    font:
      800 1.25rem/1 system-ui,
      sans-serif;
    text-shadow: 0 1px 2px #000;
  }
  .cleared {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #9fe38d;
  }
  .not-acquired {
    right: 2%;
    top: 2%;
    color: #fff500;
  }
  .custom {
    box-shadow: inset 0 0 0 0.18rem #f33;
  }
  .custom2 {
    box-shadow: inset 0 0 0 0.18rem #397dff;
  }
</style>
