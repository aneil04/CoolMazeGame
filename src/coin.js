export default class Coin {
    constructor(numCellsX, numCellsY, cellSize, minDist, prev) {
        this.prev = prev;
        this.cellSize = cellSize;
        this.minDist = minDist;

        this.row = 0;
        this.col = 0;

        let count = 0; 
        while (count < 50) {
            let posRow = Math.floor(Math.random() * numCellsY);
            let posCol = Math.floor(Math.random() * numCellsX);

            if (Math.sqrt(Math.pow(posRow - prev.row, 2) + Math.pow(posCol - prev.col, 2)) || (posRow == numCellsY - 1 && posCol == numCellsX - 1)) {
                this.row = posRow;
                this.col = posCol;
                break;
            }
            count++;
        }
    }

    draw(ctx) {
        ctx.fillStyle = 'gold';
        ctx.fillRect(this.col * this.cellSize, this.row * this.cellSize, this.cellSize, this.cellSize)
    }
}