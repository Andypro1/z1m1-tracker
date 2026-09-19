import { beforeEach, describe, expect, it, vi } from "vitest";
import { compressToUTF16 } from "../libs/async-lz-string.js";
import storage from "./storage.js";

class MemoryStorage {
  getItem(key) {
    return this[key] ?? null;
  }

  setItem(key, value) {
    this[key] = String(value);
  }

  removeItem(key) {
    delete this[key];
  }
}

describe("saved session presets", () => {
  beforeEach(() => vi.stubGlobal("localStorage", new MemoryStorage()));

  it("lists and caches the preset embedded in an existing save", async () => {
    localStorage.setItem(
      "z1m1.trackingdata.lzstring.123",
      await compressToUTF16(
        JSON.stringify({ starterPreset: { name: "Original preset" } }),
      ),
    );

    expect(await storage.listSaves()).toEqual([
      expect.objectContaining({ key: 123, presetName: "Original preset" }),
    ]);
    expect(localStorage.getItem("z1m1.session-preset.123")).toBe(
      "Original preset",
    );
  });

  it("labels sessions without a preset as map defaults", async () => {
    storage.saveData({ sessionTimestamp: 456, starterPreset: null });

    expect(await storage.listSaves()).toEqual([
      expect.objectContaining({ key: 456, presetName: "Map defaults" }),
    ]);
  });
});
