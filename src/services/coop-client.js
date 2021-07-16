import { writable } from 'svelte/store';
import storage from './storage.js';


const coopClient = () => {
    //  TODO: Configurify
    const endpoint = 'ws://z1m1-server.andypro.net:8080/';
    let conn;
    let _modeEnabled = false;
    let _roomGuid;
    let _myStorageKey;
    let _loadCallback;
    let _getSaveDataCallback;
    let _processDataCallback;


    const startSession = async () => {
        try {
            conn = new WebSocket(endpoint);

            conn.onopen = () => {
                console.log(`socket open.  Sending roomGuid: ${_roomGuid}`);

                conn.send(JSON.stringify({ name: 'init', room: _roomGuid }));
            };
        
            conn.onmessage = async (e) => {
                let content = undefined;
                let contentObj = undefined;

                if(e.data) {
                    if(e.data instanceof Blob) {
                        content = await e.data.text();
                    }
                    else { //string content
                        content = e.data;
                    }

                    console.log(`[rcv'd len]: ${content.length}`);
                    
                    if(content && content[0] === '{') {
                        try {
                            contentObj = JSON.parse(content);
                        }
                        catch(e) {
                            console.log(`Error: ${e}`);
                        }

                        
                        if(contentObj.name === 'sendAllData') {
                            sendAllData();
                        }
                        else if(contentObj.name === 'allData') {
                            loadAllData(contentObj.data);
                        }
                    }
                    else if(content.length && content.split(' ').length) {
                        //  Regular area update
                        processTrackerData(...content.split(' '));
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


    const enable = async (roomGuid, storageKey, loadCallback, getSaveDataCallback, processDataCallback) => {
        _modeEnabled  = true;
        _roomGuid     = roomGuid;
        _myStorageKey = storageKey;
        _loadCallback = loadCallback;
        _getSaveDataCallback = getSaveDataCallback;
        _processDataCallback = processDataCallback;
        
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
            console.log(`sent length: ${data.length}`);
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


    const sendAllData = async () => {
        let data;
        
        if(storage.exists(_myStorageKey)) {
            data = await storage.loadCompressedData(_myStorageKey);
        }
        else {
            data = await _getSaveDataCallback();
        }

        send(JSON.stringify({ name: 'allData', data: data }));
    };


    const loadAllData = async (data) => {
        _loadCallback(data);
    };

    const processTrackerData = (areaMapIndex, areaId, marked, actionName) => {
        //${tracker.curAreaMapIndex} ${areaId} ${marked} ${actionName}
        _processDataCallback(areaId, marked, actionName, areaMapIndex, true);
    };


    return {
        enable      : enable,
        disable     : disable,
        send        : send
    };
};

export default writable(coopClient());