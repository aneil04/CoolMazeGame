import Node from './node.js';

let GAME = null;

function isAvailable(cRow, cCol, nRow, nCol) {
    if (!(nRow >= 0 && nRow < GAME.numCellsY && nCol >= 0 && nCol < GAME.numCellsX)) {
        return false;
    }

    if (nRow < cRow && !cells[cRow][cCol].walls[0]) { //top
        return true;
    } else if (nRow > cRow && !cells[cRow][cCol].walls[1]) { //bottom
        return true;
    } else if (nCol < cCol && !cells[cRow][cCol].walls[2]) { //left
        return true;
    } else if (nCol > cCol && !cells[cRow][cCol].walls[3]) { //right
        return true;
    }

    return false;
}

//checks if the node doesn't already exist in the closed or open arrays 
function checkVals(closed, open, nRow, nCol) {
    for (let x = 0; x < closed.length; x++) {
        if (closed[x].compareTo(nRow, nCol)) {
            return true;
        }
    }

    for (let x = 0; x < open.length; x++) {
        if (open[x].compareTo(nRow, nCol)) {
            return true;
        }
    }

    return false;
}

export default function aStar(startRow, startCol, endRow, endCol, color, game) {
    GAME = game;
    let open = [];
    let closed = [];

    open.push(new Node(startRow, startCol, startRow, startCol, endRow, endCol, null, GAME.cellSize, color));

    let counter = 0;
    while (counter <= (GAME.numCellsX + 3) * (GAME.numCellsY + 3)) {
        //find cell with lowest f-cost
        let currentIndex = 0;
        for (let x = 1; x < open.length; x++) {
            if (open[x].fCost < open[currentIndex].fCost) {
                currentIndex = x;
            } else if (open[x].fCost == open[currentIndex].fCost) {
                if (open[x].hCost < open[currentIndex].hCost) {
                    currentIndex = x;
                }
            }
        }
        let current = open[currentIndex]

        //path has been found 
        if (current.row == endRow && current.col == endCol) {
            return closed;
        }

        //add neighbor to open space if it is not closed
        for (let row = -1; row <= 1; row++) {
            for (let col = -1; col <= 1; col++) {
                if ((Math.abs(row) == 1 && Math.abs(col) == 1) || (row == 0 && col == 0)) {
                    continue;
                }

                let newRow = current.row + row;
                let newCol = current.col + col;
                if (isAvailable(current.row, current.col, newRow, newCol) && !checkVals(closed, open, newRow, newCol)) {
                    open.push(new Node(newRow, newCol, startRow, startCol, endRow, endCol, current, GAME.cellSize, color));
                }
            }
        }

        //update all nodes
        open.forEach(node => {
            node.update();
        })

        closed.forEach(node => {
            node.update();
        })

        //remove current from open and add it to close
        open.splice(currentIndex, 1);
        closed.push(current);

        counter++;
        if (counter == (numCellsX + 3) * (numCellsY + 3)) {
            alert('reached loop limit')
        }
    }
}