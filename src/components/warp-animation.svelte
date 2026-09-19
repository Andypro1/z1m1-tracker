<script>
  import WarpUnderlay from "./WarpUnderlay.svelte";
</script>

<main class="grid">
  {#each [0, 1, 2, 3, 13, 14, 6, 7, 8] as spriteIndex}
    <div class="cell"><WarpUnderlay {spriteIndex} /></div>
  {/each}
</main>

<style>
  :global(body) {
    background: #222;
  }
  .grid {
    min-height: 100dvh;
    display: grid;
    grid-template-columns: repeat(3, minmax(5rem, 9rem));
    place-content: center;
    gap: clamp(1rem, 4vw, 3rem);
    padding: 2rem;
  }
  .cell {
    position: relative;
    aspect-ratio: 1;
    container-type: size;
  }
</style>
