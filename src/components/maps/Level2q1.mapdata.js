const map = {
    class: 'level2 dungeon',
    shadowColor: 'rgb(32, 56, 236)',
    pixelWidth: 2048,
    pixelHeight: 1408,
    rows: 16,
    cols: 16,
    sectionRows: 8,
    sectionCols: 4,
    sectionStartCell: 12,
    isHflipped: false,
    isVflipped: false,
    getRooms: () => {
        //  Refactor into map() methods and use Object.freeze() return pattern for export.
        if(!map.isHflipped && !map.isVflipped)
            return map.rooms;

        if(map.isHflipped && !map.isVflipped) {
            return map.rooms.map((r, i) => {
                const newSpot = ((map.sectionCols * Math.floor(i / map.sectionCols)) + map.sectionCols - 1) - (i % map.sectionCols);

                return map.rooms[newSpot];
            });
        }

        if(map.isVflipped && !map.isHflipped) {
            const tmp = map.rooms
            .map((r, i) => {
                const newSpot = (Math.abs(map.sectionRows * map.sectionCols - i - 1));
                    //  30 --> 0.  0 --> 30.  35 --> 5.  26 --> 8.
                                return map.rooms[newSpot];
            });

            return tmp.map((r, i, a) => {
                const newSpot = ((map.sectionCols * Math.floor(i / map.sectionCols)) + map.sectionCols - 1) - (i % map.sectionCols);
                                return a[newSpot];
            });
        }

        if(map.isVflipped && map.isHflipped) {
            return map.rooms
            .map((r, i) => {
                const newSpot = (Math.abs(map.sectionRows * map.sectionCols - i - 1));
                    //  30 --> 0.  0 --> 30.  35 --> 5.  26 --> 8.
                                return map.rooms[newSpot];
            });
        }

        return map.rooms;
    },
    rooms: [
    { outofbounds: true },
    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: true },

    { outofbounds: true },
    { outofbounds: true },
    { outofbounds: false },
    { outofbounds: false },

    { outofbounds: true },
    { outofbounds: true },
    { outofbounds: false },
    { outofbounds: false },

    { outofbounds: true },
    { outofbounds: true },
    { outofbounds: false },
    { outofbounds: false },

    { outofbounds: true },
    { outofbounds: true },
    { outofbounds: false },
    { outofbounds: false },
    
    { outofbounds: true },
    { outofbounds: true },
    { outofbounds: false },
    { outofbounds: false },

    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: false },

    { outofbounds: true },
    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: true }
    ]};

export default { data: map };