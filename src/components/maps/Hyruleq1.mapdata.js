const map = {
    class: 'overworld',
    shadowColor: 'rgb(97, 97, 35)',
    pixelWidth: 2048,
    pixelHeight: 704,
    rows: 8,
    cols: 16,
    sectionRows: 8,
    sectionCols: 16,
    sectionStartCell: 0,
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
    { active: false },
    { active: true },
    { active: false },
    { active: true },
    { active: true },
    { active: true },
    { active: false },
    { active: true },
    { active: false },
    { active: false },
    { active: true },
    { active: true },
    { active: true },
    { active: true },
    { active: true },
    { active: true },

    { active: true },
    { active: false },
    { active: true },
    { active: true },
    { active: true },
    { active: false },
    { active: true },
    { active: false },
    { active: false },
    { active: false },
    { active: true },
    { active: false },
    { active: true },
    { active: true },
    { active: true },
    { active: true },

    { active: false },
    { active: true },
    { active: true },
    { active: true },
    { active: true },
    { active: true },
    { active: true },
    { active: true },
    { active: true },
    { active: false },
    { active: false },
    { active: false },
    { active: true },
    { active: true },
    { active: false },
    { active: true },

    { active: false },
    { active: false },
    { active: false },
    { active: true },
    { active: true },
    { active: false },
    { active: false },
    { active: true },
    { active: false },
    { active: false },
    { active: false },
    { active: false },
    { active: true },
    { active: true },
    { active: false },
    { active: false },

    { active: false },
    { active: false },
    { active: true },
    { active: false },
    { active: true },
    { active: true },
    { active: true },
    { active: true },
    { active: true },
    { active: true },
    { active: true },
    { active: true },
    { active: false },
    { active: true },
    { active: true },
    { active: false },

    { active: false },
    { active: true },
    { active: false },
    { active: false },
    { active: false },
    { active: false },
    { active: true },
    { active: false },
    { active: false },
    { active: false },
    { active: false },
    { active: true },
    { active: false },
    { active: false },
    { active: true },
    { active: false },

    { active: false },
    { active: false },
    { active: true },
    { active: true },
    { active: true },
    { active: false },
    { active: true },
    { active: true },
    { active: true },
    { active: false },
    { active: true },
    { active: true },
    { active: false },
    { active: true },
    { active: false },
    { active: true },

    { active: true },
    { active: true },
    { active: false },
    { active: false },
    { active: true },
    { active: true },
    { active: true },
    { active: true },
    { active: true },
    { active: true },
    { active: false },
    { active: true },
    { active: true },
    { active: true },
    { active: false },
    { active: false }
]};

export default map;