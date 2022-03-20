import Cell from "./cell";

class Node {
    constructor(x, y, gCost, hCost, fCost, prev, startX, startY, endX, endY) {
        this.x = x;
        this.y = y;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;

        this.gCost = gCost;
        this.hCost = hCost;
        this.fCost = fCost;
        this.prev = prev;
    }

    compareTo(x, y) {
        return this.x == x && this.y == y;
    }

    update() {
        this.gCost = gCost(this.x, this.y);
        this.hCost = hCost(this.x, this.y);
        this.fCost = this.gCost + this.hCost;
    }
}

function hCost(x, y) {
    return Math.abs(x - this.endX) + Math.abs(y - this.endY);
}

function gCost(x, y) {
    return Math.abs(x - this.startX) + Math.abs(y - this.startY);
}

export default function aStar() {
    open = [];
    
    open.add(new Cell())
}