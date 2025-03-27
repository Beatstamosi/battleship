import Player from "./classPlayers";
import screencontroller from "./screencontroller";
import { human } from "./enemyCharacters";

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
    }

    initializePlayers(name1, character1=human, name2=undefined, character2=undefined) {
        this.#player1 = new Player("human", 1, name1, character1);
        this.#player2 = name2 ? new Player("human", 2, name2, character2) : new Player("computer", 2);
        this.#activePlayer = this.#player1;
    }

    updateCharacterPlayer2(character) {
        this.#player2.updatePlayer(character);
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

    assignRandomShips(player) {
        for (let length = 1; length <= 5; length++) {
            let shipPlaced = false;
            let retries = 0;
            const maxRetries = 50;
            let imageURL = player.character.ships[length];

            while (!shipPlaced && retries < maxRetries) {
                let x = Math.floor(Math.random() * 10);
                let y = Math.floor(Math.random() * 10);
                let direction = Math.random() < 0.5 ? "vertical" : "horizontal";

                try {
                    player.gameboard.placeShip(x, y, direction, length, imageURL);  
                    shipPlaced = true;
                } catch (error) {
                    retries++;
                    console.log(`Failed to place ship of length ${length} at (${x}, ${y}) with direction ${direction}: ${error.message}`);
                }
            }

            // If maxRetries exceeded
            if (!shipPlaced) {
                console.log(`Failed to place ship of length ${length} after ${maxRetries} retries.`);
                // TODO: Reset Grid and try again?
            }
        }

        // let Ship1 = [1, 3, "vertical", 1];
        // let Ship2 = [2, 7, "horizontal", 2];
        // let Ship3 = [7, 6, "vertical", 3];
        // let Ship4 = [2, 4, "horizontal", 4];
        // let Ship5 = [8, 0, "vertical", 5];

        // this.#player1.gameboard.placeShip(...Ship1);
        // this.#player2.gameboard.placeShip(...Ship1);

        // this.#player1.gameboard.placeShip(...Ship2);
        // this.#player2.gameboard.placeShip(...Ship2);

        // this.#player1.gameboard.placeShip(...Ship3);
        // this.#player2.gameboard.placeShip(...Ship3);

        // this.#player1.gameboard.placeShip(...Ship4);
        // this.#player2.gameboard.placeShip(...Ship4);

        // this.#player1.gameboard.placeShip(...Ship5);
        // this.#player2.gameboard.placeShip(...Ship5);
    }

    startGame() {
        this.assignRandomShips(this.#player1);
        this.assignRandomShips(this.#player2);
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
            this.#player2.character.attack(this.#availableTargets);
        }

        // else
            // screencontroller hide ships of non-active player ?
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


