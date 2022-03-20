import Cell from './cell.js'
import Kruskals from './maze.js';
import Player from './player.js';
import Node from './node.js';

var canvas = document.getElementById("maze");
var ctx = canvas.getContext('2d');

const gameWidth = 300;
const gameHeight = 300;
const cellSize = 15;
const numCellsX = gameWidth / cellSize;
const numCellsY = gameHeight / cellSize;

const startRow = 0;
const startCol = 0;
const endRow = numCellsY - 1;
const endCol = numCellsX - 1;

canvas.width = gameWidth;
canvas.height = gameHeight;

//create list of cells and possible walls *PUT THIS IN MAZE CLASS*
let groupNum = 0;
let cells = [];
let posWalls = [];
for (let row = 0; row < numCellsY; row++) {
    let temp = [];
    for (let col = 0; col < numCellsX; col++) {
        let c = new Cell(row, col, cellSize, groupNum);
        temp.push(c);

        groupNum++;
    }
    cells.push(temp);
}

for (let row = 0; row < numCellsY; row++) {
    for (let col = 0; col < numCellsX - 1; col++) {
        posWalls.push([row, col, 1]); //1 vertical
    }
}

for (let row = 0; row < numCellsY - 1; row++) {
    for (let col = 0; col < numCellsX; col++) {
        posWalls.push([row, col, 0]); //0 horizontal
    }
}

let kMaze = new Kruskals(numCellsX, numCellsY, cells, posWalls, cellSize);

let player = new Player(0, 0, numCellsX, numCellsY, cellSize, cells)

let open = []
let closed = []

let foundSolution = false;

function isAvailable(cRow, cCol, nRow, nCol) {
    if (!(nRow >= 0 && nRow < numCellsY && nCol >= 0 && nCol < numCellsX)) {
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

function aStar() {
    open.push(new Node(startRow, startCol, startRow, startCol, endRow, endCol, null, cellSize));

    let counter = 0;
    while (counter <= (numCellsX + 3) * (numCellsY + 3)) {
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
            foundSolution = true;
            return;
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
                    open.push(new Node(newRow, newCol, startRow, startCol, endRow, endCol, current, cellSize));
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

aStar();

let lastTime = 0;
function gameLoop(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime - timestamp;
    
    ctx.clearRect(0, 0, gameWidth, gameHeight);
    
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, gameWidth, gameHeight);
    
    if (foundSolution && player.row == endRow && player.col == endCol) {
        let last = closed[closed.length - 1];
        while (last.prev != null) {
            last.draw(ctx);
            last = last.prev;
        }

        ctx.fillStyle = 'blue';
        ctx.fillRect(0, 0, cellSize, cellSize)
    }

    player.draw(ctx);
    kMaze.draw(ctx);
    requestAnimationFrame(gameLoop)
}

gameLoop(0)