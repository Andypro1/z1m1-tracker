import { normalizeStarterPreset } from "./starter-presets.js";

export const createBuiltInStarterPresetCatalog = (files) => {
  const presets = Object.entries(files).map(([source, value]) => {
    const preset = normalizeStarterPreset(value);
    if (!preset) throw new Error(`Invalid built-in starter preset: ${source}`);
    return { ...preset, builtIn: true, source };
  });
  const ids = new Set();
  presets.forEach(({ id, source }) => {
    if (ids.has(id))
      throw new Error(
        `Duplicate built-in starter preset id “${id}”: ${source}`,
      );
    ids.add(id);
  });
  return presets.sort((a, b) => a.name.localeCompare(b.name));
};

const catalog = createBuiltInStarterPresetCatalog(
  import.meta.glob("../data/starter-presets/*.json", {
    eager: true,
    import: "default",
  }),
);

export const listBuiltInStarterPresets = () => structuredClone(catalog);
export const loadBuiltInStarterPreset = (id) =>
  structuredClone(catalog.find((preset) => preset.id === id) ?? null);
