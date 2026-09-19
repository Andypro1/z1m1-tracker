import { describe, expect, it } from "vitest";
import {
  applyStarterPreset,
  cellsOf,
  createStarterPreset,
  mapsForStarterPreset,
  normalizeStarterPreset,
  starterPresetFromMaps,
} from "./starter-presets.js";

describe("starter presets", () => {
  it("captures and restores inactive cells", () => {
    const preset = createStarterPreset("default", "Default");
    const maps = mapsForStarterPreset(preset);
    const hyrule = maps.find(({ name }) => name === "Hyrule (Q1)");
    expect(cellsOf(hyrule.map)[0].active).toBe(false);
    expect(cellsOf(hyrule.map)[1].active).toBeUndefined();
  });

  it("creates a complete preset from edited maps", () => {
    const maps = mapsForStarterPreset(createStarterPreset("edited", "Edited"));
    const hyrule = maps.find(({ name }) => name === "Hyrule (Q1)");
    delete cellsOf(hyrule.map)[0].active;
    cellsOf(hyrule.map)[1].active = false;
    const preset = starterPresetFromMaps("edited", "Edited", maps);
    expect(preset.maps[0].inactive).not.toContain(0);
    expect(preset.maps[0].inactive).toContain(1);
  });

  it("rejects invalid presets and ignores invalid cell indices", () => {
    expect(normalizeStarterPreset({})).toBeNull();
    const preset = normalizeStarterPreset({
      id: "safe",
      name: "Safe",
      maps: [{ name: "Hyrule (Q1)", inactive: [-1, 1, 9_999] }],
    });
    const maps = mapsForStarterPreset(createStarterPreset("base", "Base"));
    applyStarterPreset(maps, preset);
    expect(preset.maps[0].inactive).toEqual([1]);
    expect(cellsOf(maps[0].map)[1].active).toBe(false);
  });
});
