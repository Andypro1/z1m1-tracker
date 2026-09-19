<script>
  import { actions } from "../services/tracker.js";
  import toolbars from "./toolbars.js";

  export let set = "overworld";
  $: currentSubToolbar = $toolbars.getCurrentSubBarName();
  $: mainActions = $toolbars
    .getMainToolbar(set)
    .flatMap(({ actions: entries }) => entries);
  $: subActions = $toolbars
    .getSubToolbar()
    .flatMap(({ actions: entries }) => entries);

  const assignment = (action) => {
    const index = $actions.indexOf(action.name);
    return {
      className: index >= 0 ? `button${index}` : "",
      label: ["LC", "MC", "RC", "", ">C"][index],
    };
  };

  const choose = (event, action, changeToolbar = true) => {
    event.preventDefault();
    if (event.button === 3) return;
    actions.setPosition(action.name, event.button);
    if (changeToolbar) $toolbars.setSubToolbar(action.name);
    $toolbars = $toolbars;
  };

  const show = (action) => {
    $toolbars.setSubToolbar(action.name);
    $toolbars = $toolbars;
  };
</script>

<div class="toolbars" class:short-main={mainActions.length < 8}>
  <div class="toolbar main" aria-label="Primary marking tools">
    {#each mainActions as action}
      <button
        type="button"
        class="action {action.name} {assignment(action).className}"
        class:active={currentSubToolbar === action.name}
        class:custom={action.class === "custom"}
        title={`${action.display} · ${action.hotkeys.join(" or ")}`}
        onpointerdown={(event) => choose(event, action)}
        onpointerenter={() => show(action)}
      >
        {#if action.spriteIndex !== undefined && !action.shopText}
          <i
            class="sprite"
            style={`--sprite-index:${action.spriteIndex}`}
            aria-hidden="true"
          ></i>
        {:else}<span>{action.display}</span>{/if}
        {#if assignment(action).label}<small class="mouse-key"
            >{assignment(action).label}</small
          >{/if}
        <kbd>{action.hotkeys[0]}</kbd>
      </button>
    {/each}
  </div>

  <div
    class="toolbar sub {currentSubToolbar}"
    aria-label={`${currentSubToolbar} tools`}
  >
    {#each subActions as action}
      <button
        type="button"
        class="action {assignment(action).className}"
        class:used={action.used}
        title={`${action.display} · ${action.hotkeys.join(" or ")}`}
        onpointerdown={(event) => choose(event, action, false)}
      >
        {#if action.spriteIndex !== undefined && action.warpText === undefined && action.shopText === undefined}
          <i
            class="sprite"
            style={`--sprite-index:${action.spriteIndex}`}
            aria-hidden="true"
          ></i>
        {:else}<span>{action.display}</span>{/if}
        {#if action.mapText}<b>{action.mapText}</b>{/if}
        {#if assignment(action).label}<small class="mouse-key"
            >{assignment(action).label}</small
          >{/if}
        <kbd>{action.hotkeys[0]}</kbd>
      </button>
    {/each}
  </div>
</div>

<style>
  .toolbars {
    --main-width: 27.25rem;
    min-width: 0;
    min-height: 0;
    height: 100%;
    display: grid;
    grid-template-columns: var(--main-width) minmax(0, 1fr);
    gap: 0.4rem;
    overflow: hidden;
  }
  .toolbars:where(.short-main) {
    --main-width: 23.85rem;
  }
  .toolbar {
    min-width: 0;
    min-height: 0;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 3.15rem;
    grid-template-rows: repeat(auto-fit, minmax(2.75rem, 1fr));
    gap: 0.25rem;
    overflow-x: auto;
    overflow-y: hidden;
    overscroll-behavior: contain;
    padding: 0.15rem;
    scrollbar-width: thin;
  }
  :global(.layout-vertical) .toolbars {
    height: 100%;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto minmax(0, 1fr);
    overflow: hidden;
  }
  :global(.layout-vertical) .toolbar,
  :global(.layout-vertical) .main,
  :global(.layout-vertical) .sub {
    width: auto;
    grid-auto-flow: row;
    grid-auto-columns: auto;
    grid-auto-rows: 3.15rem;
    grid-template-columns: repeat(auto-fit, minmax(2.75rem, 1fr));
    grid-template-rows: none;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .sub {
    align-content: start;
  }
  .main {
    width: 100%;
    overflow-x: hidden;
  }
  @container controls (min-height: 6.05rem) {
    .toolbars {
      --main-width: 13.65rem;
    }
  }
  @container controls (min-height: 9.05rem) {
    .toolbars {
      --main-width: 10.25rem;
    }
  }
  @container controls (min-height: 12.05rem) {
    .toolbars {
      --main-width: 6.85rem;
    }
  }
  @container controls (min-height: 21.05rem) {
    .toolbars.short-main {
      --main-width: 3.45rem;
    }
  }
  @container controls (min-height: 24.05rem) {
    .toolbars {
      --main-width: 3.45rem;
    }
  }
  :global(.layout-vertical) .toolbars > .main {
    width: 100%;
  }
  .action {
    position: relative;
    min-width: 2.75rem;
    min-height: 2.75rem;
    display: grid;
    place-items: center;
    overflow: hidden;
    border: 1px solid #ffffff35;
    border-radius: 0.45rem;
    padding: 0.2rem;
    background: linear-gradient(145deg, #555, #101010);
    color: #fff;
    font:
      600 0.68rem/1.05 "Baloo 2",
      system-ui,
      sans-serif;
    text-align: center;
    cursor: pointer;
    touch-action: manipulation;
    transition:
      transform 100ms ease-out,
      filter 100ms ease-out;
  }
  .action:hover,
  .action:focus-visible,
  .action.active {
    border-color: #fff;
    filter: brightness(1.25);
  }
  .action:hover,
  .action:focus-visible {
    z-index: 1;
    transform: scale(1.05);
  }
  .action.button0,
  .action.button1,
  .action.button2,
  .action.button4 {
    box-shadow:
      inset 0 0 0 2px #fff600,
      0 0 0.35rem #fff600;
  }
  .action.used {
    filter: grayscale(1) contrast(0.55);
  }
  @media (prefers-reduced-motion: reduce) {
    .action {
      transition: none;
    }
  }
  .action.custom1 {
    box-shadow: inset 0 0 0.45rem 0.2rem #f33;
  }
  .action.custom2 {
    box-shadow: inset 0 0 0.45rem 0.2rem #397dff;
  }
  .action.warp,
  .sub.warp .action {
    background:
      linear-gradient(#1117, #1117),
      url("/images/tb.action.warp.png") center / cover;
  }
  .action.equip,
  .sub.equip .action {
    background:
      linear-gradient(#1118, #1118),
      url("/images/tb.action.equip.png") center / cover;
  }
  .action.quest,
  .sub.quest .action {
    background:
      linear-gradient(#1118, #1118),
      url("/images/tb.action.quest.png") center / cover;
  }
  .sprite {
    width: 80%;
    aspect-ratio: 1;
    background: url("/images/sprites-16px.png") no-repeat;
    background-size: auto 100%;
    background-position-x: calc(var(--sprite-index) * 100% / 61.5);
    image-rendering: pixelated;
  }
  .action > b {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-size: 1.4rem;
    text-shadow: 0 1px 2px #000;
  }
  kbd,
  .mouse-key {
    position: absolute;
    z-index: 2;
    border: 1px solid #888;
    border-radius: 0.2rem;
    background: #f8f8f8dd;
    color: #111;
    font:
      600 0.55rem/1.1 system-ui,
      sans-serif;
    text-transform: uppercase;
  }
  kbd {
    right: 0.1rem;
    bottom: 0.1rem;
    padding: 0.08rem 0.16rem;
  }
  .mouse-key {
    left: 0.1rem;
    top: 0.1rem;
    padding: 0.08rem;
  }
  @media (max-width: 700px) {
    :global(.layout-horizontal) .toolbars {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: 3.75rem minmax(0, 1fr);
    }
    :global(.layout-horizontal) .toolbar,
    :global(.layout-horizontal) .main,
    :global(.layout-horizontal) .sub {
      grid-template-rows: repeat(auto-fit, minmax(2.75rem, 1fr));
      grid-auto-flow: column;
    }
    :global(.layout-horizontal) .main {
      width: 100%;
      grid-template-rows: 2.75rem;
      overflow-x: auto;
    }
  }
</style>
