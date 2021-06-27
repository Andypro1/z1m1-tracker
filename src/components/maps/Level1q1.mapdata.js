const map = {
    class: 'level1 dungeon',
    shadowColor: 'rgb(0, 128, 136)',
    pixelWidth: 2048,
    pixelHeight: 1408,
    rows: 16,
    cols: 16,
    sectionRows: 6,
    sectionCols: 6,
    sectionStartCell: 33,
    isHflipped: false,
    isVflipped: false,
    rooms: [
    { outofbounds: true },
    { outofbounds: false, premark: 'E' },
    { outofbounds: false },
    { outofbounds: true },
    { outofbounds: true },
    { outofbounds: true },

    { outofbounds: true },
    { outofbounds: true },
    { outofbounds: false },
    { outofbounds: true },
    { outofbounds: false, premark: 'U' },
    { outofbounds: false, premark: 'Q' },

    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: false, premark: 'E' },
    { outofbounds: false },
    { outofbounds: true },

    { outofbounds: true },
    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: true },
    { outofbounds: true },

    { outofbounds: true },
    { outofbounds: true },
    { outofbounds: false },
    { outofbounds: true },
    { outofbounds: true },
    { outofbounds: true },

    { outofbounds: true },
    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: true },
    { outofbounds: true }
]};

export default { data: map };