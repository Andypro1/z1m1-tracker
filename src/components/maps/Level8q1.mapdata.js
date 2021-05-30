const map = {
    class: 'level8 dungeon',
    shadowColor: 'rgb(188, 188, 188)',
    pixelWidth: 2048,
    pixelHeight: 1408,
    rows: 16,
    cols: 16,
    sectionRows: 8,
    sectionCols: 5,
    sectionStartCell: 131,
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
                console.log(newSpot);
                return map.rooms[newSpot];
            });

            return tmp.map((r, i, a) => {
                const newSpot = ((map.sectionCols * Math.floor(i / map.sectionCols)) + map.sectionCols - 1) - (i % map.sectionCols);
                console.log(newSpot);
                return a[newSpot];
            });
        }

        if(map.isVflipped && map.isHflipped) {
            return map.rooms
            .map((r, i) => {
                const newSpot = (Math.abs(map.sectionRows * map.sectionCols - i - 1));
                    //  30 --> 0.  0 --> 30.  35 --> 5.  26 --> 8.
                console.log(newSpot);
                return map.rooms[newSpot];
            });
        }

        return map.rooms;
    },
    rooms: [
    { outofbounds: true },
    { outofbounds: true },
    { outofbounds: true },
    { outofbounds: false },
    { outofbounds: true },

    { outofbounds: true },
    { outofbounds: true },
    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: false },

    { outofbounds: true },
    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: true },

    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: false },

    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: true },
    
    { outofbounds: true },
    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: false },

    { outofbounds: true },
    { outofbounds: true },
    { outofbounds: true },
    { outofbounds: false },
    { outofbounds: true },

    { outofbounds: true },
    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: false }
]};

export default map;