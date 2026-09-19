import { env } from "$env/dynamic/public";
import { writable } from "svelte/store";
import {
  applyOperation,
  message,
  PROTOCOL_VERSION,
} from "../shared/protocol.js";

export const coopStatus = writable("offline");

const createClient = () => {
  let endpoint =
    env.PUBLIC_COOP_ENDPOINT ||
    (import.meta.env.DEV
      ? "ws://localhost:8080/"
      : "wss://z1m1-server.andypro.net:8081/");
  let socket;
  let roomId;
  let initialState;
  let onSnapshot;
  let onOperation;
  let revision = 0;
  let reconnectTimer;
  let reconnectAttempt = 0;
  let enabled = false;
  const clientId = crypto.randomUUID();
  const pending = new Map();

  const transmit = (operationId, operation) => {
    if (socket?.readyState !== WebSocket.OPEN) return;
    socket.send(
      message("operation", {
        roomId,
        clientId,
        operationId,
        baseRevision: revision,
        operation,
      }),
    );
  };

  const connect = () => {
    coopStatus.set(reconnectAttempt ? "reconnecting" : "connecting");
    socket = new WebSocket(endpoint);
    socket.addEventListener("open", () => {
      reconnectAttempt = 0;
      coopStatus.set("connected");
      socket.send(message("join", { roomId, clientId, state: initialState }));
    });
    socket.addEventListener("message", async (event) => {
      const raw =
        event.data instanceof Blob ? await event.data.text() : event.data;
      let incoming;
      try {
        incoming = JSON.parse(raw);
      } catch {
        return;
      }
      if (incoming.v !== PROTOCOL_VERSION) return;
      if (incoming.type === "snapshot") {
        revision = incoming.revision;
        initialState = incoming.state;
        onSnapshot(incoming.state);
        for (const [id, operation] of pending) {
          initialState = applyOperation(initialState, operation);
          onOperation(operation);
          transmit(id, operation);
        }
      } else if (incoming.type === "operation") {
        revision = Math.max(revision, incoming.revision);
        initialState = applyOperation(initialState, incoming.operation);
        onOperation(incoming.operation);
      } else if (incoming.type === "ack") {
        revision = Math.max(revision, incoming.revision);
        pending.delete(incoming.operationId);
      } else if (incoming.type === "error") {
        console.error(`Co-op server rejected a message: ${incoming.code}`);
      }
    });
    socket.addEventListener("close", () => {
      if (!enabled) return;
      coopStatus.set("reconnecting");
      const delay = Math.min(500 * 2 ** reconnectAttempt++, 15_000);
      reconnectTimer = setTimeout(connect, delay);
    });
    socket.addEventListener("error", () => socket.close());
  };

  return {
    setEndpoint: (value) => {
      endpoint = value;
    },
    enable: async (nextRoomId, state, snapshotHandler, operationHandler) => {
      enabled = true;
      roomId = nextRoomId;
      initialState = state;
      onSnapshot = snapshotHandler;
      onOperation = operationHandler;
      connect();
      return { succeeded: true };
    },
    disable: () => {
      enabled = false;
      clearTimeout(reconnectTimer);
      socket?.close();
      pending.clear();
      coopStatus.set("offline");
    },
    sendOperation: (operation) => {
      if (!enabled) return;
      const operationId = crypto.randomUUID();
      initialState = applyOperation(initialState, operation);
      pending.set(operationId, operation);
      transmit(operationId, operation);
    },
  };
};

export default writable(createClient());
