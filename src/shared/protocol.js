export const PROTOCOL_VERSION = 2;

const isRecord = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);
const isIndex = (value, maximum = Number.MAX_SAFE_INTEGER) =>
  Number.isSafeInteger(value) && value >= 0 && value < maximum;
const isBoolean = (value) => typeof value === "boolean";
const isStarterPreset = (value) =>
  isRecord(value) &&
  value.version === 1 &&
  typeof value.id === "string" &&
  value.id.length > 0 &&
  value.id.length <= 100 &&
  typeof value.name === "string" &&
  value.name.length > 0 &&
  value.name.length <= 100 &&
  Array.isArray(value.maps) &&
  value.maps.length <= 64 &&
  value.maps.every(
    (map) =>
      isRecord(map) &&
      typeof map.name === "string" &&
      map.name.length > 0 &&
      map.name.length <= 100 &&
      Array.isArray(map.inactive) &&
      map.inactive.every((index) => isIndex(index, 4097)),
  );

const isCellValue = (value) => {
  if (!isRecord(value)) return false;
  const keys = Object.keys(value);
  return (
    keys.length <= 4 &&
    keys.every((key) => {
      if (key === "marked" || key === "notAcquired")
        return isBoolean(value[key]);
      if (key === "action")
        return typeof value[key] === "string" && value[key].length <= 64;
      if (key === "custom") return value[key] === 1 || value[key] === 2;
      return false;
    })
  );
};

export const isSharedState = (state) =>
  isRecord(state) &&
  (!("starterPreset" in state) ||
    state.starterPreset === null ||
    isStarterPreset(state.starterPreset)) &&
  Array.isArray(state.maps) &&
  state.maps.length > 0 &&
  state.maps.length <= 64 &&
  state.maps.every(
    (map) =>
      isRecord(map) &&
      isBoolean(map.isHflipped) &&
      isBoolean(map.isVflipped) &&
      isIndex(map.cellCount, 4097) &&
      isRecord(map.cells) &&
      Object.entries(map.cells).every(
        ([index, value]) =>
          isIndex(Number(index), map.cellCount) && isCellValue(value),
      ),
  );

export const isOperation = (operation) => {
  if (!isRecord(operation) || !isIndex(operation.mapIndex, 64)) return false;
  if (operation.kind === "cell")
    return isIndex(operation.cellIndex, 4096) && isCellValue(operation.value);
  return (
    operation.kind === "map" &&
    isRecord(operation.value) &&
    Object.keys(operation.value).length > 0 &&
    Object.entries(operation.value).every(
      ([key, value]) =>
        (key === "isHflipped" || key === "isVflipped") && isBoolean(value),
    )
  );
};

export const parseClientMessage = (raw) => {
  let message;
  try {
    message = JSON.parse(String(raw));
  } catch {
    return { error: "invalid_json" };
  }

  if (!isRecord(message) || message.v !== PROTOCOL_VERSION)
    return { error: "unsupported_protocol" };
  if (message.type === "join") {
    if (
      typeof message.roomId !== "string" ||
      !/^[\w-]{1,100}$/.test(message.roomId)
    )
      return { error: "invalid_room" };
    if (
      typeof message.clientId !== "string" ||
      !/^[\w-]{1,100}$/.test(message.clientId)
    )
      return { error: "invalid_client" };
    if (!isSharedState(message.state)) return { error: "invalid_state" };
    return { message };
  }

  if (message.type === "operation") {
    if (
      typeof message.roomId !== "string" ||
      !/^[\w-]{1,100}$/.test(message.roomId)
    )
      return { error: "invalid_room" };
    if (
      typeof message.clientId !== "string" ||
      !/^[\w-]{1,100}$/.test(message.clientId)
    )
      return { error: "invalid_client" };
    if (
      typeof message.operationId !== "string" ||
      !/^[\w-]{1,100}$/.test(message.operationId)
    )
      return { error: "invalid_operation_id" };
    if (!isIndex(message.baseRevision) || !isOperation(message.operation))
      return { error: "invalid_operation" };
    return { message };
  }

  return { error: "unknown_message" };
};

export const applyOperation = (state, operation) => {
  if (
    !isSharedState(state) ||
    !isOperation(operation) ||
    !state.maps[operation.mapIndex]
  )
    return state;
  const map = state.maps[operation.mapIndex];
  if (operation.kind === "cell" && operation.cellIndex >= map.cellCount)
    return state;
  const updatedMap =
    operation.kind === "cell"
      ? {
          ...map,
          cells: { ...map.cells, [operation.cellIndex]: operation.value },
        }
      : { ...map, ...operation.value };
  const maps = state.maps.with(operation.mapIndex, updatedMap);
  return { ...state, maps };
};

export const message = (type, data = {}) =>
  JSON.stringify({ v: PROTOCOL_VERSION, type, ...data });
