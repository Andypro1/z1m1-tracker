const map = {
    class: 'level3 dungeon',
    shadowColor: 'rgb(0, 144, 56)',
    pixelWidth: 2048,
    pixelHeight: 1408,
    rows: 16,
    cols: 16,
    sectionRows: 6,
    sectionCols: 5,
    sectionStartCell: 41,
    isHflipped: false,
    isVflipped: false,
    rooms: [
    { outofbounds: true },
    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: true },
    { outofbounds: true },

    { outofbounds: true },
    { outofbounds: true },
    { outofbounds: false },
    { outofbounds: true },
    { outofbounds: false, premark: 'Q' },

    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: false, premark: 'U' },

    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: false },

    { outofbounds: false, premark: 'E' },
    { outofbounds: true },
    { outofbounds: false },
    { outofbounds: true },
    { outofbounds: true },
    
    { outofbounds: true },
    { outofbounds: true },
    { outofbounds: false },
    { outofbounds: false },
    { outofbounds: true }
]};

export default { data: map };