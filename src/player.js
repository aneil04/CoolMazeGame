export default class Player {
    constructor(startX, startY, numCellsX, numCellsY, cellSize, cells) {
        this.row = startX;
        this.col = startY;

        this.numCellsX = numCellsX;
        this.numCellsY = numCellsY;
        this.cellSize = cellSize;
        this.cells = cells;

        document.getElementById('maze').addEventListener('keypress', (e) => {
            switch (e.key) {
                case 'w': //move up
                    if (this.row > 0 && !this.cells[this.row][this.col].walls[0]) {
                        this.row--;
                    }
                    break;
                case 's': //move down
                    if (this.row < this.numCellsY - 1 && !this.cells[this.row][this.col].walls[1]) {
                        this.row++;
                    }
                    break;
                case 'a': //move left
                    if (this.col > 0 && !this.cells[this.row][this.col].walls[2]) {
                        this.col--;
                    }
                    break;
                case 'd': //move right 
                    if (this.col < this.numCellsX - 1 && !this.cells[this.row][this.col].walls[3]) {
                        this.col++;
                    }
                    break;
                default:
                    break;
            }
        })


    }
    
    draw(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.col * this.cellSize, this.row * this.cellSize, this.cellSize, this.cellSize);
    }
}