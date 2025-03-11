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

        let newShip = new Ship(length);

        if (direction === "horizontal") {
            for (let i = 0; i < length; i++) {
                this.board[startCord[0] + i][startCord[1]].ship = newShip;
            }
        } else {
            for (let i = 0; i < length; i++) {
                this.board[startCord[0]][startCord[1] + i].ship = newShip;
            }
        }
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









