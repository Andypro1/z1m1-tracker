import { describe, expect, it } from "vitest";
import { createTracker, hydrateTracker, serializeTracker } from "./tracker.js";
import {
  createStarterPreset,
  mapsForStarterPreset,
  starterPresetFromMaps,
} from "./starter-presets.js";

const firstUsableCell = (tracker) =>
  tracker.areaMaps[0].map.rooms.find(
    (cell) => !cell.outofbounds && cell.active !== false,
  );

describe("tracker sessions", () => {
  it("creates independent map data for every new session", () => {
    const first = createTracker();
    firstUsableCell(first).marked = true;
    expect(firstUsableCell(createTracker()).marked).toBeUndefined();
  });

  it("round-trips only mutable session data", () => {
    const original = createTracker();
    const cell = firstUsableCell(original);
    cell.marked = true;
    cell.action = "bow";
    original.areaMaps[0].map.isHflipped = true;
    const packed = serializeTracker(original);
    const restored = hydrateTracker(packed);
    expect(packed).not.toHaveProperty("areaMaps");
    expect(firstUsableCell(restored)).toMatchObject({
      marked: true,
      action: "bow",
    });
    expect(restored.areaMaps[0].map.isHflipped).toBe(true);
  });

  it("migrates full legacy saves", () => {
    const legacy = createTracker();
    delete legacy.version;
    firstUsableCell(legacy).notAcquired = true;
    const migrated = hydrateTracker(legacy);
    expect(migrated.version).toBe(2);
    expect(firstUsableCell(migrated).notAcquired).toBe(true);
  });

  it("preserves a starter preset when saving and restoring", () => {
    const maps = mapsForStarterPreset(
      createStarterPreset("test", "Test preset"),
    );
    maps[0].map.rooms[1].active = false;
    const preset = starterPresetFromMaps("test", "Test preset", maps);
    const restored = hydrateTracker(serializeTracker(createTracker(preset)));
    expect(restored.starterPreset).toEqual(preset);
    expect(restored.areaMaps[0].map.rooms[1].active).toBe(false);
  });
});
