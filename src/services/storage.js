import { decompressFromUTF16 } from "../libs/async-lz-string.js";
import { normalizeStarterPreset } from "./starter-presets.js";

const storageKeyPrefix = "z1m1.trackingdata.lzstring.";
const labelKeyPrefix = "z1m1.label.";
const presetKeyPrefix = "z1m1.starter-preset.";
const keyFor = (timestamp) => `${storageKeyPrefix}${timestamp}`;
const presetKeyFor = (id) => `${presetKeyPrefix}${id}`;

const decode = async (data) => {
  if (typeof data !== "string") return data;
  const json = data.trimStart().startsWith("{")
    ? data
    : await decompressFromUTF16(data);
  return JSON.parse(json);
};

const storage = {
  listSaves: () =>
    Object.keys(localStorage)
      .filter((key) => key.startsWith(storageKeyPrefix))
      .map((key) => Number(key.slice(storageKeyPrefix.length)))
      .filter(Number.isFinite)
      .sort((a, b) => b - a)
      .map((key) => ({
        key,
        display: new Date(key).toLocaleString(),
        label: localStorage.getItem(`${labelKeyPrefix}${key}`) || undefined,
      })),
  saveData: (data) => {
    if (!data?.sessionTimestamp)
      throw new Error("A session timestamp is required.");
    localStorage.setItem(keyFor(data.sessionTimestamp), JSON.stringify(data));
  },
  packageData: (data) => JSON.stringify(data),
  loadCompressedData: (key) => localStorage.getItem(keyFor(key)),
  exists: (key) => localStorage.getItem(keyFor(key)) !== null,
  decodeRawData: decode,
  loadData: async (key) => decode(localStorage.getItem(keyFor(key))),
  deleteData: (key) => {
    localStorage.removeItem(keyFor(key));
    localStorage.removeItem(`${labelKeyPrefix}${key}`);
  },
  addLabel: (key, label) => {
    if (storage.exists(key))
      localStorage.setItem(`${labelKeyPrefix}${key}`, label);
  },
  listStarterPresets: () =>
    Object.keys(localStorage)
      .filter((key) => key.startsWith(presetKeyPrefix))
      .map((key) => {
        try {
          return normalizeStarterPreset(JSON.parse(localStorage.getItem(key)));
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => a.name.localeCompare(b.name)),
  loadStarterPreset: (id) => {
    try {
      return normalizeStarterPreset(
        JSON.parse(localStorage.getItem(presetKeyFor(id))),
      );
    } catch {
      return null;
    }
  },
  saveStarterPreset: (value) => {
    const preset = normalizeStarterPreset(value);
    if (!preset) throw new Error("A valid starter preset is required.");
    localStorage.setItem(presetKeyFor(preset.id), JSON.stringify(preset));
    return preset;
  },
  deleteStarterPreset: (id) => localStorage.removeItem(presetKeyFor(id)),
};

export default Object.freeze(storage);
