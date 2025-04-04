import Player from "./classPlayers";
import screencontroller from "./screencontroller";
import { turnOnGame } from "./buttonlisteners";
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

  initializePlayers(
    name1,
    character1 = human,
    name2 = undefined,
    character2 = undefined,
  ) {
    this.#player1 = new Player("human", 1, name1, character1);
    this.#player2 = name2
      ? new Player("human", 2, name2, character2)
      : new Player("computer", 2);
    this.#activePlayer = this.#player1;
  }

  resetGame() {
    // get player values
    let [player1, player2] = this.getPlayers();
    let player1Name = player1.name;
    let player1Char = player1.character;

    if (player2.type === "computer") {
      let player2Char = player2.character;
      this.initializePlayers(player1Name, player1Char);
      this.updateCharacterPlayer2(player2Char);
    } else {
      let player2Name = player2.name;
      let player2Char = player2.character;
      this.initializePlayers(
        player1Name,
        player1Char,
        player2Name,
        player2Char,
      );
    }

    // turnOnGame from screenController
    turnOnGame();
  }

  updateCharacterPlayer2(character) {
    this.#player2.updatePlayer(character);
  }

  switchActivePlayer() {
    this.#activePlayer =
      this.#activePlayer === this.#player1 ? this.#player2 : this.#player1;
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
        }
      }

      // If maxRetries exceeded
      if (!shipPlaced) {
        console.log(
          `Failed to place ship of length ${length} after ${maxRetries} retries.`,
        );
      }
    }
  }

  async startGame() {
    await screencontroller.handleBoardSetUp(this.#player1);

    // wait until ships have been assigned
    await screencontroller.handleBoardSetUp(this.#player2);

    if (this.#player2.type == "computer") {
      this.assignRandomShips(this.#player2);
      this.#initializeAvailableTargets();
    }

    // after ships of player2 have been assigned
    screencontroller.activateAttackFunctionsBoards(this);

    // set activePlayer
    this.#activePlayer = this.#player1;

    this.playRound();
  }

  #initializeAvailableTargets() {
    this.#availableTargets = Array.from(
      document.querySelectorAll("#board-player-1 .field-board"),
    );
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
  }

  isGameOver() {
    if (this.#player1.gameboard.allShipsSunk()) {
      this.#winner = this.#player2;
    } else if (this.#player2.gameboard.allShipsSunk()) {
      this.#winner = this.#player1;
    }
  }

  endGame() {
    // disable both boards
    screencontroller.disableBoard(this.#player1);
    screencontroller.disableBoard(this.#player2);

    // update instructions with winner
    screencontroller.displayWinner(this.#winner);

    // TODO: show restart button
  }
}
