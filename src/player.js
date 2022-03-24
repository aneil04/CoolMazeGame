export default class Player {
    constructor(startX, startY, numCellsX, numCellsY, cellSize, cells) {
        this.row = startX;
        this.col = startY;

        this.cloneRow = this.row;
        this.cloneCol = this.col;
        this.isCloned = false;

        this.numCellsX = numCellsX;
        this.numCellsY = numCellsY;
        this.cellSize = cellSize;
        this.cells = cells;

        this.moves = 0;

        document.getElementById('maze').addEventListener('keydown', (e) => {
            if (e.key == 'w' || e.key == "ArrowUp") { //move up
                if (this.row > 0 && !this.cells[this.row][this.col].walls[0]) {
                    this.row--;
                    this.moves++;
                }
            }
            
            if (e.key == 's' || e.key == "ArrowDown") {
                if (this.row < this.numCellsY - 1 && !this.cells[this.row][this.col].walls[1]) {
                    this.row++;
                    this.moves++;
                }
            }

            if (e.key == 'a' || e.key == "ArrowLeft") {
                if (this.col > 0 && !this.cells[this.row][this.col].walls[2]) {
                    this.col--;
                    this.moves++;
                }
            }
            
            if (e.key == 'd' || e.key == "ArrowRight") {
                if (this.col < this.numCellsX - 1 && !this.cells[this.row][this.col].walls[3]) {
                    this.col++;
                    this.moves++;
                }
            }
            
            if (e.key == " ") {
                if (this.isCloned) {
                    //teleport player back to clone
                    this.row = this.cloneRow;
                    this.col = this.cloneCol;
                    this.isCloned = false;
                } else {
                    //create a clone
                    this.isCloned = true;
                }
            }

            if (!this.isCloned) {
                this.cloneRow = this.row;
                this.cloneCol = this.col;
            }
        })
    }

    draw(ctx) {
        ctx.fillStyle = '#F23E4E';
        ctx.fillRect(this.col * this.cellSize, this.row * this.cellSize, this.cellSize, this.cellSize);

        if (this.isCloned) {
            ctx.fillStyle = 'blue';
            ctx.fillRect(this.cloneCol * this.cellSize, this.cloneRow * this.cellSize, this.cellSize, this.cellSize);
        }
    }
}