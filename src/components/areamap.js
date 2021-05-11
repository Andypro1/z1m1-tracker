import tilesheet from './tilesheet';

const areamap = function(displayname, tilesheet, roomstates, mapState) {
    var _displayName;
    var _tilesheet;
    var _roomStates;
    let _mapState;
    let _Paths;

    const markRoom = (roomId, value) => {
        const state = _roomStates.filter((val) => val === value);

        if(state == undefined) {
            console.error(`Ignoring invalid room state for map ${_displayName}: "${value}."`);
            return;
        }

        _mapState[roomId] = state;
    };

    const addPath = (pathRoomIds) => {
        return undefined;  //TODO
    };

    const removePath = (pathId) => {
        return undefined;  //TODO
    }

    //  populate properties
    _displayName = displayname;
    _tilesheet = tilesheet;
    _roomStates = roomstates;
    _mapState = mapState;

    return Object.freeze({
        markRoom: markRoom,
        addPath: addPath,
        removePath: removePath
    });
};

export default areamap;