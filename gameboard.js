import Ship from "./classShip";

export default class Gameboard {
    constructor() {
        this.board = this.createBoardArray();
    }

    createBoardArray() {
        const board = [];

        for (let i = 0; i < 10; i++) {
            board[i] = [];

            for (let j = 0; j < 10; j++) {
                board[i][j] = new Field();
            }
        }

        return board;
    }

    placeShip(startCord, direction, length) {
        if (startCord[0] < 0 || startCord[0] > 9 || startCord[1] < 0 || startCord[1] > 9) throw Error("Coordinates must be from 0 - 9");

        if ((startCord[0] + (length - 1)) > 9  || (startCord[1] + (length - 1)) > 9) throw Error("Coordinates must stay in range of gameboard ((starting coordinates + length) < 9)");

        if (!this.checkShipAlreadyPlaced(startCord, direction, length)) throw Error("A ship has already been placed in this spot");

        let newShip = new Ship(length);

        let [x, y] = startCord;

        for (let i = 0; i < length; i++) {
            let currentField = this.getField(x, y, direction, i);
            currentField.ship = newShip;
        }
    }

    checkShipAlreadyPlaced(startCord, direction, length) {
        let [x, y] = startCord;

        for (let i = 0; i < length; i++) {
            let currentField = this.getField(x, y, direction, i);
            if (currentField.ship != null) return false;
        }

        return true;
    }

    getField(x, y, direction, i) {
        return direction === "horizontal" ? this.board[x + i][y] : this.board[x][y + i];
    }

// receive Attack
    // param: coordinates
    // access board array
        // if field has ship
            // call ship.hit()
            // set field.hit = true
        // else
            // set field.missed = false


// all Ships sunk
    // array 
    // placeShip adds new Ship to array
    // return if all ship.sunk === true


}

class Field {
    constructor() {
        this.missed = false;
        this.hit = false;
        this.ship = null;
    }
}









