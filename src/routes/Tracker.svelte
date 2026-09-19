<script>
  import { onDestroy, onMount } from "svelte";
  import { afterNavigate, replaceState } from "$app/navigation";
  import { page } from "$app/state";
  import Map from "../components/Map.svelte";
  import Toolbars from "../components/Toolbars.svelte";
  import { solveMapLayout } from "../components/map-layout.js";
  import toolbars from "../components/toolbars.js";
  import coopClient, { coopStatus } from "../services/coop-client.js";
  import storage from "../services/storage.js";
  import {
    actions,
    applyRemoteOperation,
    getCell,
    getSharedState,
    GlobalAction,
    replaceSharedState,
    resetTracker,
    tracker,
    trackerState,
    trackerUpdated,
    updateMapData,
    updateMapMetadata,
  } from "../services/tracker.js";

  export let storageKey = "";

  let controlsOpen = true;
  let areasOpen = true;
  let activeSequence = "";
  let activeAreaId = -1;
  let layout = "horizontal";
  let controlSize = 156;
  let areaSize = 112;
  let layoutReady = false;
  let routeReady = false;
  let layoutFrame;
  $: session = $trackerState;
  $: currentArea = session.areaMaps[session.curAreaMapIndex];
  $: mapAspect =
    (currentArea.map.sectionCols * currentArea.map.pixelWidth) /
    currentArea.map.cols /
    ((currentArea.map.sectionRows * currentArea.map.pixelHeight) /
      currentArea.map.rows);
  const coopGuid = page.params.coopGuid;

  const selectMap = (name, notify = true) => {
    const requested = name?.trim().toLocaleLowerCase();
    const index = tracker.areaMaps.findIndex(
      (area) => area.name.toLocaleLowerCase() === requested,
    );
    if (index < 0 || index === tracker.curAreaMapIndex) return false;
    tracker.curAreaMapIndex = index;
    if (notify) trackerUpdated();
    return true;
  };

  const selectSubToolbar = (name) => {
    const requested = name?.trim().toLocaleLowerCase();
    if (
      !$toolbars.isAToolbarAction(requested) ||
      requested === $toolbars.getCurrentSubBarName()
    )
      return false;
    $toolbars.setSubToolbar(requested);
    $toolbars = $toolbars;
    return true;
  };

  const applyRouteSelections = (searchParams, notify = true) => {
    const mapChanged = selectMap(searchParams.get("map"), notify);
    selectSubToolbar(searchParams.get("toolbar"));
    return mapChanged;
  };

  const syncRoute = (mapName, toolbarName) => {
    if (!routeReady || !mapName || !toolbarName) return;
    const url = new URL(page.url);
    url.searchParams.set("map", mapName);
    url.searchParams.set("toolbar", toolbarName);
    if (url.href !== page.url.href) replaceState(url, page.state);
  };

  afterNavigate(() => {
    if (!routeReady) return;
    applyRouteSelections(page.url.searchParams);
    syncRoute(
      tracker.areaMaps[tracker.curAreaMapIndex]?.name,
      $toolbars.getCurrentSubBarName(),
    );
  });

  const queueLayout = (
    aspect = mapAspect,
    nextControlsOpen = controlsOpen,
    nextAreasOpen = areasOpen,
  ) => {
    if (!layoutReady) return;
    cancelAnimationFrame(layoutFrame);
    layoutFrame = requestAnimationFrame(() => {
      const solution = solveMapLayout({
        width: window.innerWidth,
        height: window.innerHeight,
        aspect,
        controlsOpen: nextControlsOpen,
        areasOpen: nextAreasOpen,
        rem: Number.parseFloat(
          getComputedStyle(document.documentElement).fontSize,
        ),
      });
      layout = solution.layout;
      controlSize = solution.controlSize;
      areaSize = solution.areaSize;
    });
  };

  $: if (layoutReady) queueLayout(mapAspect, controlsOpen, areasOpen);
  $: syncRoute(currentArea?.name, $toolbars.getCurrentSubBarName());

  onMount(async () => {
    const compactViewport = matchMedia("(max-width: 700px)").matches;
    controlsOpen = !compactViewport;
    areasOpen = !compactViewport;
    if (page.url.searchParams.get("endpoint"))
      $coopClient.setEndpoint(page.url.searchParams.get("endpoint"));
    const presetId = page.url.searchParams.get("preset");
    resetTracker(
      storageKey ? await storage.loadData(storageKey) : undefined,
      presetId ? storage.loadStarterPreset(presetId) : undefined,
    );
    applyRouteSelections(page.url.searchParams, false);
    trackerUpdated();
    layoutReady = true;
    routeReady = true;
    syncRoute(
      tracker.areaMaps[tracker.curAreaMapIndex]?.name,
      $toolbars.getCurrentSubBarName(),
    );
    queueLayout();
    if (coopGuid)
      await $coopClient.enable(
        coopGuid,
        getSharedState(),
        replaceSharedState,
        applyRemoteOperation,
      );
  });

  onDestroy(() => {
    cancelAnimationFrame(layoutFrame);
    $coopClient.disable();
  });

  const areaHotkey = (name) =>
    Object.values(GlobalAction).find((action) => action.name === name)
      ?.hotkeys[0] ?? "";
  const statGroups = (stats) =>
    [
      {
        name: "Equipment acquired",
        short: "E",
        value: stats.numEquipAcquired,
        max: stats.maxEquipInArea,
        color: "#4e8cff",
      },
      {
        name: "Quest items acquired",
        short: "Q",
        value: stats.numQuestAcquired,
        max: stats.maxQuestInArea,
        color: "#ed4141",
      },
      {
        name: "Equipment spots",
        short: "E",
        value: stats.markedEquipSpots,
        max: stats.maxEquipSpots,
        color: "#4e8cff",
      },
      {
        name: "Quest spots",
        short: "Q",
        value: stats.markedQuestSpots,
        max: stats.maxQuestSpots,
        color: "#ed4141",
      },
      {
        name: "Upgrade spots",
        short: "U",
        value: stats.markedUpgradeSpots,
        max: stats.maxUpgradeSpots,
        color: "#35b85a",
      },
    ].filter(({ max }) => max > 0);

  const markWithKeyboard = (event, areaId) => {
    if (areaId < 0) return false;
    activeSequence =
      areaId === activeAreaId ? activeSequence + event.key : event.key;
    activeAreaId = areaId;
    const all = Object.values($toolbars.allActions());
    let matches = all.filter(({ hotkeys }) => hotkeys.includes(activeSequence));
    let partial = all.some(({ hotkeys }) =>
      hotkeys.some(
        (key) =>
          key.length > activeSequence.length && key.startsWith(activeSequence),
      ),
    );
    if (!matches.length && !partial) {
      activeSequence = event.key;
      matches = all.filter(({ hotkeys }) => hotkeys.includes(activeSequence));
      partial = all.some(({ hotkeys }) =>
        hotkeys.some((key) => key.length > 1 && key.startsWith(activeSequence)),
      );
    }
    const cell = getCell(areaId);
    if (
      matches.length &&
      cell &&
      cell.active !== false &&
      cell.active !== "false" &&
      !cell.outofbounds
    ) {
      const action = matches[0].name;
      updateMapData(
        areaId,
        action === "notYetAcquired" ? Boolean(cell.marked) : true,
        action,
      );
      $toolbars.setSubToolbar(action);
      $toolbars = $toolbars;
      return true;
    }
    if (event.key === "Escape" && cell) {
      updateMapData(areaId, false, "");
      return true;
    }
    if (!partial) activeSequence = "";
    return false;
  };

  const handleHotkey = (event, areaId) => {
    if (
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      /input|textarea|select/i.test(event.target?.tagName)
    )
      return;
    if (markWithKeyboard(event, areaId)) {
      event.preventDefault();
      return;
    }
    activeSequence = "";
    const global = Object.values(GlobalAction).find(({ hotkeys }) =>
      hotkeys.includes(event.key),
    );
    if (global) {
      event.preventDefault();
      selectMap(global.name);
    }
  };

  const handleMouseMark = (areaId, action) => {
    activeAreaId = areaId;
    activeSequence = $toolbars.getAction(action)?.hotkeys[0] ?? "";
  };
