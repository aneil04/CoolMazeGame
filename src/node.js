export default class Node {
    constructor(row, col, startRow, startCol, endRow, endCol, prev, cellSize, color) {
        this.row = row;
        this.col = col;

        this.startRow = startRow;
        this.startCol = startCol;
        this.endRow = endRow;
        this.endCol = endCol;
        this.cellSize = cellSize;

        this.color = color;

        this.prev = prev;
        this.fCost = -1;
        this.gCost = -1;
        this.hCost = -1;
        this.update();
    }

    compareTo(row, col) {
        return this.row == row && this.col == col;
    }

    update() {
        this.gCost = this.calcGCost();
        this.hCost = this.calcHCost();
        this.fCost = this.gCost + this.hCost;
    }

    calcGCost() {
        return Math.abs(this.row - this.startRow) + Math.abs(this.col - this.startCol);
    }
    
    calcHCost() {
        return Math.abs(this.row - this.endRow) + Math.abs(this.col - this.endCol);
    }

    draw(ctx) {
        ctx.fillStyle = '#67AEF5';
        // ctx.fillStyle = this.color;
        ctx.fillRect(this.col * this.cellSize, this.row * this.cellSize, this.cellSize, this.cellSize)
        ctx.fillRect(this.startCol * this.cellSize, this.startRow * this.cellSize, this.cellSize, this.cellSize)
    }
}