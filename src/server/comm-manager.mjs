import WebSocket from 'ws';

const commManager = () => {
    let _rooms = [
        /*  Schema: 
        { id: roomId,
             users: [
                'room-master-uuid',
                'second-user-uuid',
                ...
            ]
        },
        ... */
    ];


    const handleInit = (msg, userid, wss) => {
        console.log(`initt\'n\' ${userid}!`);

        if(msg.room) {
            const existingRoom = _rooms.find(r => r.id === msg.room);

            if(existingRoom) {
                //  Joining an established room.  Ask for the full tracking
                //  data from user [0].

                const roomMasterId = existingRoom.users.find((u, i) => i === 0 && u);

                if(roomMasterId) {
                    const roomMasterClient = [...wss.clients].find(c => c.userid === roomMasterId);

                    if(roomMasterClient) {
                        if(roomMasterClient.readyState === WebSocket.OPEN) {
                            roomMasterClient.send(JSON.stringify({ name: 'sendAllData' }));
                            console.log(`Successfully queried room master for data.`);

                            _rooms.find(r => r.id === msg.room).users.push(userid);
                            console.log(`Let myself in as a guest for room ${msg.room}`);
                        }
                        else {
                            console.log(`handleInit() error: Room master broken socket.`);
                            return;
                        }
                    }
                    else {
                        //  No one in here; I assume room master responsibilities
                        _rooms.find(r => r.id === msg.room).users.push(userid);

                        console.log(`handleInit() error: Room master broken socket!  Inheriting room master for ${msg.room}.`);
                        return;
                    }
                }
                else {
                    //  No one in here; I assume room master responsibilities
                    _rooms.find(r => r.id === msg.room).users.push(userid);

                    console.log(`${userid} inherits room master role for empty room ${msg.room}.`);
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

            return { success: `room json: ${JSON.stringify(existingRoom)}` };
        }
        else {
            return { failed: 'room property not valid.' };
        }
    };


    const distributeTrackerData = (msg, userid, wss) => {
        const myRoom = _rooms.find(r => r.users.includes(userid));

        if(myRoom?.users?.[0] === userid) {
            console.log(`Found room that I lead; sending tracking data to other occupants.`);

            [...wss.clients]
                .filter(c => myRoom.users.includes(c.userid) && c.userid !== userid)
                .forEach(function each(client) {
                    if(client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(msg));
                    }
                });

            console.log(`Sent tracking data to room occupants.`);
        }
    };


    const distributeMapData = (msg, userid, wss) => {
        const myRoom = _rooms.find(r => r.users.includes(userid));

        [...wss.clients]
        .filter(c => myRoom.users.includes(c.userid) && c.userid !== userid)
        .forEach(function each(client) {
            if(client.readyState === WebSocket.OPEN) {
                client.send(msg);
            }
        });

        console.log(`Sent map data to room occupants.`);
    };


    const _directives = [
        { name: 'init', method: handleInit },
        { name: 'allData', method: distributeTrackerData },
        { name: 'mapData', method: distributeMapData }
    ];

    
    const handleMessage = (msg, userid, wss) => {
        console.log(`handlin\' len(${msg.length}) from ${userid}!`);

        if(typeof msg === 'string' && msg[0] === '{') {
            try {
                const msgObj = JSON.parse(msg);
                // console.log(`parsed: ${JSON.stringify(msgObj)}`);

                if(msgObj && msgObj.name && _directives.filter(n => n.name === msgObj.name)) {
                    const res = _directives.filter(n => n.name === msgObj.name)[0]
                        .method(msgObj, userid, wss);

                    console.log(`msgpump process response: ${JSON.stringify(res)}`);
                }
                else {
                    console.log(`Directive not found: ${JSON.stringify(msgObj)}`);
                }
            }
            catch(e) {
                console.log(`handleMessage() error: ${e}`);
            }
        }
        else if(typeof msg === 'string' && (msg.split(' ').length > 2)) {
            //  Regular map update data
            _directives.find(n => n.name === 'mapData').method(msg, userid, wss);
        }
    };


    const handleLeave = (userid, wss) => {
        console.log(`${userid} is outta here.`);

        try {
            //  Remove the leaving user from all rooms
            _rooms = _rooms.map(r => {
                r.users = r.users.filter(u => u !== userid);
                return r;
            });

            console.log(`${userid} removed from all room lists.`);

            _rooms = _rooms.filter(r => r.users.length > 0);

            console.log(`Destroyed empty rooms.`);
        }
        catch(e) {
            console.log(`handleLeave() error: ${e}`);
        }
    };


    return {
        handleMessage,
        handleLeave
    };
};

export default commManager();