import fs from 'fs';
import https from 'https';
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import commManager from './comm-manager.mjs';

const server = https.createServer({
    cert: fs.readFileSync('/home/ap/servers/certs/fullchain.pem'),
    key : fs.readFileSync('/home/ap/servers/certs/privkey.pem')
});

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, req) {
    console.log(`[conn]: New user ${req.socket.remoteAddress}`);

    //  Generate a userid for this connection
    ws.userid = uuidv4();

    ws.on('message', function incoming(data) {
        // console.log(`msg len: ${data.length}`);

        commManager.handleMessage(data, ws.userid, wss);
    });

    ws.on('close', () => {
        commManager.handleLeave(ws.userid, wss);
    });
});

server.listen(8081);
console.log("listening on :8081");