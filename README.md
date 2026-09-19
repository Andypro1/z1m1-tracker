# Z1M1 Tracker

A responsive solo and cooperative progress tracker for the Zelda 1 / Metroid 1 crossover randomizer.

## Requirements

- Node.js 22.12 or newer (Node 24 is also supported)
- npm 10 or newer

## Development

```sh
npm install
npm run dev
```

Run the client and co-op server together with `npm run dev:all`. Other useful checks are:

```sh
npm run check
npm run lint
npm test
npm run build
```

The static production site is written to `build/`. Netlify is configured to serve `200.html` as the SPA fallback.

## Co-op server

The server implements protocol v2: an authoritative in-memory room state with validated JSON operations, ordered revisions, operation deduplication, reconnect replay, WebSocket heartbeats, and a `/health` endpoint.

```sh
npm run server
```

Configuration can be supplied in `src/server/.env`:

```dotenv
PORT=8080
HOST=0.0.0.0
CERT_PATH=/path/to/fullchain.pem
KEY_PATH=/path/to/privkey.pem
```

Leave both certificate paths unset for plain WebSockets. When TLS is enabled, certificate changes are reloaded without restarting the process. Set `PUBLIC_COOP_ENDPOINT` in the client build environment when the server is not hosted at the default endpoint.

Protocol messages use this envelope:

```json
{
  "v": 2,
  "type": "operation",
  "roomId": "...",
  "clientId": "...",
  "operationId": "...",
  "baseRevision": 0,
  "operation": {}
}
```

Clients join with a sparse map snapshot. Subsequent `cell` and `map` operations contain only the changed state; the server replies with snapshots, acknowledgements, broadcasts, or structured errors.

## Client behavior

- Sessions use fresh cloned map definitions, so starting a new tracker never inherits stale state.
- Saves contain only mutable cell/orientation data. Existing compressed saves are migrated when opened.
- The map uses container-based sizing and retains a minimum cell target size. Dense maps pan inside their viewport rather than forcing the whole page to overflow.
- The controls and area selector can be collapsed independently and start collapsed on viewports up to 700px wide.

## Publishing starter presets

Starter presets created in `/dev/presets` are local to that browser until they
are added to the repository. To publish one for every user:

1. Open `/dev/presets`, create or edit the preset, and select **Download JSON**.
2. Place the downloaded file in `src/data/starter-presets/`.
3. Run `npm test` and `npm run build`.
4. Commit the JSON file and deploy the rebuilt application.

Every `*.json` file in that directory is validated and bundled automatically.
Published IDs must be unique. Published presets are read-only in the editor;
use **Duplicate** to create an editable browser-local copy.
