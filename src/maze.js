export default class Kruskals {
    constructor(numCellsX, numCellsY, cells, posWalls, cellSize) {
        this.numCellsX = numCellsX;
        this.numCellsY = numCellsY;
        this.cellSize = cellSize;
        this.cells = cells;
        this.posWalls = posWalls;

        while (this.posWalls.length > 0) {
            //choose random edge
            let wallIndex = Math.floor(Math.random() * this.posWalls.length);
            let edge = this.posWalls[wallIndex];

            if (edge[2] == 0) { //horizontal wall
                //get edge groups
                const groupToMerge = this.cells[edge[0]][edge[1]].group;
                const groupToMergeTo = this.cells[edge[0] + 1][edge[1]].group;

                if (groupToMerge != groupToMergeTo) { //check if cells are of same group
                    //merge cell groups if they are
                    this.cells[edge[0]][edge[1]].group = this.cells[edge[0] + 1][edge[1]].group;
                    //change all groups *find more efficient way* and delete reused code
                    for (let row = 0; row < numCellsY; row++) {
                        for (let col = 0; col < numCellsX; col++) {
                            if (this.cells[row][col].group == groupToMerge && this.cells[row][col].group != groupToMergeTo) {
                                this.cells[row][col].group = groupToMergeTo;
                            }
                        }
                    }

                    //remove bottom wall of top cell
                    this.cells[edge[0]][edge[1]].walls[1] = false;
                    //remove top wall of bottom cell
                    this.cells[edge[0] + 1][edge[1]].walls[0] = false;
                }
            } else { //same code as above, but for vertical wall
                const groupToMerge = this.cells[edge[0]][edge[1]].group;
                const groupToMergeTo = this.cells[edge[0]][edge[1] + 1].group;

                if (groupToMerge != groupToMergeTo) {
                    this.cells[edge[0]][edge[1]].group = this.cells[edge[0]][edge[1] + 1].group;
                    for (let row = 0; row < numCellsY; row++) {
                        for (let col = 0; col < numCellsX; col++) {
                            if (this.cells[row][col].group == groupToMerge && this.cells[row][col].group != groupToMergeTo) {
                                this.cells[row][col].group = groupToMergeTo;
                            }
                        }
                    }

                    //remove right wall of left cell
                    this.cells[edge[0]][edge[1]].walls[3] = false;
                    //remove left wall of right cell
                    this.cells[edge[0]][edge[1] + 1].walls[2] = false;
                }
            }
            this.posWalls.splice(wallIndex, 1);
        }
    }

    draw(ctx) {
        // ctx.fillStyle = "#F2AF5C";
        ctx.fillStyle = 'aqua'
        ctx.fillRect((this.numCellsX - 1) * this.cellSize, (this.numCellsY - 1) * this.cellSize, this.cellSize, this.cellSize)

        this.cells.forEach(row => {
            row.forEach(cell => {
                cell.draw(ctx);
            })
        });

    }
}