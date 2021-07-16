import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import commManager from './comm-manager.mjs';


const wss = new WebSocket.Server({ port: 8080 });

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

console.log("listening on :8080");