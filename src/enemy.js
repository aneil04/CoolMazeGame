export default class Enemy {
    constructor(startRow, startCol, cellSize) {
        this.row = startRow;
        this.col = startCol;

        this.startCol = startCol;
        this.startRow = startRow;

        this.cellSize = cellSize;
    }

    resetPos() {
        this.row = this.startCol;
        this.col = this.startCol
    }

    draw(ctx) {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.col * this.cellSize, this.row * this.cellSize, this.cellSize, this.cellSize);
    }
}