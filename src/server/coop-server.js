import WebSocket from 'ws';
import commManager from './comm-manager.mjs';


const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
    console.log(`connected: p:${ws.protocol} rs:${ws.readyState} u:${ws.url} b:${ws.binaryType}`);

    ws.on('message', function incoming(data) {
        console.log(`message: ${JSON.stringify(data)}`);

        commManager.handleMessage(data);

        wss.clients.forEach(function each(client) {
            if(client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });
});

console.log("listening on :8080");