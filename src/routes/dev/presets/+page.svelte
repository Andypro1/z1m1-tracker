<script>
  import { onMount } from "svelte";
  import Map from "../../../components/Map.svelte";
  import {
    cellsOf,
    createStarterPreset,
    mapsForStarterPreset,
    starterPresetFromMaps,
  } from "../../../services/starter-presets.js";
  import storage from "../../../services/storage.js";

  let presets = [];
  let presetId = "";
  let presetName = "";
  let maps = [];
  let mapIndex = 0;
  let dirty = false;
  let builtIn = false;
  let notice = "";
  let removeArmed = false;

  $: currentArea = maps[mapIndex];
  $: generated = maps.length
    ? JSON.stringify(
        starterPresetFromMaps(presetId, presetName || "Unnamed preset", maps),
        null,
        2,
      )
    : "";
  $: inactiveCount = currentArea
    ? cellsOf(currentArea.map).filter((cell) => cell.active === false).length
    : 0;
  $: editableCount = currentArea
    ? cellsOf(currentArea.map).filter((cell) => !cell.outofbounds).length
    : 0;
  $: saved = presets.some((preset) => preset.id === presetId);

  const refresh = () => (presets = storage.listStarterPresets());
  const edit = (preset) => {
    presetId = preset.id;
    presetName = preset.name;
    builtIn = preset.builtIn === true;
    maps = mapsForStarterPreset(preset);
    mapIndex = Math.min(mapIndex, maps.length - 1);
    dirty = false;
    notice = builtIn
      ? "Built-in presets are read-only. Duplicate this preset to customize it."
      : "";
    removeArmed = false;
  };
  const create = () => {
    const preset = createStarterPreset(crypto.randomUUID(), "New preset");
    mapIndex = 0;
    edit(preset);
    dirty = true;
  };
  const selectPreset = (event) => {
    const preset = storage.loadStarterPreset(event.currentTarget.value);
    if (preset) edit(preset);
  };
  const duplicate = () => {
    const preset = starterPresetFromMaps(
      crypto.randomUUID(),
      `${presetName} copy`,
      maps,
    );
    edit(preset);
    dirty = true;
    notice = "Editing a local copy of the built-in preset.";
  };
  const toggleCell = (areaId) => {
    if (builtIn) return;
    const cell = cellsOf(currentArea.map)[Number(areaId)];
    if (!cell || cell.outofbounds) return;
    if (cell.active === false) delete cell.active;
    else cell.active = false;
    maps = [...maps];
    dirty = true;
    notice = "";
    removeArmed = false;
  };
  const setCurrentMap = (active) => {
    if (builtIn) return;
    cellsOf(currentArea.map).forEach((cell) => {
      if (cell.outofbounds) return;
      if (active) delete cell.active;
      else cell.active = false;
    });
    maps = [...maps];
    dirty = true;
    notice = "";
    removeArmed = false;
  };
  const save = () => {
    if (builtIn) return;
    const preset = starterPresetFromMaps(presetId, presetName, maps);
    if (!preset) {
      notice = "Enter a preset name before saving.";
      return;
    }
    storage.saveStarterPreset(preset);
    refresh();
    edit(preset);
    notice = "Preset saved and available for new sessions.";
  };
  const remove = () => {
    if (!saved || builtIn) return;
    if (!removeArmed) {
      removeArmed = true;
      notice = `Click Remove again to delete “${presetName}”.`;
      return;
    }
    storage.deleteStarterPreset(presetId);
    refresh();
    create();
    notice = "Preset removed.";
  };
  const copy = async () => {
    await navigator.clipboard.writeText(generated);
    notice = "Preset JSON copied.";
  };
  const download = () => {
    const filename =
      presetName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "starter-preset";
    const blob = new Blob([generated], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  onMount(() => {
    refresh();
    if (presets[0]) edit(presets[0]);
    else create();
  });
</script>

<svelte:head>
  <title>Starter preset editor · Z1M1 Tracker</title>
</svelte:head>

<main>
  <header>
    <div>
      <h1>Starter preset editor</h1>
      <p>Click map tiles to toggle whether new sessions start grayed out.</p>
    </div>
    <label>
      <span>Existing preset</span>
      <select value={saved ? presetId : ""} onchange={selectPreset}>
        <option value="" disabled>No saved preset selected</option>
        {#each presets as preset}
          <option value={preset.id}
            >{preset.name}{preset.builtIn ? " · built in" : ""}</option
          >
        {/each}
      </select>
    </label>
    <label>
      <span>Preset name</span>
      <input
        bind:value={presetName}
        readonly={builtIn}
        oninput={() => {
          dirty = true;
          notice = "";
          removeArmed = false;
        }}
        maxlength="100"
      />
    </label>
    <div class="actions">
      <button type="button" onclick={create}>New</button>
      <button type="button" onclick={duplicate} disabled={!builtIn}
        >Duplicate</button
      >
      <button
        type="button"
        class="primary"
        onclick={save}
        disabled={!dirty || builtIn}>Save</button
      >
      <button
        type="button"
        class="danger"
        onclick={remove}
        disabled={!saved || builtIn}
        >{removeArmed ? "Confirm remove" : "Remove"}</button
      >
    </div>
  </header>

  <nav aria-label="Map to edit">
    {#each maps as area, index}
      <button
        type="button"
        class:active={index === mapIndex}
        onclick={() => (mapIndex = index)}>{area.name}</button
      >
    {/each}
  </nav>

  {#if currentArea}
    <div class="workspace">
      <section class="map-panel" aria-label={`${currentArea.name} preset map`}>
        <Map
          data={currentArea.map}
          editActive={true}
          readOnly={builtIn}
          onActiveChange={toggleCell}
        />
      </section>
      <aside>
        <h2>{currentArea.name}</h2>
        <p><strong>{inactiveCount}</strong> of {editableCount} tiles grayed</p>
        <div class="map-actions">
          <button
            type="button"
            onclick={() => setCurrentMap(false)}
            disabled={builtIn}>Gray all</button
          >
          <button
            type="button"
            onclick={() => setCurrentMap(true)}
            disabled={builtIn}>Enable all</button
          >
        </div>
        <label class="output">
          <span>Generated application data</span>
          <textarea readonly value={generated}></textarea>
        </label>
        <div class="map-actions">
          <button type="button" onclick={copy}>Copy JSON</button>
          <button type="button" onclick={download}>Download JSON</button>
        </div>
        {#if notice}<p class="notice" role="status">{notice}</p>{/if}
      </aside>
    </div>
  {/if}
</main>

<style>
  :global(body) {
    overflow: hidden;
    background: #242424;
    color: #f8f8f8;
  }
  main {
    height: 100dvh;
    display: grid;
    grid-template-rows: auto auto minmax(0, 1fr);
    font-family: "Baloo 2", system-ui, sans-serif;
  }
  header {
    display: grid;
    grid-template-columns:
      minmax(18rem, 1fr) repeat(2, minmax(11rem, 16rem))
      auto;
    align-items: end;
    gap: 0.75rem;
    padding: 0.75rem;
    background: #151515;
  }
  h1,
  h2,
  p {
    margin: 0;
  }
  h1 {
    font-size: 1.4rem;
  }
  header p,
  aside p {
    color: #bbb;
  }
  label,
  .output {
    min-width: 0;
    display: grid;
    gap: 0.2rem;
    font-size: 0.82rem;
  }
  input,
  select,
  button,
  textarea {
    border: 1px solid #ffffff42;
    border-radius: 0.4rem;
    background: #303030;
    color: inherit;
    font: inherit;
  }
  input,
  select,
  button {
    min-height: 2.75rem;
  }
  input,
  select {
    width: 100%;
    padding-inline: 0.55rem;
  }
  button {
    padding-inline: 0.7rem;
    cursor: pointer;
  }
  button:hover:not(:disabled),
  button.active {
    background: #505050;
  }
  button:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
  button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  button.primary,
  nav button.active {
    border-color: #42e9f5;
  }
  button.danger {
    border-color: #ff7272;
    color: #ffb0b0;
  }
  .actions,
  .map-actions {
    display: flex;
    gap: 0.4rem;
  }
  nav {
    display: flex;
    gap: 0.35rem;
    overflow-x: auto;
    padding: 0.4rem 0.75rem;
    background: #1b1b1b;
    scrollbar-width: thin;
  }
  nav button {
    flex: 0 0 auto;
  }
  .workspace {
    min-width: 0;
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(16rem, 22rem);
  }
  .map-panel {
    min-width: 0;
    min-height: 0;
  }
  aside {
    min-width: 0;
    min-height: 0;
    display: grid;
    grid-template-rows: auto auto auto minmax(8rem, 1fr) auto auto;
    align-content: start;
    gap: 0.65rem;
    overflow: auto;
    border-left: 1px solid #ffffff2b;
    padding: 0.8rem;
    background: #171717;
  }
  .output {
    min-height: 0;
  }
  textarea {
    width: 100%;
    height: 100%;
    min-height: 8rem;
    resize: none;
    padding: 0.5rem;
    font:
      0.72rem/1.3 ui-monospace,
      monospace;
  }
  .notice {
    color: #9ff5bd;
  }
  @media (max-width: 850px) {
    :global(body) {
      overflow: auto;
    }
    main {
      height: auto;
      min-height: 100dvh;
      grid-template-rows: auto auto minmax(32rem, 1fr);
    }
    header {
      grid-template-columns: 1fr 1fr;
    }
    header > div:first-child,
    .actions {
      grid-column: 1 / -1;
    }
    .workspace {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: minmax(28rem, 70dvh) auto;
    }
    aside {
      border-top: 1px solid #ffffff2b;
      border-left: 0;
    }
  }
</style>
