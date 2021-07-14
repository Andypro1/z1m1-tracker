import WebSocket from 'ws';

const commManager = () => {
    let _rooms = [];


    const handleInit = (msg, userid, wss) => {
        console.log(`initt\'n\' ${userid}!`);

        if(msg.room) {
            const existingRoom = _rooms.filter(r => r.id === msg.room);

            if(existingRoom.length) {
                //  Joining an established room.  Ask for the full tracking
                //  data from user [0].

                const roomMasterId = existingRoom[0].users.find((u, i) => i === 0 && u);

                if(roomMasterId) {
                    const roomMasterClient = [...wss.clients].find(c => c.userid === roomMasterId);

                    if(roomMasterClient) {
                        if(roomMasterClient.readyState === WebSocket.OPEN) {
                            roomMasterClient.send(JSON.stringify({ name: 'sendAllData' }));
                            console.log(`Successfully queried room master for data.`);
                        }
                        else {
                            console.log(`Error: Room master broken socket.`);
                            return;
                        }
                    }
                    else {
                        console.log(`Error: Can't find room master for ${roomMasterId}.`);
                        return;
                    }
                }
                else {
                    console.log(`Error: Can't find room master for ${msg.room}.`);
                    return;
                }
            }
            else {
                //  Establishing a new room.

                _rooms.push({
                    id: msg.room,
                    users: [ userid ]
                });

                console.log(`Created new room ${msg.room} for room master ${userid}`);
            }

            return { success: existingRoom.length };
        }
        else {
            return { failed: 'room property not valid.' };
        }
    };


    const _directives = [
        { name: 'init', method: handleInit }
    ];

    
    const handleMessage = (msg, userid, wss) => {
        console.log(`handlin\' from ${userid}!`);

        if(typeof msg === 'string' && msg[0] === '{') {
            try {
                const msgObj = JSON.parse(msg);
                console.log(`parsed: ${JSON.stringify(msgObj)}`);

                if(msgObj && msgObj.name && _directives.filter(n => n.name === msgObj.name)) {
                    const res = _directives.filter(n => n.name === msgObj.name)[0]
                        .method(msgObj, userid, wss);

                    console.log(JSON.stringify(res));
                }
                else {
                    console.log(`Directive not found: ${JSON.stringify(msgObj)}`);
                }
            }
            catch(e) {
                console.log(`Error: ${e}`);
            }
        }
    };


    return {
        handleMessage
    };
};

export default commManager();