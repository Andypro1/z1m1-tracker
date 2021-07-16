import { writable } from 'svelte/store';
import storage from './storage.js';


const coopClient = () => {
    //  TODO: Configurify
    const endpoint = 'wss://z1m1-server.andypro.net:8081/';
    let _pingTimer;
    const _pingTime = 45000;  //ms
    let conn;
    let _modeEnabled = false;
    let _roomGuid;
    let _myStorageKey;
    let _loadCallback;
    let _getSaveDataCallback;
    let _processDataCallback;
    let _processMetadataCallback;


    const handlePing = () => {
        console.log('ping');
        send(JSON.stringify({ name: 'ping' }));

        clearTimeout(_pingTimer);
        _pingTimer = setTimeout(() => { conn.close(); }, _pingTime);
    };

    const startSession = async () => {
        try {
            conn = new WebSocket(endpoint);


            conn.onopen = () => {
                console.log(`socket open.  Sending roomGuid: ${_roomGuid}`);

                handlePing();

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
                        else if(contentObj.name === 'metaUpdate') {
                            //  Map metadata update (flipped states, etc.)
                            processTrackerMetadata(...contentObj.data.split(' '));
                        }
                    }
                    else if(content.length && content.split(' ').length) {
                        //  Regular area update
                        processTrackerData(...content.split(' '));
                    }
                }
            };
        

            conn.onclose = () => {
                clearTimeout(_pingTimer);

                console.log('socket closed.');
            };
        }
        catch(e) {
            return { failed: e };
        }

        return { succeeded: 1 };
    };


    const enable = async (roomGuid, storageKey, loadCallback, getSaveDataCallback, processDataCallback, processMetadataCallback) => {
        _modeEnabled  = true;
        _roomGuid     = roomGuid;
        _myStorageKey = storageKey;
        _loadCallback = loadCallback;
        _getSaveDataCallback = getSaveDataCallback;
        _processDataCallback = processDataCallback;
        _processMetadataCallback = processMetadataCallback;
        
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
        _processDataCallback(areaId, marked, actionName, areaMapIndex, true);
    };

    const processTrackerMetadata = (areaMapIndex, propName, propValue) => {
        _processMetadataCallback(areaMapIndex, propName, propValue, true);
    };


    return {
        enable      : enable,
        disable     : disable,
        send        : send
    };
};

export default writable(coopClient());