</script>

<svelte:head>
  <title>{currentArea?.name ?? "Tracker"} · Z1M1 Tracker</title>
  <meta
    name="description"
    content="Track Zelda 1 and Metroid 1 crossover randomizer progress."
  />
</svelte:head>

<svelte:window
  oncontextmenu={(event) => event.preventDefault()}
  onresize={() => queueLayout()}
/>

<main
  style={`--control-size:${controlSize}px;--area-size:${areaSize}px`}
  class:controls-open={controlsOpen}
  class:layout-horizontal={layout === "horizontal"}
  class:layout-vertical={layout === "vertical"}
>
  <header class="control-dock">
    <div class="dock-summary">
      <strong>{currentArea?.name}</strong>
      {#if coopGuid}<span class="connection {$coopStatus}"
          >Co-op: {$coopStatus}</span
        >{/if}
      <button
        type="button"
        class="dock-toggle"
        aria-expanded={controlsOpen}
        onclick={() => (controlsOpen = !controlsOpen)}
      >
        {controlsOpen ? "Hide controls" : "Show controls"}
      </button>
    </div>
    {#if controlsOpen}
      <div class="controls">
        <Toolbars set={currentArea.map.class} />
        <fieldset>
          <legend>Map orientation</legend>
          <label>
            <input
              type="checkbox"
              checked={currentArea.map.isHflipped}
              onchange={(event) =>
                updateMapMetadata(
                  session.curAreaMapIndex,
                  "isHflipped",
                  event.currentTarget.checked,
                )}
            />
            Flip horizontally
          </label>
          <label>
            <input
              type="checkbox"
              checked={currentArea.map.isVflipped}
              onchange={(event) =>
                updateMapMetadata(
                  session.curAreaMapIndex,
                  "isVflipped",
                  event.currentTarget.checked,
                )}
            />
            Flip vertically
          </label>
        </fieldset>
      </div>
    {/if}
  </header>

  <div class="workspace" class:areas-collapsed={!areasOpen}>
    <section class="map-section" aria-label={`${currentArea.name} map`}>
      <Map data={currentArea.map} {handleHotkey} {handleMouseMark} />
    </section>
    <nav class="area-panel" aria-label="Maps">
      <button
        type="button"
        class="area-toggle"
        aria-expanded={areasOpen}
        onclick={() => (areasOpen = !areasOpen)}
      >
        <span>{areasOpen ? "Hide" : "Areas"}</span><span aria-hidden="true"
          >{areasOpen ? "›" : "‹"}</span
        >
      </button>
      {#if areasOpen}
        <div class="area-cards">
          {#each session.areaMaps as area}
            <button
              type="button"
              class:active={area === currentArea}
              class="area-card"
              onclick={() => selectMap(area.name)}
            >
              <kbd>{areaHotkey(area.name)}</kbd>
              <strong>{area.name}</strong>
              <div class="stat-bars">
                {#each statGroups(area.stats) as stat}
                  <div
                    class="stat"
                    title={`${stat.name}: ${stat.value} of ${stat.max}`}
                    style={`--stat-color:${stat.color}`}
                  >
                    <span>{stat.short}</span>
                    <i
                      style={`--progress:${Math.min(stat.value / stat.max, 1) * 100}%`}
                    ></i>
                    {#if stat.value > stat.max}<b>+</b>{/if}
                  </div>
                {/each}
              </div>
            </button>
          {/each}
        </div>
      {/if}
    </nav>
  </div>
</main>

<style>
  :global(body) {
    overflow: hidden;
    background: #242424;
  }
  main {
    height: 100dvh;
    display: grid;
    overflow: hidden;
    color: #f8f8f8;
    font-family: "Baloo 2", system-ui, sans-serif;
  }
  .layout-horizontal {
    grid-template-rows: var(--control-size) minmax(0, 1fr);
  }
  .layout-vertical {
    grid-template-columns: var(--control-size) minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr);
  }
  .control-dock {
    position: relative;
    z-index: 20;
    min-width: 0;
    min-height: 0;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    overflow: hidden;
    border-bottom: 1px solid #ffffff2b;
    background: #151515;
    box-shadow: 0 0.25rem 1rem #0008;
  }
  .layout-vertical .control-dock {
    border-right: 1px solid #ffffff2b;
    border-bottom: 0;
    box-shadow: 0.25rem 0 1rem #0008;
  }
  .dock-summary {
    min-height: 2.75rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding-inline: 0.65rem;
  }
  .dock-summary strong {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .dock-toggle,
  .area-toggle {
    min-width: 2.75rem;
    min-height: 2.75rem;
    margin-left: auto;
    border: 1px solid #ffffff42;
    border-radius: 0.45rem;
    background: #303030;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }
  .dock-toggle:hover,
  .area-toggle:hover {
    background: #484848;
  }
  .connection {
    padding: 0.15rem 0.45rem;
    border-radius: 999px;
    background: #444;
    color: #ddd;
    font-size: 0.78rem;
  }
  .connection.connected {
    background: #174c2c;
    color: #9ff5bd;
  }
  .connection.reconnecting {
    background: #563f0c;
    color: #ffe29a;
  }
  .controls {
    min-width: 0;
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 0.5rem;
    padding: 0 0.5rem 0.5rem;
    container: controls / size;
  }
  .layout-vertical .controls {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr) auto;
    overflow: hidden;
  }
  .layout-vertical fieldset {
    min-width: 0;
  }
  fieldset {
    min-width: 11.5rem;
    display: grid;
    align-content: center;
    gap: 0.25rem;
    margin: 0;
    border: 1px solid #ffffff2b;
    border-radius: 0.5rem;
    padding: 0.35rem 0.65rem;
  }
  legend {
    padding-inline: 0.25rem;
    color: #bbb;
    font-size: 0.78rem;
  }
  label {
    min-height: 2rem;
    display: flex;
    align-items: center;
    gap: 0.45rem;
    cursor: pointer;
  }
  label input {
    width: 1.15rem;
    height: 1.15rem;
  }
  .workspace {
    min-width: 0;
    min-height: 0;
    display: grid;
  }
  .layout-horizontal .workspace {
    grid-template-rows: minmax(0, 1fr) var(--area-size);
  }
  .layout-vertical .workspace {
    grid-template-columns: minmax(0, 1fr) var(--area-size);
  }
  .map-section {
    min-width: 0;
    min-height: 0;
    background: #303030;
  }
  .area-panel {
    min-width: 0;
    min-height: 0;
    display: flex;
    background: #d7d0bd;
    color: #111;
    box-shadow: 0 -0.35rem 1rem #0008;
  }
  .area-toggle {
    flex: 0 0 2.75rem;
    align-self: stretch;
    min-width: 2.75rem;
    margin: 0;
    border: 0;
    border-radius: 0;
    background: #292721;
    color: #fff;
    writing-mode: vertical-rl;
  }
  .area-toggle span:last-child {
    font-size: 1.4rem;
  }
  .area-cards {
    flex: 1;
    min-width: 0;
    overflow-x: auto;
    overflow-y: hidden;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(4.75rem, 1fr);
    grid-template-rows: minmax(0, 1fr);
    gap: 0.3rem;
    padding: 0.35rem;
  }
  .layout-horizontal .workspace.areas-collapsed .area-toggle {
    width: 100%;
    writing-mode: horizontal-tb;
  }
  .layout-horizontal .workspace.areas-collapsed .area-toggle span:last-child {
    display: none;
  }
  .layout-horizontal .area-card {
    min-height: 0;
  }
  .layout-vertical .area-panel {
    box-shadow: -0.35rem 0 1rem #0008;
  }
  .layout-vertical .area-cards {
    grid-auto-flow: row;
    grid-auto-columns: auto;
    grid-template-rows: none;
    grid-auto-rows: minmax(4.2rem, auto);
    overflow-x: hidden;
    overflow-y: auto;
  }
  .layout-vertical:not(.controls-open) .dock-summary {
    justify-content: center;
    padding: 0;
  }
  .layout-vertical:not(.controls-open) .dock-summary > :not(.dock-toggle) {
    display: none;
  }
  .layout-vertical:not(.controls-open) .dock-toggle {
    align-self: stretch;
    margin: 0;
    border: 0;
    border-radius: 0;
    writing-mode: vertical-rl;
  }
  .area-card {
    position: relative;
    min-height: 3.5rem;
    display: grid;
    grid-template-columns: 1.4rem 1fr;
    grid-template-rows: auto 1fr;
    gap: 0.1rem 0.25rem;
    overflow: hidden;
    border: 1px solid #0003;
    border-radius: 0.45rem;
    padding: 0.35rem;
    background:
      linear-gradient(#fffde9e8, #e9dfbde8),
      url("/images/tb.action.equip.png") center / cover;
    color: #111;
    text-align: left;
    font: inherit;
    cursor: pointer;
  }
  .area-card:hover {
    border-color: #111;
    filter: brightness(1.04);
  }
  .area-card.active {
    outline: 3px solid #34a9ff;
    outline-offset: -3px;
  }
  .area-card kbd {
    grid-row: 1 / 3;
    align-self: start;
    border: 1px solid #777;
    border-radius: 0.25rem;
    background: #fff;
    padding: 0.05rem 0.25rem;
    text-align: center;
    text-transform: uppercase;
  }
  .area-card strong {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.9rem;
  }
  .stat-bars {
    display: grid;
    align-content: end;
    gap: 0.13rem;
  }
  .stat {
    display: grid;
    grid-template-columns: 0.65rem 1fr auto;
    align-items: center;
    gap: 0.18rem;
    font:
      600 0.58rem/1 system-ui,
      sans-serif;
  }
  .stat i {
    height: 0.24rem;
    border-radius: 999px;
    background: linear-gradient(
      90deg,
      var(--stat-color) var(--progress),
      #0002 var(--progress)
    );
  }
  .stat b {
    color: #c00;
  }
  @media (max-width: 700px) {
    .controls {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: minmax(0, 1fr) auto;
    }
    fieldset {
      grid-template-columns: 1fr 1fr;
    }
    legend {
      grid-column: 1 / -1;
    }
  }
</style>
