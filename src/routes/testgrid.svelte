<script>
    import sizing from '../libs/items-sizing';

    let w, h;

    $: cells = Array.from({ length: 46 }, (x, i) => i);

    $: gridSize = sizing(w, h, cells.length);

    //  Dynamic style vars
    $: styles = {
      'num-cells': cells.length,
      'grid-height': '10rem',
      'grid-rows': gridSize.rows,
      'grid-columns': gridSize.cols,
      'cell-size': `${gridSize.cellSize}px`,
    };

    $: cssVarStyles = Object.entries(styles)
		.map(([key, value]) => `--${key}:${value}`)
		.join(';');
</script>

<div class="container">
    <aside>hi</aside>
<main class="bg-lime-300" style={cssVarStyles} bind:clientWidth={w} bind:clientHeight={h}>
    {#each cells as cell }
        <div>{w}, {h}</div>
    {/each}
</main>
    <aside>hi</aside>
</div>

<style>
    :global(body) {
        background-color: hsl(180, 50%, 90%);
    }

    aside {
        flex: 0 0 auto;

        /* padding: 6rem; */
        height: 10rem;
        width: 10rem;
        border: 1px solid blue;
    }

    .container {
        display: flex;
        justify-content: space-between;

        /* width: 100%; */
        border: 1px dashed gray;
    }

    main {
        flex: 1 0;

        display: grid;

        grid-template-columns: repeat(var(--grid-columns), 1fr);
        /* grid-template-rows: repeat(var(--grid-rows), var(--cell-size)); */

        align-items: center;

        /* grid-auto-rows: repeat(var(--grid-rows), 1fr); */

        /* grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
        grid-auto-rows: minmax(1px, auto); */
        /* grid-template-rows: repeat(auto-fit, minmax(1px, 1fr)); */
        /* grid-auto-rows: fit-content; */
        /* grid-auto-columns: fit-content; */

        
        /* overflow: hidden; */

        justify-content: center;
        align-items: center;

        max-height: var(--grid-height);
    }

    /* main::before {
        content: '';
        width: 0;
        padding-bottom: 100%;
        grid-row: 1 / 1;
        grid-column: 1 / 1;
    } */

    main > div {
        /* min-width: clamp(1px, auto, 3rem);
        min-height: clamp(1px, auto, 3rem); */
        background-color: #f0f0f0;
        /* min-width: 1rem;
        max-width: 4rem; */

        /* overflow: hidden; */
/* 
        width: 100%;
        max-width: 3rem; */
        /* aspect-ratio: 1 / 1; */
        
        width: var(--cell-size);
        aspect-ratio: 1 / 1;

        align-items: center;


        border: 1px solid black;
/* 
        display: flex;
        justify-content: center;
        align-items: center; */
    }
</style>
