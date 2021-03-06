import { compressToUTF16, decompressFromUTF16 } from '../libs/async-lz-string.js';


const storage = () => {
    const storageKeyPrefix = 'z1m1.trackingdata.lzstring.';
    const labelKeyPrefix   = 'z1m1.label.';

    const listSaves = () => {
        const saves = Object.keys(localStorage)
            .filter(k => k.indexOf(storageKeyPrefix) >= 0)
            .map(k => +k.substring(k.lastIndexOf('.') + 1))
            .sort((a, b) => b - a)
            .map(k => { return { key: k, display: new Date(k) }})
            .map(r => { return {
                key: r.key,
                display: `${r.display.toLocaleDateString()} ${r.display.toLocaleTimeString()}`,
                label: localStorage[`${labelKeyPrefix}${r.key}`]
            }; });

        return saves;
    };

    const saveData = async (combinedData) => {
        if(!combinedData.sessionTimestamp) {
            console.error('Cannot save tracking data to storage: session timestamp not supplied.');
            return;
        }

        localStorage[`${storageKeyPrefix}${combinedData.sessionTimestamp}`] = await compressToUTF16(JSON.stringify(combinedData));
    };


    const packageData = async (combinedData) => {
        if(!combinedData.sessionTimestamp) {
            console.error('Cannot generate tracking data: session timestamp not supplied.');
            return;
        }

        return await compressToUTF16(JSON.stringify(combinedData));
    };

    const loadCompressedData = async (sessionTimestamp) => {
        if(!sessionTimestamp) {
            console.error('Cannot load tracking data from storage: session timestamp not supplied.');
            return;
        }

        return localStorage[`${storageKeyPrefix}${sessionTimestamp}`];
    };

    const exists = (sessionTimestamp) => {
        return typeof localStorage[`${storageKeyPrefix}${sessionTimestamp}`] !== 'undefined';
    };

    const decodeRawData = async (data) => {
        return JSON.parse(
            await decompressFromUTF16(data)
        );
    };

    const loadData = async (sessionTimestamp) => {
        if(!sessionTimestamp) {
            console.error('Cannot load tracking data from storage: session timestamp not supplied.');
            return;
        }

        return JSON.parse(
            await decompressFromUTF16(
                localStorage[`${storageKeyPrefix}${sessionTimestamp}`]
            )
        );
    };

    const deleteData = (sessionTimestamp) => {
        if(!sessionTimestamp || !localStorage[`${storageKeyPrefix}${sessionTimestamp}`])
            return;

        localStorage.removeItem(`${storageKeyPrefix}${sessionTimestamp}`);
    };

    const addLabel = async (sessionTimestamp, labelText) => {
        if(!sessionTimestamp || !localStorage[`${storageKeyPrefix}${sessionTimestamp}`])
            return;

        localStorage[`${labelKeyPrefix}${sessionTimestamp}`] = labelText;
    };

    return Object.freeze({
        exists            : exists,
        packageData       : packageData,
        saveData          : saveData,
        loadData          : loadData,
        loadCompressedData: loadCompressedData,
        decodeRawData     : decodeRawData,
        deleteData        : deleteData,
        listSaves         : listSaves,
        addLabel          : addLabel
    });
};

export default storage();