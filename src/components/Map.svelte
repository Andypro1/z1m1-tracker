<script>
  import Overlay from "./Overlay.svelte";
  import Premark from "./Premark.svelte";
  import { actions, updateMapData } from "../services/tracker.js";
  import toolbars from "./toolbars.js";

  export let data = {};
  export let handleHotkey = () => false;
  export let handleMouseMark = () => {};
  export let editActive = false;
  export let readOnly = false;
  export let onActiveChange = () => {};

  let hoveredAreaId = -1;
  $: aspect =
    (data.sectionCols * data.pixelWidth) /
    data.cols /
    ((data.sectionRows * data.pixelHeight) / data.rows);
  $: displayRooms = Array.from({ length: data.rooms.length }, (_, position) => {
    const row = Math.floor(position / data.sectionCols);
    const column = position % data.sectionCols;
    const sourceRow = data.isVflipped ? data.sectionRows - row - 1 : row;
    const sourceColumn = data.isHflipped
      ? data.sectionCols - column - 1
      : column;
    const areaId = sourceRow * data.sectionCols + sourceColumn;
    return { ...data.rooms[areaId], areaId, position };
  });

  const roomStyle = ({ areaId, position }) => {
    const row = Math.floor(position / data.sectionCols);
    const column = position % data.sectionCols;
    const sourceRow =
      Math.floor(areaId / data.sectionCols) +
      Math.floor(data.sectionStartCell / data.cols);
    const sourceColumn =
      (areaId % data.sectionCols) + (data.sectionStartCell % data.cols);
    const x = data.cols > 1 ? (sourceColumn * 100) / (data.cols - 1) : 0;
    const y = data.rows > 1 ? (sourceRow * 100) / (data.rows - 1) : 0;
    return `grid-row:${row + 1};grid-column:${column + 1};background-position:${x}% ${y}%`;
  };

  const regionStyle = (region) => {
    const rowStart = data.isVflipped
      ? data.sectionRows - region.rowEnd + 1
      : region.rowStart;
    const rowEnd = data.isVflipped
      ? data.sectionRows - region.rowStart + 2
      : region.rowEnd + 1;
    const columnStart = data.isHflipped
      ? data.sectionCols - region.colEnd + 2
      : region.colStart;
    const columnEnd = data.isHflipped
      ? data.sectionCols - region.colStart + 2
      : region.colEnd;
    return `background-size:${region.bgSize};background-position:${region.bgPosX} ${region.bgPosY};grid-row:${rowStart}/${rowEnd};grid-column:${columnStart}/${columnEnd}`;
  };

  const areaPointerDown = (event, area, areaId) => {
    event.preventDefault();
    event.stopPropagation();
    if (readOnly) return;
    if (editActive) {
      if (event.button === 0 && !area.outofbounds) onActiveChange(areaId);
      return;
    }
    if (event.button === 3 || !$actions[event.button]) return;
    if (
      !area.rowStart &&
      (area.active === false || area.active === "false" || area.outofbounds)
    )
      return;
    const action = $actions[event.button];
    const wasMarked =
      action === "custom1" || action === "custom2"
        ? area.custom === Number(action.slice(6))
        : Boolean(area.marked);
    updateMapData(areaId, !wasMarked, action);
    $toolbars.setSubToolbar(action);
    $toolbars = $toolbars;
    handleMouseMark(areaId, action);
  };
</script>

<svelte:window onkeydown={(event) => handleHotkey(event, hoveredAreaId)} />

<div
  class="map-viewport"
  style={`--map-aspect:${aspect};--section-cols:${data.sectionCols};--section-rows:${data.sectionRows};--map-cols:${data.cols};--map-rows:${data.rows};--shadow-color:${data.shadowColor}`}
