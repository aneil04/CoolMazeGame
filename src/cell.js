export default class Cell {
    constructor(row, col, cellSize, group) {
        this.row = row;
        this.col = col;

        this.walls = [true, true, true, true]; //top, bottom, left, right

        this.cellSize = cellSize;

        this.group = group;
    }

    draw(ctx) {
        ctx.strokeStyle = 'white';
        ctx.beginPath();

        let rowScale = this.row * this.cellSize;
        let colScale = this.col * this.cellSize
        if (this.walls[0]) { //top
            ctx.moveTo(colScale, rowScale);
            ctx.lineTo(colScale + this.cellSize, rowScale);
        }

        if (this.walls[1]) { //bottom
            ctx.moveTo(colScale, rowScale + this.cellSize);
            ctx.lineTo(colScale + this.cellSize, rowScale + this.cellSize);
        }

        if (this.walls[2]) { //left
            ctx.moveTo(colScale, rowScale);
            ctx.lineTo(colScale, rowScale + this.cellSize);
        }

        if (this.walls[3]) { //right
            ctx.moveTo(colScale + this.cellSize, rowScale);
            ctx.lineTo(colScale + this.cellSize, rowScale + this.cellSize);
        }

        ctx.stroke();
    }
}