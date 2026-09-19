import { mapCatalog } from "../components/maps/catalog.js";

export const STARTER_PRESET_VERSION = 1;

export const cellsOf = (map) =>
  map.gridRegions ? [...map.rooms, ...map.gridRegions] : map.rooms;

const inactiveCells = (map) =>
  cellsOf(map)
    .map((cell, index) => (cell.active === false ? index : -1))
    .filter((index) => index >= 0);

const defaultInactive = new Map(
  mapCatalog.map(([name, map]) => [name, inactiveCells(map)]),
);

export const normalizeStarterPreset = (value) => {
  if (
    !value ||
    typeof value.id !== "string" ||
    !value.id.trim() ||
    typeof value.name !== "string" ||
    !value.name.trim() ||
    !Array.isArray(value.maps)
  )
    return null;
  const supplied = new Map(value.maps.map((map) => [map?.name, map]));
  return {
    version: STARTER_PRESET_VERSION,
    id: value.id.trim().slice(0, 100),
    name: value.name.trim().slice(0, 100),
    maps: mapCatalog.map(([name, map]) => {
      const cells = cellsOf(map);
      const inactive = supplied.get(name)?.inactive;
      return {
        name,
        inactive: [
          ...new Set(
            (Array.isArray(inactive) ? inactive : defaultInactive.get(name))
              .filter(Number.isInteger)
              .filter(
                (index) =>
                  index >= 0 &&
                  index < cells.length &&
                  !cells[index].outofbounds,
              ),
          ),
        ].sort((a, b) => a - b),
      };
    }),
  };
};

export const starterPresetFromMaps = (id, name, areaMaps) =>
  normalizeStarterPreset({
    id,
    name,
    maps: areaMaps.map((area) => ({
      name: area.name,
      inactive: inactiveCells(area.map),
    })),
  });

export const createStarterPreset = (id, name = "New preset") =>
  starterPresetFromMaps(
    id,
    name,
    mapCatalog.map(([mapName, map]) => ({
      name: mapName,
      map: structuredClone(map),
    })),
  );

export const applyStarterPreset = (areaMaps, value) => {
  const preset = normalizeStarterPreset(value);
  if (!preset) return areaMaps;
  const maps = new Map(preset.maps.map((map) => [map.name, map.inactive]));
  areaMaps.forEach((area) => {
    const inactive = new Set(maps.get(area.name) ?? []);
    cellsOf(area.map).forEach((cell, index) => {
      if (cell.outofbounds) return;
      if (inactive.has(index)) cell.active = false;
      else delete cell.active;
    });
  });
  return areaMaps;
};

export const mapsForStarterPreset = (preset) =>
  applyStarterPreset(
    mapCatalog.map(([name, map]) => ({
      name,
      map: structuredClone(map),
    })),
    preset,
  );
