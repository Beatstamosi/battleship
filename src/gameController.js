import Player from "./classPlayers";
import screencontroller from "./screencontroller";
import { wraithmoor, grimhollow, boneshard } from "./enemyCharacters";

export default class GameController {
    #player1;
    #player2;
    #activePlayer;
    #availableTargets;
    #winner;

    constructor() {
        this.#player1 = null;
        this.#player2 = null;
        this.#activePlayer = null;
        this.#winner = null;
        this.#availableTargets = null;
        this.boneshard = boneshard;
    }

    initializePlayers(name1, name2=undefined) {
        this.#player1 = new Player("human", 1, name1);
        this.#player2 = name2 ? new Player("human", 2, name2) : new Player("computer", 2);
        this.#activePlayer = this.#player1;
    }

    switchActivePlayer() {
        this.#activePlayer = (this.#activePlayer === this.#player1) ? this.#player2 : this.#player1;
    }

    getActivePlayer() {
        return this.#activePlayer;
    }

    getNonActivePlayer() {
        return this.#player1 == this.#activePlayer ? this.#player2 : this.#player1;
    }

    getPlayers() {
        return [this.#player1, this.#player2];
    }

    assignRandomShips() {
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

        if (this.#player2.type == "computer") this.#initializeAvailableTargets();
        
        this.playRound();
    }

    #initializeAvailableTargets() {
        this.#availableTargets = Array.from(document.querySelectorAll("#board-player-1 .field-board"));
    }

    playRound() {
        this.isGameOver();

        if (this.#winner) {
            this.endGame();
            return;
        }

        let activePlayer = this.getActivePlayer();
        let nonActivePlayer = this.getNonActivePlayer();
        
        screencontroller.displayTurnInfo(activePlayer);
        screencontroller.disableBoard(activePlayer);
        screencontroller.enableBoard(nonActivePlayer);

        if (activePlayer.type == "computer") {
            this.boneshard.attack(this.#availableTargets);
        }

        // else
            // screencontroller hide ships of non-active player ?
    }

    // TODO: Delete from here as it is handled by character objects
    computerPlayEasy() {
        if (this.#availableTargets.length == 0) return;

        // choose random field via index
        let index = Math.floor(Math.random() * this.#availableTargets.length);

        let randomField = this.#availableTargets[index];

        setTimeout(() => {
            randomField.click();
        }, 1200);   

        this.#availableTargets.splice(index, 1);
    }

    isGameOver() {
        if (this.#player1.gameboard.allShipsSunk()) {
            this.#winner = this.#player2;
        } else if (this.#player2.gameboard.allShipsSunk()) {
            this.#winner = this.#player1;
        }
    }

    endGame() {
        // disabled both boards
        screencontroller.disableBoard(this.#player1);
        screencontroller.disableBoard(this.#player2);

        // update instructions with winner
        screencontroller.displayWinner(this.#winner);

        // TODO: show restart button
    }
}



// restart


