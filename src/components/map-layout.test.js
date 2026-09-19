import { describe, expect, it } from "vitest";
import {
  chooseMapLayout,
  fittedMapArea,
  solveMapLayout,
} from "./map-layout.js";

describe("map layout", () => {
  it("fits a map without changing its aspect ratio", () => {
    expect(fittedMapArea(1_200, 400, 2)).toBe(320_000);
    expect(fittedMapArea(500, 800, 2)).toBe(125_000);
  });

  it("puts bars above and below a wide overworld map", () => {
    expect(
      chooseMapLayout({
        width: 1_265,
        height: 707,
        aspect: 2048 / 704,
        controlsOpen: true,
        areasOpen: true,
      }),
    ).toBe("horizontal");
  });

  it("gives unused map height back to open horizontal bars", () => {
    const result = solveMapLayout({
      width: 1_280,
      height: 720,
      aspect: 2048 / 704,
      controlsOpen: true,
      areasOpen: true,
    });
    expect(result.layout).toBe("horizontal");
    expect(result.mapWidth).toBeCloseTo(1_280);
    expect(result.controlSize + result.mapHeight + result.areaSize).toBeCloseTo(
      720,
    );
  });

  it("reserves two toolbar rows plus scrolling for tall level maps", () => {
    const result = solveMapLayout({
      width: 878,
      height: 1_242,
      aspect: 8 / 11,
      controlsOpen: true,
      areasOpen: true,
    });
    expect(result.layout).toBe("horizontal");
    expect(result.controlSize).toBe(160);
  });

  it("puts bars beside a squarer dungeon map", () => {
    expect(
      chooseMapLayout({
        width: 1_265,
        height: 707,
        aspect: 128 / 88,
        controlsOpen: true,
        areasOpen: true,
      }),
    ).toBe("vertical");
  });

  it("keeps controls horizontal on a narrow viewport", () => {
    expect(
      chooseMapLayout({
        width: 390,
        height: 844,
        aspect: 128 / 88,
        controlsOpen: false,
        areasOpen: false,
      }),
    ).toBe("horizontal");
  });
});
