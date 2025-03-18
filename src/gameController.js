import Player from "./classPlayers";
import screencontroller from "./screencontroller";

export default class GameController {
    #player1;
    #player2;
    #activePlayer;

    constructor() {
        this.#player1 = null;
        this.#player2 = null;
        this.#activePlayer = null;
    }

    initializePlayers(name1, name2=undefined) {
        this.#player1 = new Player("human", name1);
        this.#player2 = name2 ? new Player("human", name2) : new Player("computer");
        this.#activePlayer = this.#player1;
    }

    switchActivePlayer() {
        this.#activePlayer = (this.#activePlayer === this.#player1) ? this.#player2 : this.#player1;
    }

    getActivePlayer() {
        return this.#activePlayer;
    }

    getPlayers() {
        return [this.#player1, this.#player2];
    }

    assignRandomShips() {
        // x, y, direction, length
        let Ship1 = [1, 3, "vertical", 1];
        let Ship2 = [2, 7, "horizontal", 2];
        let Ship3 = [7, 6, "vertical", 3];
        let Ship4 = [2, 4, "horizontal", 4];
        let Ship5 = [8, 0, "vertical", 5];

        this.#player1.gameboard.placeShip(...Ship1);
        this.#player2.gameboard.placeShip(...Ship1);

        this.#player1.gameboard.placeShip(...Ship2);
        this.#player2.gameboard.placeShip(...Ship2);

        this.#player1.gameboard.placeShip(...Ship3);
        this.#player2.gameboard.placeShip(...Ship3);

        this.#player1.gameboard.placeShip(...Ship4);
        this.#player2.gameboard.placeShip(...Ship4);

        this.#player1.gameboard.placeShip(...Ship5);
        this.#player2.gameboard.placeShip(...Ship5);
    }

    startGame() {
        this.initializePlayers("Test");
        this.assignRandomShips();
        screencontroller.startGame(this);
    }
}

// start game
    // initialize Players
    // call Screencontroller to loadBoard

// assign random ships

// - while(gameOver === false)
    // Player Turn
        // set board to inactive
    // Call screencontroller to updateBoard
    // Change Turn / active Player
    // Gameover condition (all shipsSunk)


// restart


