import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import commManager from './comm-manager.mjs';


const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
    console.log(`connected: p:${ws.protocol} rs:${ws.readyState} u:${ws.url} b:${ws.binaryType}`);

    //  Generate a userid for this connection
    ws.userid = uuidv4();

    ws.on('message', function incoming(data) {
        console.log(`msg len: ${data.length}`);

        commManager.handleMessage(data, ws.userid, wss);

        ///  FOR DEBUG
        // wss.clients.forEach(function each(client) {
        //     if(client !== ws && client.readyState === WebSocket.OPEN) {
        //         client.send(data);
        //     }
        // });
    });

    ws.on('close', () => {
        commManager.handleLeave(ws.userid, wss);
    });
});

console.log("listening on :8080");