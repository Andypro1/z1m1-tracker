import { describe, expect, it } from "vitest";
import {
  applyOperation,
  isSharedState,
  parseClientMessage,
} from "./protocol.js";

const state = () => ({
  maps: [{ isHflipped: false, isVflipped: false, cellCount: 16, cells: {} }],
});

describe("protocol v2", () => {
  it("validates join messages and rejects unknown operations", () => {
    expect(
      parseClientMessage(
        JSON.stringify({
          v: 2,
          type: "join",
          roomId: "room-1",
          clientId: "client-1",
          state: state(),
        }),
      ).error,
    ).toBeUndefined();
    expect(
      parseClientMessage(
        JSON.stringify({
          v: 2,
          type: "operation",
          roomId: "room-1",
          clientId: "client-1",
          operationId: "op-1",
          baseRevision: 0,
          operation: { kind: "delete" },
        }),
      ).error,
    ).toBe("invalid_operation");
  });

  it("applies cell and map operations immutably", () => {
    const original = state();
    const marked = applyOperation(original, {
      kind: "cell",
      mapIndex: 0,
      cellIndex: 7,
      value: { marked: true, action: "bow" },
    });
    const flipped = applyOperation(marked, {
      kind: "map",
      mapIndex: 0,
      value: { isHflipped: true },
    });
    expect(original.maps[0].cells).toEqual({});
    expect(flipped.maps[0]).toMatchObject({
      isHflipped: true,
      cells: { 7: { marked: true, action: "bow" } },
    });
    expect(isSharedState(flipped)).toBe(true);
  });

  it("accepts starter preset masks in shared state", () => {
    expect(
      isSharedState({
        ...state(),
        starterPreset: {
          version: 1,
          id: "open-world",
          name: "Open world",
          maps: [{ name: "Hyrule (Q1)", inactive: [1, 5, 12] }],
        },
      }),
    ).toBe(true);
  });
});
