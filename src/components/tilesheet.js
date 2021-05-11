
const tilesheet = function(uri, w, h, rows, cols, srows, scols, sscell) {
    var _imageUri;
    var _pxWidth, _pxHeight;
    var _tileRows, _tileCols;
    var _sectionRows, _sectionCols;
    var _sectionStartCell;

    const bguri = () => _imageUri;
    const pxWidth = () => _pxWidth;
    const pxHeight = () => _pxHeight;
    const tileRows = () => _tileRows;
    const tileCols = () => _tileCols;
    const sectionRows = () => _sectionRows;
    const sectionCols = () => _sectionCols;
    const sectionStartCell = () => _sectionStartCell;

    //  populate properties
    _imageUri = uri;
    _pxWidth = w;
    _pxHeight = h;
    _tileRows = rows;
    _tileCols = cols;
    _sectionRows = srows;
    _sectionCols = scols;
    _sectionStartCell = sscell;

    return Object.freeze({
        bguri: bguri,
        pxWidth: pxWidth,
        pxHeight: pxHeight,
        tileRows: tileRows,
        tileCols: tileCols,
        sectionRows: sectionRows,
        sectionCols: sectionCols,
        sectionStartCell: sectionStartCell
    });
};

export default tilesheet;