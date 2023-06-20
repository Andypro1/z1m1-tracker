import fs from 'fs';
import https from 'https';
import { WebSocketServer } from 'ws';
import crypto from 'crypto';
import commManager from './comm-manager.mjs';
import { envport, envcertpath, envkeypath } from './config.mjs';

var args = process.argv.slice(2);

const port     = args[0] || envport;
const certpath = args[1] || envcertpath;
const keypath  = args[2] || envkeypath;

if(!port || !certpath || !keypath) {
    console.log('Usage: node coop-wss-server.js <port> <certPath> <keyPath>\nOr create a .env file with PORT, CERT_PATH, and KEY_PATH values.')
    process.exit();
}

//  From https://stackoverflow.com/questions/63325281/how-to-automatically-reload-updated-ssl-certificates-in-node-js-application
function readCertsSync() {
    return {
        cert: fs.readFileSync(certpath),
        key : fs.readFileSync(keypath)
    }
}

const server = https.createServer(readCertsSync());

let waitForFilesSettle;

fs.watch(certpath, () => {
    clearTimeout(waitForFilesSettle);

    waitForFilesSettle = setTimeout(() => {
        server.setSecureContext(readCertsSync());
        console.log(`${(new Date()).toLocaleString()} [certs]: New TLS cert detected; context reloaded.`);
    }, 1000);
});

const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws, req) {
    console.log(`${(new Date()).toLocaleString()} [conn]: New user ${req.socket.remoteAddress}`);

    //  Generate a userid for this connection
    ws.userid = crypto.randomUUID();

    ws.on('message', function incoming(data, isBinary) {
        const msg = isBinary ? data : data.toString();

        commManager.handleMessage(msg, ws.userid, wss);
    });

    ws.on('close', () => {
        commManager.handleLeave(ws.userid, wss);
    });
});

server.listen(port);
console.log(`listening on :${port}`);