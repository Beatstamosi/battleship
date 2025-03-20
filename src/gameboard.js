import Ship from "./classShip";

export default class Gameboard {
    constructor() {
        this.board = this.createBoardArray();
        this.ships = [];
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

    placeShip(x, y, direction, length) {
        this.checkIfCoordsInBounds(x, y);
        this.checkIfLengthInBounds(x, y, direction, length);
        this.checkShipAlreadyPlaced(x, y, direction, length);

        let newShip = new Ship(length);
        this.ships.push(newShip);

        for (let i = 0; i < length; i++) {
            let currentField = this.getField(x, y, direction, i);
            currentField.ship = newShip;
        }
    }

    getField(x, y, direction, i) {
        return direction === "horizontal" ? this.board[x + i][y] : this.board[x][y + i];
    }

    receiveAttack(x, y) {
        return new Promise((resolve, reject) => {
            try {
                this.checkIfCoordsInBounds(x, y);
    
                let field = this.board[x][y];
    
                if (field.ship != null) {
                    field.ship.hit();
                    field.hit = true;
                    resolve("Ship hit");
                } else {
                    field.missed = true;
                    resolve("Ship missed");
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    checkIfCoordsInBounds(x, y) {
        if (x < 0 || x > 9 || y < 0 || y > 9) throw Error("Coordinates must be from 0 - 9");
    }

    checkIfLengthInBounds(x, y, direction, length) {
        if (direction === "horizontal") {
            if ((x + (length - 1)) > 9) throw Error("Coordinates must stay in range of gameboard ((starting coordinates + length) < 9)");
        } else {
            if ((y + (length - 1)) > 9) throw Error("Coordinates must stay in range of gameboard ((starting coordinates + length) < 9)");
        }
    }

    checkShipAlreadyPlaced(x, y, direction, length) {
        for (let i = 0; i < length; i++) {
            let currentField = this.getField(x, y, direction, i);
            if (currentField.ship != null) throw Error("A ship has already been placed in this spot");
        }
    }

    allShipsSunk() {
        const allSunk = (ship) => ship.sunk === true;
        return this.ships.every(allSunk);
    }
}

class Field {
    constructor() {
        this.missed = false;
        this.hit = false;
        this.ship = null;
    }
}