>
  {#if data.rooms.length || data.gridRegions?.length}
    <div
      class="map-grid {data.class}"
      role="group"
      aria-label="Trackable cells"
      class:mirrored-h={data.isHflipped}
      class:mirrored-v={data.isVflipped}
      onpointerleave={() => (hoveredAreaId = -1)}
    >
      {#each displayRooms as cell}
        {#if cell.outofbounds}
          <div
            style={`grid-row:${Math.floor(cell.position / data.sectionCols) + 1};grid-column:${(cell.position % data.sectionCols) + 1}`}
          ></div>
        {:else}
          <button
            type="button"
            disabled={readOnly}
            class="room"
            class:active={cell.active !== false && cell.active !== "false"}
            aria-label={`Map cell ${cell.areaId + 1}`}
            aria-pressed={editActive
              ? cell.active !== false && cell.active !== "false"
              : undefined}
            data-area-id={cell.areaId}
            style={roomStyle(cell)}
            onpointerenter={() => (hoveredAreaId = cell.areaId)}
            onpointerdown={(event) => areaPointerDown(event, cell, cell.areaId)}
          >
            {#if !cell.marked && cell.premark}<Premark
                text={cell.premark}
              />{/if}
            <Overlay
              action={cell.action}
              custom={cell.custom}
              draw={cell.marked}
              notAcquired={cell.notAcquired}
            />
          </button>
        {/if}
      {/each}
      {#each data.gridRegions ?? [] as region, index}
        <button
          type="button"
          disabled={readOnly}
          class="grid-region"
          class:active={region.active !== false && region.active !== "false"}
          aria-label={region.name ?? `Map region ${index + 1}`}
          aria-pressed={editActive
            ? region.active !== false && region.active !== "false"
            : undefined}
          data-area-id={data.rooms.length + index}
          style={regionStyle(region)}
          onpointerenter={() => (hoveredAreaId = data.rooms.length + index)}
          onpointerdown={(event) =>
            areaPointerDown(event, region, data.rooms.length + index)}
        >
          {#if !region.marked && region.premark}<Premark
              text={region.premark}
            />{/if}
          <Overlay
            action={region.action}
            custom={region.custom}
            draw={region.marked}
            notAcquired={region.notAcquired}
            isRegion={true}
          />
        </button>
      {/each}
    </div>
  {:else}
    <p class="empty-panel">This panel does not contain trackable map cells.</p>
  {/if}
</div>

<style>
  .map-viewport {
    --minimum-cell-inline: 1.875rem;
    --minimum-cell-block: 1.5rem;
    width: 100%;
    height: 100%;
    container-type: size;
    overflow: auto;
    display: grid;
    place-items: center;
    overscroll-behavior: contain;
  }
  .map-grid {
    width: max(
      calc(var(--section-cols) * var(--minimum-cell-inline)),
      calc(var(--section-rows) * var(--minimum-cell-block) * var(--map-aspect)),
      min(100cqw, calc(100cqh * var(--map-aspect)))
    );
    aspect-ratio: var(--map-aspect);
    display: grid;
    grid-template: repeat(var(--section-rows), 1fr) / repeat(
        var(--section-cols),
        1fr
      );
    gap: 1px;
    padding: 0.25rem;
    contain: layout;
  }
  .room,
  .grid-region {
    position: relative;
    isolation: isolate;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    border: 0;
    padding: 0;
    background-color: transparent;
    background-repeat: no-repeat;
    image-rendering: pixelated;
    touch-action: manipulation;
    transition:
      transform 100ms ease-out,
      filter 100ms ease-out;
  }
  .room {
    background-size: calc(var(--map-cols) * 100%) calc(var(--map-rows) * 100%);
  }
  .overworld .room {
    background-image: url("/images/hyrule-q1-halfscale.png");
  }
  .dungeon .room {
    background-image: url("/images/dungeons-halfscale.png");
  }
  .zebes .room,
  .zebes .grid-region {
    background-image: url("/images/zebes-quarterscale.png");
  }
  .room:not(.active),
  .grid-region:not(.active) {
    filter: grayscale(0.82) contrast(0.65);
  }
  .room:not(.active)::after,
  .grid-region:not(.active)::after {
    position: absolute;
    inset: 0;
    content: "";
    pointer-events: none;
    background: repeating-linear-gradient(
      135deg,
      #fff5 0 1px,
      #0005 1px 2px,
      transparent 2px 6px
    );
    mix-blend-mode: soft-light;
  }
  .room.active,
  .grid-region.active {
    filter: saturate(1.2);
    cursor: pointer;
  }
  .room:disabled,
  .grid-region:disabled {
    cursor: default;
  }
  .room.active:hover,
  .room.active:focus-visible,
  .grid-region.active:hover,
  .grid-region.active:focus-visible {
    z-index: 10;
    outline: 2px solid #fff;
    outline-offset: -2px;
    filter: brightness(1.12) saturate(1.25);
    box-shadow: inset 0 0 0 2px #fff8;
    transform: scale(1.05);
  }
  .mirrored-h .room,
  .mirrored-h .grid-region {
    transform: scaleX(-1);
  }
  .mirrored-h .room.active:hover,
  .mirrored-h .room.active:focus-visible,
  .mirrored-h .grid-region.active:hover,
  .mirrored-h .grid-region.active:focus-visible {
    transform: scaleX(-1) scale(1.05);
  }
  .empty-panel {
    margin: auto;
    padding: 1rem;
    color: #bbb;
    text-align: center;
  }
  @media (pointer: coarse) {
    .map-viewport {
      --minimum-cell-inline: 2rem;
      --minimum-cell-block: 2rem;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .room,
    .grid-region {
      transition: none;
    }
  }
</style>
