import { writable } from 'svelte/store';

const coopClient = () => {
    //  TODO: Configurify
    const endpoint = 'ws://localhost:8080/';
    let conn;
    let _modeEnabled = false;
    let _roomGuid;


    const startSession = async () => {
        try {
            conn = new WebSocket(endpoint);

            conn.onopen = () => {
                console.log(`socket open.  Sending roomGuid: ${_roomGuid}`);

                conn.send(JSON.stringify({ name: 'init', room: _roomGuid }));
            };
        
            conn.onmessage = async (e) => {
                if(e.data) {
                    if(e.data instanceof Blob) {
                        var content = await e.data.text();
                        console.log(content);
                        return content;
                    }
                    else { //string content
                        console.log(e.data);
                        return e.data;
                    }
                }
            };
        
            conn.onclose = () => {
                console.log('socket closed.');
            };
        }
        catch(e) {
            return { failed: e };
        }

        return { succeeded: 1 };
    };


    const enable = async (roomGuid) => {
        _modeEnabled = true;
        _roomGuid = roomGuid;

        const res = await startSession();

        if(res.failed)
            _modeEnabled = false;

        return res;
    };


    const disable = async () => {
        _modeEnabled = false;

        if(conn) {
            try {
                conn.close();
            }
            catch(e) {
                return { failed: e };
            }
        }

        return { succeeded: 'coop disabled' };
    };


    const send = (data, retries) => {
        if(!_modeEnabled)
            return;

        if(conn.readyState === WebSocket.OPEN) {
            conn.send(data);
            console.log(`sent: ${data}`);
        }
        else {
            if(typeof retries === 'undefined')
                retries = 3;
                
            if(retries > 0) {    
                retries -= 1;
                console.log(`could not send; retrying (retries remaining: ${retries}).`);

                setTimeout(() => send(data, retries), 500);
            }
        }
    };


    return {
        enable      : enable,
        disable     : disable,
        // onopen      : conn.onopen,
        // onmessage   : conn.onmessage,
        // onclose     : conn.onclose,
        send        : send
    };
};

export default writable(coopClient());