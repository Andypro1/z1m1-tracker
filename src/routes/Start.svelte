<script>
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import storage from "../services/storage.js";

  let storageSaves = [];
  let starterPresets = [];
  let starterPreset = "";

  onMount(() => {
    storageSaves = storage.listSaves();
    starterPresets = storage.listStarterPresets();
  });

  const roomId = () => crypto.randomUUID();
  const presetQuery = () =>
    starterPreset ? `?preset=${encodeURIComponent(starterPreset)}` : "";
  const newCoop = () => goto(`/coop/${roomId()}${presetQuery()}`);
  const loadCoop = (storageKey) =>
    goto(`/coop/${roomId()}`, { state: { storageKey } });
  const trash = (id) => {
    storage.deleteData(id);
    storageSaves = storage.listSaves();
  };
  const label = (item, value) => {
    if (!value.trim()) return;
    storage.addLabel(item.key, value.trim());
    item.label = value.trim();
    storageSaves = [...storageSaves];
  };
</script>

<svelte:head>
  <title>Z1M1 Tracker</title>
  <meta
    name="description"
    content="A solo and cooperative progress tracker for the Zelda 1 / Metroid 1 crossover randomizer."
  />
</svelte:head>

<main>
  <header>
    <h1>Zelda-Metroid Crossover Randomizer Tracker</h1>
    <p>
      This is a progress tracker for your play sessions of the NES Legend of
      Zelda and Metroid randomizers and vanilla games.
    </p>
    <p>
      While designed specifically for <a href="https://z1m1.info/"
        >Zelda 1 / Metroid 1</a
      >, it also works for similar randomizers.
    </p>
  </header>

  <section aria-labelledby="new-session">
    <h2 id="new-session">New session</h2>
    <label class="preset-picker">
      <span>Starter preset</span>
      <select bind:value={starterPreset}>
        <option value="">Map defaults</option>
        {#each starterPresets as preset}
          <option value={preset.id}>{preset.name}</option>
        {/each}
      </select>
    </label>
    <div class="start-actions">
      <a href={`/solo${presetQuery()}`} class="start-button">
        <span>Start tracking solo</span>
        <i class="sprite" style="--sprite-index: 36" aria-hidden="true"></i>
      </a>
      <button type="button" class="start-button" onclick={newCoop}>
        <span>Start tracking coop</span>
        <span class="players" aria-hidden="true">
          <i class="sprite" style="--sprite-index: 37"></i>
          <i class="sprite" style="--sprite-index: 38"></i>
        </span>
      </button>
    </div>
  </section>

  <section aria-labelledby="previous-sessions">
    <h2 id="previous-sessions">Previous sessions</h2>
    {#if storageSaves.length}
      <ul class="sessions">
        {#each storageSaves as item (item.key)}
          <li>
            <div class="session-details">
              {#if item.label}
                <strong>{item.label}</strong>
              {:else}
                <label>
                  <span class="sr-only">Session label</span>
                  <input
                    placeholder="Add a label"
                    onblur={(event) => label(item, event.currentTarget.value)}
                  />
                </label>
              {/if}
              <time datetime={new Date(item.key).toISOString()}
                >{item.display}</time
              >
            </div>
            <div class="session-actions">
              <a class="button" href={`/solo/${item.key}`}>Resume solo</a>
              <button
                class="button"
                type="button"
                onclick={() => loadCoop(item.key)}>Resume coop</button
              >
              <button
                class="icon-button danger"
                type="button"
                aria-label="Delete session"
                onclick={() => trash(item.key)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"
                  ><path
                    d="M9 3h6l1 2h4v2H4V5h4l1-2Zm-2 6h10l-1 12H8L7 9Zm3 2v7h2v-7h-2Zm4 0v7h2v-7h-2Z"
                  /></svg
                >
              </button>
            </div>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="empty">Saved sessions will appear here.</p>
    {/if}
  </section>
</main>

<style>
  :global(html) {
    user-select: text;
  }
  :global(body) {
    min-height: 100dvh;
    background: #292929;
    color: #fff;
  }
  main {
    width: min(70rem, 100%);
    margin-inline: auto;
    padding: clamp(1rem, 4vw, 2.5rem);
    font-family: "Baloo 2", system-ui, sans-serif;
  }
  header {
    max-width: 60rem;
  }
  h1 {
    font-size: clamp(1.8rem, 4vw, 2.5rem);
    line-height: 1.1;
  }
  h2 {
    margin-block: 1.5rem 0.75rem;
    font-size: 1.35rem;
  }
  p {
    margin-block: 0.8rem;
    font-size: clamp(1rem, 2vw, 1.2rem);
  }
  a {
    color: #42e9f5;
    text-decoration: none;
  }
  a:hover {
    color: #fff;
  }
  .start-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
    gap: 1rem;
  }
  .preset-picker {
    width: min(24rem, 100%);
    display: grid;
    gap: 0.35rem;
    margin-bottom: 0.8rem;
  }
  .preset-picker select {
    min-height: 2.75rem;
    border: 1px solid #777;
    border-radius: 0.35rem;
    padding-inline: 0.55rem;
    background: #111;
    color: inherit;
    font: inherit;
  }
  .start-button,
  .button,
  .icon-button {
    border: 2px solid #f1e900;
    border-radius: 0.55rem;
    background: #050505;
    color: #42e9f5;
    font: inherit;
    cursor: pointer;
  }
  .start-button {
    min-height: 8rem;
    display: grid;
    place-items: center;
    align-content: center;
    gap: 0.65rem;
    padding: 0.75rem;
  }
  .start-button:hover,
  .button:hover,
  .icon-button:hover {
    background: #555;
    color: #fff;
  }
  .start-button:focus-visible,
  .button:focus-visible,
  .icon-button:focus-visible,
  input:focus-visible,
  select:focus-visible {
    outline: 3px solid #fff;
    outline-offset: 2px;
  }
  .players {
    display: flex;
    gap: 2rem;
  }
  .sprite {
    display: block;
    width: 4rem;
    aspect-ratio: 1;
    background: url("/images/sprites-16px.png") no-repeat;
    background-size: auto 100%;
    background-position-x: calc(var(--sprite-index) * 100% / 61.5);
    image-rendering: pixelated;
  }
  .sessions {
    display: grid;
    gap: 0.75rem;
    padding: 0;
    list-style: none;
  }
  .sessions li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.8rem;
    border: 1px solid #ffffff33;
    border-radius: 0.6rem;
    background: #1d1d1d;
  }
  .session-details {
    display: grid;
    gap: 0.25rem;
    min-width: 0;
  }
  .session-details time {
    color: #bbb;
    font-size: 0.9rem;
  }
  .session-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 0.5rem;
  }
  .button {
    display: inline-flex;
    align-items: center;
    min-height: 2.75rem;
    padding-inline: 0.8rem;
  }
  .icon-button {
    display: grid;
    width: 2.75rem;
    aspect-ratio: 1;
    place-items: center;
  }
  .icon-button svg {
    width: 1.2rem;
    fill: currentColor;
  }
  .danger {
    color: #ff9d9d;
    border-color: #ff7272;
  }
  input {
    width: min(18rem, 100%);
    min-height: 2.5rem;
    border: 1px solid #777;
    border-radius: 0.35rem;
    padding-inline: 0.55rem;
    font: inherit;
  }
  .empty {
    color: #bbb;
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  @media (max-width: 42rem) {
    .sessions li {
      align-items: stretch;
      flex-direction: column;
    }
    .session-actions {
      justify-content: stretch;
    }
    .session-actions .button {
      flex: 1;
      justify-content: center;
    }
  }
</style>
