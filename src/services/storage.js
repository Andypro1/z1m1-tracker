import { decompressFromUTF16 } from "../libs/async-lz-string.js";
import {
  listBuiltInStarterPresets,
  loadBuiltInStarterPreset,
} from "./starter-preset-catalog.js";
import { normalizeStarterPreset } from "./starter-presets.js";

const storageKeyPrefix = "z1m1.trackingdata.lzstring.";
const labelKeyPrefix = "z1m1.label.";
const sessionPresetKeyPrefix = "z1m1.session-preset.";
const presetKeyPrefix = "z1m1.starter-preset.";
const keyFor = (timestamp) => `${storageKeyPrefix}${timestamp}`;
const sessionPresetKeyFor = (timestamp) =>
  `${sessionPresetKeyPrefix}${timestamp}`;
const presetKeyFor = (id) => `${presetKeyPrefix}${id}`;

const listLocalStarterPresets = () =>
  Object.keys(localStorage)
    .filter((key) => key.startsWith(presetKeyPrefix))
    .map((key) => {
      try {
        const preset = normalizeStarterPreset(
          JSON.parse(localStorage.getItem(key)),
        );
        return preset ? { ...preset, builtIn: false } : null;
      } catch {
        return null;
      }
    })
    .filter(Boolean);

const decode = async (data) => {
  if (typeof data !== "string") return data;
  const json = data.trimStart().startsWith("{")
    ? data
    : await decompressFromUTF16(data);
  return JSON.parse(json);
};

const sessionPresetName = async (key) => {
  const cached = localStorage.getItem(sessionPresetKeyFor(key));
  if (cached) return cached;
  try {
    const data = await decode(localStorage.getItem(keyFor(key)));
    const name = data?.starterPreset?.name?.trim() || "Map defaults";
    localStorage.setItem(sessionPresetKeyFor(key), name);
    return name;
  } catch {
    return "Unknown preset";
  }
};

const storage = {
  listSaves: async () =>
    Promise.all(
      Object.keys(localStorage)
        .filter((key) => key.startsWith(storageKeyPrefix))
        .map((key) => Number(key.slice(storageKeyPrefix.length)))
        .filter(Number.isFinite)
        .sort((a, b) => b - a)
        .map(async (key) => ({
          key,
          display: new Date(key).toLocaleString(),
          label: localStorage.getItem(`${labelKeyPrefix}${key}`) || undefined,
          presetName: await sessionPresetName(key),
        })),
    ),
  saveData: (data) => {
    if (!data?.sessionTimestamp)
      throw new Error("A session timestamp is required.");
    localStorage.setItem(keyFor(data.sessionTimestamp), JSON.stringify(data));
    localStorage.setItem(
      sessionPresetKeyFor(data.sessionTimestamp),
      data.starterPreset?.name?.trim() || "Map defaults",
    );
  },
  packageData: (data) => JSON.stringify(data),
  loadCompressedData: (key) => localStorage.getItem(keyFor(key)),
  exists: (key) => localStorage.getItem(keyFor(key)) !== null,
  decodeRawData: decode,
  loadData: async (key) => decode(localStorage.getItem(keyFor(key))),
  deleteData: (key) => {
    localStorage.removeItem(keyFor(key));
    localStorage.removeItem(`${labelKeyPrefix}${key}`);
    localStorage.removeItem(sessionPresetKeyFor(key));
  },
  addLabel: (key, label) => {
    if (storage.exists(key))
      localStorage.setItem(`${labelKeyPrefix}${key}`, label);
  },
  listStarterPresets: () => {
    const builtIn = listBuiltInStarterPresets();
    const builtInIds = new Set(builtIn.map(({ id }) => id));
    return [
      ...builtIn,
      ...listLocalStarterPresets().filter(({ id }) => !builtInIds.has(id)),
    ].sort((a, b) => a.name.localeCompare(b.name));
  },
  loadStarterPreset: (id) => {
    const builtIn = loadBuiltInStarterPreset(id);
    if (builtIn) return builtIn;
    try {
      const preset = normalizeStarterPreset(
        JSON.parse(localStorage.getItem(presetKeyFor(id))),
      );
      return preset ? { ...preset, builtIn: false } : null;
    } catch {
      return null;
    }
  },
  saveStarterPreset: (value) => {
    const preset = normalizeStarterPreset(value);
    if (!preset) throw new Error("A valid starter preset is required.");
    if (loadBuiltInStarterPreset(preset.id))
      throw new Error("Built-in starter presets are read-only.");
    localStorage.setItem(presetKeyFor(preset.id), JSON.stringify(preset));
    return { ...preset, builtIn: false };
  },
  deleteStarterPreset: (id) => {
    if (loadBuiltInStarterPreset(id)) return false;
    localStorage.removeItem(presetKeyFor(id));
    return true;
  },
};

export default Object.freeze(storage);
