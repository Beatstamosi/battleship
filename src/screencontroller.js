import { setDialogInteraction, setStartGameBtn } from "./buttonlisteners";
import GameController from "./gameController";

const screencontroller = {
    addEventListeners() {
        setDialogInteraction();
        setStartGameBtn();
    },

    startGame(game) {
        let startView = document.querySelector("#start-view");
        let gameView = document.querySelector("#game-view");

        startView.style.display = "none",
        gameView.style.display = "flex";

        this._loadBoardOnStart(game);
    },

    _loadBoardOnStart: function(game) {
        let [player1, player2] = game.getPlayers();
        let boardPlayer1 = document.querySelector("#board-player-1");
        let boardPlayer2 = document.querySelector("#board-player-2");

        this._renderBoard(player1, boardPlayer1);
        this._renderBoard(player2, boardPlayer2);

        // TODO: later this needs to be called after ships have been assigned via gameController
            // screencontroller.addEventListenerToBoard
            // takes game as input, gets players, gets boards from DOM
        this._addEventListenerBoard(player1, boardPlayer1, game);
        this._addEventListenerBoard(player2, boardPlayer2, game);
    },

    _renderBoard: function(player, boardPlayer) {
        let board = player.gameboard.board;
        let length = board.length;

        for (let i = 0; i < length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                let button = document.createElement("button");
                button.dataset.row = i;
                button.dataset.column = j;
                button.classList.add("field-board");
                boardPlayer.append(button);
            }
        }
    },

    _addEventListenerBoard: function(player, boardPlayer, game) {
        let DOMfields = Array.from(boardPlayer.querySelectorAll(".field-board"));

        // use a named function so it can be removed after first click
        const attack = (event) => {
                let DOMfield = event.target;
                let x = DOMfield.dataset.row;
                let y = DOMfield.dataset.column;

                player.gameboard.receiveAttack(x, y)
                .then((result) => this._updateFieldStatus(result, DOMfield))
                .then(() => this._deactivateEventlistenerBoard(DOMfield, attack))
                .then(() => this._onAttackCompleted(game));
        }

        DOMfields.forEach((DOMfield) => {
            DOMfield.addEventListener("click", attack);
        })
    },

    _updateFieldStatus: function(result, DOMfield) {
        DOMfield.classList.add(result);

        // TODO: update later with ship.sunk ?
            // update all fields of ship
    },

    _deactivateEventlistenerBoard: function(DOMfield, attack) {
        DOMfield.removeEventListener("click", attack);
    },

    _onAttackCompleted: function(game) {
        game.switchActivePlayer();
        game.playRound();
    },

    displayTurnInfo(activePlayer) {
        let instructions = document.querySelector("#instructions");
        instructions.textContent = `${activePlayer.name}'s Turn`;
    },

    disableBoard(player) {
        let board = this.getDOMBoard(player);
        board.classList.add("disabled");
    },

    enableBoard(player) {
        let board = this.getDOMBoard(player);
        board.classList.remove("disabled");
    },

    getDOMBoard(player) {
        return document.querySelector(`#board-${player.order}`);
    },

    displayWinner(player) {
        let instructions = document.querySelector("#instructions");
        instructions.textContent = `${player.name} wins!`; // TODO: Update with more Text
    }
}

export default screencontroller;


// - Display how many ships left
// - Display game over
//     - Offer restart