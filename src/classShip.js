export default class Ship {
    constructor(length, imageURL) {
        this.length = length;
        this.hits = 0;
        this.sunk = false;
        this.imageURL = imageURL;
    }

    hit() {
        this.hits += 1;
        this.isSunk();
    }

    isSunk() {
        if (this.hits === this.length) {
            this.sunk = true;
        }
    }
}
