import Cell from './cell.js'
import Kruskals from './maze.js';
import Player from './player.js';
import Node from './node.js';
import Coin from './coin.js';
import Enemy from './enemy.js';

var canvas = document.getElementById("maze");

canvas.addEventListener("click", () => {
    if (died || wonGame) {
        reset();
    }
})
var ctx = canvas.getContext('2d');

let coinsElement = document.getElementById('coins-collected');
let timeElement = document.getElementById('timer');

let time = 0;

const gameWidth = 600;
const gameHeight = 600;
const cellSize = 25;
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
let enemyPos = []

for (let row = 0; row < numCellsY; row++) {
    let temp = [];
    for (let col = 0; col < numCellsX; col++) {
        let c = new Cell(row, col, cellSize, groupNum);

        if (row == 0) {
            c.walls[0] = false;
        } else if (row == numCellsY - 1) {
            c.walls[1] = false;
        }

        if (col == 0) {
            c.walls[2] = false;
        } else if (col == numCellsX - 1) {
            c.walls[3] = false;
        }

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
let player = new Player(0, 0, numCellsX, numCellsY, cellSize, cells);


//add update method to enemy that uses aStar class
let enemy1 = new Enemy(numCellsX - 1, numCellsY - 1, cellSize);
let enemy2 = new Enemy(15, 13, cellSize);
let enemies = [enemy1]

let coin1 = new Coin(numCellsX, numCellsY, cellSize, 10, player);
let coin2 = new Coin(numCellsX, numCellsY, cellSize, 10, coin1);
let coin3 = new Coin(numCellsX, numCellsY, cellSize, 10, coin2);
let coins = [{ row: startRow, col: startCol }, coin1, coin2, coin3, { row: endRow, col: endCol }];
let currentCoin = 0;

let solutionCells = [];

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

function aStar(startRow, startCol, endRow, endCol, color) {
    let open = [];
    let closed = [];

    open.push(new Node(startRow, startCol, startRow, startCol, endRow, endCol, null, cellSize, color));

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
                    open.push(new Node(newRow, newCol, startRow, startCol, endRow, endCol, current, cellSize, color));
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

function addCells(closed) {
    let last = closed[closed.length - 1];
    while (last.prev != null) {
        solutionCells.push(last);
        last = last.prev;
    }
}

//put this stuff in a loop instead of hardcoding it 
function findAllSols() {
    for (let x = 0; x < coins.length - 1; x++) {
        let arr = [];
        arr = aStar(coins[x].row, coins[x].col, coins[x + 1].row, coins[x + 1].col, 'blue');
        addCells(arr)
    }
}

findAllSols();

let lastTime = 0;
let lastEnemyMoveTime = 0;
let enemyMoveInterval = 0.5;
let wonGame = false;
let died = false;

function gameLoop(timestamp) {
    if (died) {
        return;
    }

    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    if (!wonGame) {
        time += deltaTime / 1000;
        if (time > 60) {

        }
        timeElement.innerText = Math.floor(time);
    }

    ctx.clearRect(0, 0, gameWidth, gameHeight);
    ctx.fillStyle = '#333333';
    ctx.fillRect(0, 0, gameWidth, gameHeight);

    if (currentCoin < coins.length - 1) {
        if (player.row == coins[currentCoin].row && player.col == coins[currentCoin].col) {
            coinsElement.innerText = (currentCoin) + "/3 coins"
            if (currentCoin == 3) {
                coinsElement.classList.remove('red');
                coinsElement.classList.add('green');
            }
            currentCoin++;
        }
    }

    player.draw(ctx);

    if (currentCoin < coins.length - 1) {
        coins[currentCoin].draw(ctx);
    }

    /* 
    
    3 different enemies:
    
    1 goes directly to the player
    1 goes to the coin but if the player is within a certain range of the coin, it goes to the player
    1 goes to:
        clone of player if it exists
            once wihtin a certain dist of the clone, it goes to the player
        previous position of player
    */

    //run this loop when the player makes a move 
    if (lastEnemyMoveTime <= 0 && !wonGame) {
        for (let x = 0; x < enemies.length; x++) {
            if (lastEnemyMoveTime <= 0) {
                enemyPos = aStar(player.row, player.col, enemies[x].row, enemies[x].col, 'red')
                let move = enemyPos.pop();

                if (move) {
                    enemies[x].row = move.row;
                    enemies[x].col = move.col;
                }
            }
        }

        lastEnemyMoveTime = enemyMoveInterval;
    } else {
        lastEnemyMoveTime -= deltaTime / 1000;
    }

    enemies.forEach(enemy => {
        enemy.draw(ctx)
    })

    kMaze.draw(ctx);

    if (player.row == endRow && player.col == endCol && currentCoin == coins.length - 1) {
        wonGame = true;
        //player won
        solutionCells.forEach(node => {
            node.draw(ctx);
        })

        coins.forEach(coin => {
            try {
                coin.draw(ctx);
            } catch (error) { }
        })

        canvas.classList.remove('maze-outline-white');
        canvas.classList.add('maze-outline-green');
    } else {
        enemies.forEach(enemy => {
            if (enemy.row == player.row && enemy.col == player.col) {
                died = true;
                canvas.classList.remove('maze-outline-white');
                canvas.classList.add('maze-outline-red');
            }
        })
    }

    requestAnimationFrame(gameLoop)
}

//reset all values
//display start screen

function startGame() {
    //when start button pressed, hide start screen and start game
}

function endGame() {
    //when game ends, pause game and show end screen 

}

function pause() {

}

function reset() {
    enemies.forEach(enemy => {
        enemy.resetPos();
    })

    player.row = startRow;
    player.col = startCol;
    player.moves = 0;
    player.movesElement.innerText = "0 moves";
    currentCoin = 0;

    coinsElement.classList.remove('green');
    coinsElement.classList.add('red');
    coinsElement.innerText = "0/3 coins";
    
    wonGame = false;
    time = 0;
    died = false;
    
    canvas.classList.remove('maze-outline-red');
    canvas.classList.remove('maze-outline-green');
    canvas.classList.add('maze-outline-white');

    requestAnimationFrame(gameLoop)
}

gameLoop(0)