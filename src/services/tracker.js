import { get, writable } from "svelte/store";
import toolbars from "../components/toolbars.js";
import { mapCatalog } from "../components/maps/catalog.js";
import coopClient from "./coop-client.js";
import {
  applyStarterPreset,
  cellsOf,
  normalizeStarterPreset,
} from "./starter-presets.js";
import storage from "./storage.js";

const clone = (value) => structuredClone(value);
const storedCell = ({ marked, action, notAcquired, custom }) => ({
  ...(marked ? { marked: true } : {}),
  ...(action ? { action } : {}),
  ...(notAcquired ? { notAcquired: true } : {}),
  ...(custom ? { custom } : {}),
});

const calculateStats = (map) => {
  const cells = cellsOf(map);
  const equips = get(toolbars)
    .equipActions()
    .map(({ name }) => name);
  const quests = get(toolbars)
    .questActions()
    .map(({ name }) => name);
  const acquired = cells.filter((cell) => cell.marked && !cell.notAcquired);
  const countPremark = (mark, list = cells) =>
    list.filter((cell) => cell.premark === mark).length;
  return {
    maxEquipSpots: countPremark("E"),
    maxQuestSpots: countPremark("Q"),
    maxUpgradeSpots: countPremark("U"),
    maxMinorSpots: countPremark("M"),
    totalValidCells: cells.filter(
      (cell) =>
        cell.active !== false && cell.active !== "false" && !cell.outofbounds,
    ).length,
    markedEquipSpots: countPremark("E", acquired),
    markedQuestSpots: countPremark("Q", acquired),
    markedUpgradeSpots: countPremark("U", acquired),
    markedMinorSpots: countPremark("M", acquired),
    maxEquipInArea: map.class.includes("overworld") ? 4 : 3,
    maxQuestInArea: 2,
    numEquipAcquired: acquired.filter((cell) => equips.includes(cell.action))
      .length,
    numQuestAcquired: acquired.filter((cell) => quests.includes(cell.action))
      .length,
  };
};

export const createTracker = (starterPreset) => {
  const preset = normalizeStarterPreset(starterPreset);
  const areaMaps = mapCatalog.map(([name, data]) => ({
    name,
    map: clone(data),
  }));
  if (preset) applyStarterPreset(areaMaps, preset);
  areaMaps.forEach((area) => (area.stats = calculateStats(area.map)));
  return {
    version: 2,
    sessionTimestamp: Date.now(),
    starterPreset: preset,
    curAreaMapIndex: 0,
    actions: ["cleared", "warp", "equip", "quest"],
    areaMaps,
  };
};

export const serializeTracker = (source) => ({
  version: 2,
  sessionTimestamp: source.sessionTimestamp,
  starterPreset: source.starterPreset
    ? clone(normalizeStarterPreset(source.starterPreset))
    : null,
  curAreaMapIndex: source.curAreaMapIndex,
  actions: [...source.actions],
  maps: source.areaMaps.map(({ map }) => ({
    isHflipped: Boolean(map.isHflipped),
    isVflipped: Boolean(map.isVflipped),
    cellCount: cellsOf(map).length,
    cells: Object.fromEntries(
      cellsOf(map)
        .map((cell, index) => [index, storedCell(cell)])
        .filter(([, value]) => Object.keys(value).length),
    ),
  })),
});

export const getSharedState = (source = tracker) => {
  const { starterPreset, maps } = serializeTracker(source);
  return { starterPreset, maps };
};

const hydrateMaps = (target, maps = []) => {
  maps.forEach((savedMap, mapIndex) => {
    const map = target.areaMaps[mapIndex]?.map;
    if (!map) return;
    map.isHflipped = Boolean(savedMap.isHflipped);
    map.isVflipped = Boolean(savedMap.isVflipped);
    const cells = cellsOf(map);
    Object.entries(savedMap.cells ?? {}).forEach(([index, value]) => {
      if (cells[index]) Object.assign(cells[index], value);
    });
  });
  return target;
};

const migrateLegacy = (saved) => {
  const migrated = createTracker();
  if (!saved?.areaMaps) return migrated;
  const maps = saved.areaMaps.map(({ map }) => ({
    isHflipped: Boolean(map.isHflipped),
    isVflipped: Boolean(map.isVflipped),
    cells: Object.fromEntries(
      cellsOf(map)
        .map((cell, index) => [index, storedCell(cell)])
        .filter(([, value]) => Object.keys(value).length),
    ),
  }));
  return hydrateMaps(
    Object.assign(migrated, {
      sessionTimestamp: saved.sessionTimestamp || migrated.sessionTimestamp,
      curAreaMapIndex: saved.curAreaMapIndex || 0,
      actions: Array.isArray(saved.actions)
        ? [...saved.actions]
        : migrated.actions,
    }),
    maps,
  );
};

export const hydrateTracker = (saved) => {
  if (!saved || saved.version !== 2 || !Array.isArray(saved.maps))
    return migrateLegacy(saved);
  const fresh = createTracker(saved.starterPreset);
  return hydrateMaps(
    Object.assign(fresh, {
      sessionTimestamp: saved.sessionTimestamp || fresh.sessionTimestamp,
      starterPreset: normalizeStarterPreset(saved.starterPreset),
      curAreaMapIndex: Number.isInteger(saved.curAreaMapIndex)
        ? saved.curAreaMapIndex
        : 0,
      actions: Array.isArray(saved.actions)
        ? [...saved.actions]
        : fresh.actions,
    }),
    saved.maps,
  );
};

