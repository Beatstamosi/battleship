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
}

class Field {
    constructor() {
        this.missed = false;
        this.hit = false;
        this.ship = null;
    }
}


// create board array
    // for loop 10 times i
        // for loop for each i add 10 times j
            // add object to each field
                // missed: false
                // hit: false
                // ship: null


// function placeShip
    // param: starting coordinate, vert or horizontal, length
    // create new Ship with length
    // from starting coord go up or down for length
        // link new Ship to field object - ship


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






