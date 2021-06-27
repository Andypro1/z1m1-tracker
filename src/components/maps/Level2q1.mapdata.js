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
    rooms: [
    { outofbounds: true },
    { outofbounds: false, premark: 'Q' },
    { outofbounds: false, premark: 'U' },
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
    { outofbounds: false, premark: 'E' },
    
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