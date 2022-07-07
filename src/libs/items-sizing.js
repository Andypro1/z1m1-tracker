//  Calculates the maximal grid distribution of squares given a container size
//  From https://math.stackexchange.com/questions/466198/algorithm-to-get-the-maximum-size-of-n-squares-that-fit-into-a-rectangle-with-a
var itemsSizing = (containerWidth, containerHeight, numberOfItems) => {
    var x = containerWidth;
    var y = containerHeight;
    var n = numberOfItems;

    // Compute number of rows and columns, and cell size
    var ratio = x / y;
    var ncols_float = Math.sqrt(n * ratio);
    var nrows_float = n / ncols_float;

    // Find best option filling the whole height
    var nrows1 = Math.ceil(nrows_float);
    var ncols1 = Math.ceil(n / nrows1);
    while(nrows1 * ratio < ncols1) {
        nrows1++;
        ncols1 = Math.ceil(n / nrows1);
    }
    var cell_size1 = y / nrows1;

    // Find best option filling the whole width
    var ncols2 = Math.ceil(ncols_float);
    var nrows2 = Math.ceil(n / ncols2);
    while(ncols2 < nrows2 * ratio) {
        ncols2++;
        nrows2 = Math.ceil(n / ncols2);
    }
    var cell_size2 = x / ncols2;

    // Find the best values
    var nrows, ncols, cell_size;
    if(cell_size1 < cell_size2) {
        nrows = nrows2;
        ncols = ncols2;
        cell_size = cell_size2;
    } else {
        nrows = nrows1;
        ncols = ncols1;
        cell_size = cell_size1;
    }

    return { rows: nrows, cols: ncols, cellSize: cell_size };
};

export default itemsSizing;