export const tracker = createTracker();
export const trackerState = writable(tracker);

const publish = () => {
  tracker.areaMaps.forEach(({ map }, index) => {
    tracker.areaMaps[index].stats = calculateStats(map);
  });
  trackerState.set(tracker);
};

let saveTimer;
export const trackerUpdated = () => {
  publish();
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => storage.saveData(serializeTracker(tracker)), 80);
};

const actionsStore = () => {
  const { subscribe, set } = writable([...tracker.actions]);
  return {
    subscribe,
    set,
    setPosition: (action, index) => {
      tracker.actions = tracker.actions.map((value, position) =>
        position === index ? action : value === action ? "" : value,
      );
      set([...tracker.actions]);
      trackerUpdated();
    },
  };
};
export const actions = actionsStore();

export const resetTracker = (saved, starterPreset) => {
  Object.assign(
    tracker,
    saved ? hydrateTracker(saved) : createTracker(starterPreset),
  );
  actions.set([...tracker.actions]);
  get(toolbars).hydrateAllMetadata(tracker.areaMaps);
  publish();
  return tracker;
};

export const replaceSharedState = (state) => {
  const local = serializeTracker(tracker);
  resetTracker({
    ...local,
    starterPreset:
      "starterPreset" in state ? state.starterPreset : local.starterPreset,
    maps: state.maps,
  });
  trackerUpdated();
};

export const getCell = (areaId, mapIndex = tracker.curAreaMapIndex) => {
  const map = tracker.areaMaps[mapIndex].map;
  const index = Number(areaId);
  return index >= map.rooms.length
    ? map.gridRegions?.[index - map.rooms.length]
    : map.rooms[index];
};

const setCell = (mapIndex, cellIndex, value) => {
  const cell = getCell(cellIndex, mapIndex);
  if (!cell) return false;
  delete cell.marked;
  delete cell.action;
  delete cell.notAcquired;
  delete cell.custom;
  Object.assign(cell, value);
  return true;
};

export const applyRemoteOperation = (operation) => {
  if (operation.kind === "cell")
    setCell(operation.mapIndex, operation.cellIndex, operation.value);
  else if (operation.kind === "map")
    Object.assign(
      tracker.areaMaps[operation.mapIndex]?.map ?? {},
      operation.value,
    );
  get(toolbars).hydrateAllMetadata(tracker.areaMaps);
  trackerUpdated();
};

export const updateMapData = (
  areaId,
  marked,
  actionName,
  areaMapIndex = tracker.curAreaMapIndex,
  excludeResend = false,
) => {
  const cell = getCell(areaId, areaMapIndex);
  if (!cell) return;
  if (actionName === "notYetAcquired" && !cell.marked) return;
  if (actionName === "notYetAcquired") cell.notAcquired = !cell.notAcquired;
  else if (actionName.startsWith("custom")) {
    const custom = Number(actionName.slice(6));
    cell.custom = cell.custom === custom ? undefined : custom;
  } else if (marked) {
    cell.marked = true;
    cell.action = actionName;
  } else {
    delete cell.marked;
    delete cell.action;
    delete cell.notAcquired;
    delete cell.custom;
  }
  const operation = {
    kind: "cell",
    mapIndex: areaMapIndex,
    cellIndex: Number(areaId),
    value: storedCell(cell),
  };
  if (!excludeResend) get(coopClient).sendOperation(operation);
  get(toolbars).hydrateAllMetadata(tracker.areaMaps);
  trackerUpdated();
};

export const updateMapMetadata = (
  areaMapIndex = tracker.curAreaMapIndex,
  property,
  value,
  excludeResend = false,
) => {
  if (!["isHflipped", "isVflipped"].includes(property)) return;
  tracker.areaMaps[areaMapIndex].map[property] = Boolean(value);
  const operation = {
    kind: "map",
    mapIndex: areaMapIndex,
    value: { [property]: Boolean(value) },
  };
  if (!excludeResend) get(coopClient).sendOperation(operation);
  trackerUpdated();
};

export const updateMapStats = (index) => {
  tracker.areaMaps[index].stats = calculateStats(tracker.areaMaps[index].map);
};
export const hydrateAllToolbarMetadata = () =>
  get(toolbars).hydrateAllMetadata(tracker.areaMaps);
export const loadState = async (key) =>
  hydrateTracker(await storage.loadData(key));
export const loadRawData = async (data) =>
  hydrateTracker(await storage.decodeRawData(data));
export const getRawData = async () => JSON.stringify(serializeTracker(tracker));

export const GlobalAction = {
  hyrule: { display: "Hyrule", hotkeys: ["h", "o", "`"], name: "Hyrule (Q1)" },
  brinstar: { display: "Brinstar", hotkeys: ["b"], name: "Brinstar" },
  norfair: { display: "Norfair", hotkeys: ["n"], name: "Norfair" },
  kraids: { display: "Kraid's", hotkeys: ["k"], name: "Kraid's" },
  ridleys: { display: "Ridley's", hotkeys: ["r"], name: "Ridley's" },
  ...Object.fromEntries(
    Array.from({ length: 9 }, (_, index) => {
      const level = index + 1;
      return [
        `level${level}`,
        {
          display: `Level ${level}`,
          hotkeys: [String(level)],
          name: `Level ${level} (Q1)`,
        },
      ];
    }),
  ),
  shopsandstats: {
    display: "Shops & stats",
    hotkeys: ["s"],
    name: "Shops & stats",
  },
};
