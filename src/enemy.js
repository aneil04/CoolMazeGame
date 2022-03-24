export default class Enemy {
    constructor(startRow, startCol, cellSize) {
        this.row = startRow;
        this.col = startCol;

        this.cellSize = cellSize;
    }

    draw(ctx) {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.col * this.cellSize, this.row * this.cellSize, this.cellSize, this.cellSize);
    }
}