import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { WebSocket } from "ws";
import { createCoopServer } from "./server.js";

const sharedState = () => ({
  maps: [{ isHflipped: false, isVflipped: false, cellCount: 16, cells: {} }],
});
const connect = (url) =>
  new Promise((resolve, reject) => {
    const socket = new WebSocket(url);
    socket.once("open", () => resolve(socket));
    socket.once("error", reject);
  });
const inbox = (socket) => {
  const queued = [];
  const waiting = [];
  socket.on("message", (raw) => {
    const value = JSON.parse(raw.toString());
    const resolve = waiting.shift();
    if (resolve) resolve(value);
    else queued.push(value);
  });
  return () =>
    queued.length
      ? Promise.resolve(queued.shift())
      : new Promise((resolve) => waiting.push(resolve));
};

let app;
let url;
before(async () => {
  app = createCoopServer({ port: 0 });
  const address = await app.listen();
  url = `ws://127.0.0.1:${address.port}`;
});
after(() => app.close());

test("rooms retain authoritative state and broadcast ordered operations", async () => {
  const first = await connect(url);
  const firstMessage = inbox(first);
  first.send(
    JSON.stringify({
      v: 2,
      type: "join",
      roomId: "integration",
      clientId: "first",
      state: sharedState(),
    }),
  );
  assert.deepEqual(await firstMessage(), {
    v: 2,
    type: "snapshot",
    roomId: "integration",
    revision: 0,
    state: sharedState(),
  });

  first.send(
    JSON.stringify({
      v: 2,
      type: "operation",
      roomId: "integration",
      clientId: "first",
      operationId: "op-1",
      baseRevision: 0,
      operation: {
        kind: "cell",
        mapIndex: 0,
        cellIndex: 3,
        value: { marked: true, action: "bow" },
      },
    }),
  );
  assert.deepEqual(await firstMessage(), {
    v: 2,
    type: "ack",
    operationId: "op-1",
    revision: 1,
  });

  const second = await connect(url);
  const secondMessage = inbox(second);
  second.send(
    JSON.stringify({
      v: 2,
      type: "join",
      roomId: "integration",
      clientId: "second",
      state: sharedState(),
    }),
  );
  const snapshot = await secondMessage();
  assert.equal(snapshot.revision, 1);
  assert.deepEqual(snapshot.state.maps[0].cells[3], {
    marked: true,
    action: "bow",
  });

  second.send(
    JSON.stringify({
      v: 2,
      type: "operation",
      roomId: "integration",
      clientId: "second",
      operationId: "op-2",
      baseRevision: 1,
      operation: { kind: "map", mapIndex: 0, value: { isVflipped: true } },
    }),
  );
  assert.equal((await firstMessage()).type, "operation");
  assert.deepEqual(await secondMessage(), {
    v: 2,
    type: "ack",
    operationId: "op-2",
    revision: 2,
  });
  first.close();
  second.close();
});

test("invalid input receives a structured error", async () => {
  const socket = await connect(url);
  const nextMessage = inbox(socket);
  socket.send("not json");
  assert.deepEqual(await nextMessage(), {
    v: 2,
    type: "error",
    code: "invalid_json",
  });
  socket.close();
});
