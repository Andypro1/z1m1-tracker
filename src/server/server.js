import { existsSync, readFileSync, watch } from "node:fs";
import { createServer as createHttpServer } from "node:http";
import { createServer as createHttpsServer } from "node:https";
import { fileURLToPath } from "node:url";
import { WebSocket, WebSocketServer } from "ws";
import {
  applyOperation,
  message,
  parseClientMessage,
} from "../shared/protocol.js";

const send = (socket, type, data) => {
  if (socket.readyState === WebSocket.OPEN) socket.send(message(type, data));
};

export const createCoopServer = ({
  port = 8080,
  host,
  certPath,
  keyPath,
  roomTtlMs = 30 * 60_000,
} = {}) => {
  if (Boolean(certPath) !== Boolean(keyPath))
    throw new Error("CERT_PATH and KEY_PATH must be provided together.");
  const rooms = new Map();
  const httpHandler = (request, response) => {
    response.writeHead(request.url === "/health" ? 200 : 404, {
      "content-type": "application/json",
    });
    response.end(
      JSON.stringify(
        request.url === "/health"
          ? { ok: true, protocol: 2, rooms: rooms.size }
          : { error: "not_found" },
      ),
    );
  };
  const tls =
    certPath && keyPath
      ? { cert: readFileSync(certPath), key: readFileSync(keyPath) }
      : null;
  const server = tls
    ? createHttpsServer(tls, httpHandler)
    : createHttpServer(httpHandler);
  const sockets = new WebSocketServer({ server, maxPayload: 256 * 1024 });
  let reloadTimer;
  const certificateWatchers = tls
    ? [certPath, keyPath].map((path) =>
        watch(path, () => {
          clearTimeout(reloadTimer);
          reloadTimer = setTimeout(
            () =>
              server.setSecureContext({
                cert: readFileSync(certPath),
                key: readFileSync(keyPath),
              }),
            500,
          );
        }),
      )
    : [];

  const leave = (socket) => {
    const room = rooms.get(socket.roomId);
    if (!room) return;
    room.clients.delete(socket);
    room.emptySince = room.clients.size ? null : Date.now();
  };

  sockets.on("connection", (socket) => {
    socket.isAlive = true;
    socket.on("pong", () => {
      socket.isAlive = true;
    });
    socket.on("message", (raw, isBinary) => {
      if (isBinary)
        return send(socket, "error", { code: "binary_not_supported" });
      const parsed = parseClientMessage(raw);
      if (parsed.error) return send(socket, "error", { code: parsed.error });
      const incoming = parsed.message;

      if (incoming.type === "join") {
        leave(socket);
        const room = rooms.get(incoming.roomId) ?? {
          state: structuredClone(incoming.state),
          revision: 0,
          clients: new Set(),
          seen: new Set(),
          emptySince: null,
        };
        rooms.set(incoming.roomId, room);
        room.clients.add(socket);
        room.emptySince = null;
        socket.roomId = incoming.roomId;
        socket.clientId = incoming.clientId;
        return send(socket, "snapshot", {
          roomId: incoming.roomId,
          revision: room.revision,
          state: room.state,
        });
      }

      const room = rooms.get(incoming.roomId);
      if (
        !room ||
        socket.roomId !== incoming.roomId ||
        socket.clientId !== incoming.clientId
      ) {
        return send(socket, "error", { code: "not_joined" });
      }
      const targetMap = room.state.maps[incoming.operation.mapIndex];
      if (
        !targetMap ||
        (incoming.operation.kind === "cell" &&
          incoming.operation.cellIndex >= targetMap.cellCount)
      ) {
        return send(socket, "error", { code: "invalid_operation" });
      }
      if (room.seen.has(incoming.operationId)) {
        return send(socket, "ack", {
          operationId: incoming.operationId,
          revision: room.revision,
        });
      }
      if (incoming.baseRevision > room.revision)
        return send(socket, "error", { code: "future_revision" });

      room.state = applyOperation(room.state, incoming.operation);
      room.revision += 1;
      room.seen.add(incoming.operationId);
      if (room.seen.size > 2_000)
        room.seen.delete(room.seen.values().next().value);
      for (const client of room.clients) {
        if (client !== socket)
          send(client, "operation", {
            roomId: incoming.roomId,
            clientId: incoming.clientId,
            operationId: incoming.operationId,
            revision: room.revision,
            operation: incoming.operation,
          });
      }
      send(socket, "ack", {
        operationId: incoming.operationId,
        revision: room.revision,
      });
    });
    socket.on("close", () => leave(socket));
  });

  const heartbeat = setInterval(() => {
    for (const socket of sockets.clients) {
      if (!socket.isAlive) socket.terminate();
      else {
        socket.isAlive = false;
        socket.ping();
      }
    }
    for (const [roomId, room] of rooms) {
      if (room.emptySince && Date.now() - room.emptySince >= roomTtlMs)
        rooms.delete(roomId);
    }
  }, 30_000);
  heartbeat.unref();

  return {
    server,
    rooms,
    listen: () =>
      new Promise((resolve, reject) => {
        server.once("error", reject);
        server.listen(port, host, () => {
          server.off("error", reject);
          resolve(server.address());
        });
      }),
    close: () =>
      new Promise((resolve) => {
        clearInterval(heartbeat);
        clearTimeout(reloadTimer);
        certificateWatchers.forEach((watcher) => watcher.close());
        for (const socket of sockets.clients) socket.terminate();
        sockets.close(() => server.close(resolve));
      }),
  };
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (existsSync(".env")) process.loadEnvFile();
  const app = createCoopServer({
    port: Number(process.env.PORT || process.argv[2] || 8080),
    host: process.env.HOST,
    certPath: process.env.CERT_PATH,
    keyPath: process.env.KEY_PATH,
  });
  const address = await app.listen();
  console.log(
    `Co-op protocol v2 listening on ${typeof address === "string" ? address : `${address.address}:${address.port}`}`,
  );
}
