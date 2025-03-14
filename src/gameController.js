import Player from "./classPlayers";

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
}

// start game
    // initialize Players
    // call Screencontroller to loadBoard

// assign random ships

// set active player

// - while(gameOver === false)
    // Player Turn
        // set board to inactive
    // Call screencontroller to updateBoard
    // Change Turn / active Player
    // Gameover condition (all shipsSunk)


// restart


