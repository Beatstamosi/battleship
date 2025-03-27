import { setDialogInteraction, setStartGameBtn, setBtnsEnemyIntro } from "./buttonlisteners";
import game from "./game";

const screencontroller = {
    addEventListeners() {
        setDialogInteraction();
        setStartGameBtn();
        setBtnsEnemyIntro();
    },

    startGame(game) {
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
        this.fogGameboard(boardPlayer1);
        this.fogGameboard(boardPlayer2);
        this._addEventListenerBoard(player1, boardPlayer1, game);
        this._addEventListenerBoard(player2, boardPlayer2, game);
    },

    _renderBoard: function(player, boardPlayer) {
        let board = player.gameboard.board;
        let length = board.length;

        boardPlayer.style.boxShadow = player.character.styling.playerBoardBoxShadow;

        for (let i = 0; i < length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                let button = document.createElement("button");
                button.dataset.row = i;
                button.dataset.column = j;
                button.classList.add("field-board", "show-grid");

                // add styling in character look to each button, because board will have background img
                button.style.backgroundColor = player.character.styling.backGroundColorBoard;
        
                // Link the button with the corresponding field
                button.gameField = board[i][j];

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

        if (result == "hit") {
            DOMfield.style.backgroundImage = `url(${DOMfield.gameField.ship.imageURL})`;
        }

        // TODO: update later with ship.sunk ?
            // update all fields of ship
            // update with different kind of ship
    },

    _deactivateEventlistenerBoard: function(DOMfield, attack) {
        DOMfield.removeEventListener("click", attack);
    },

    _onAttackCompleted: function(game) {
        game.switchActivePlayer();
        game.playRound();
    },

    fogGameboard(gameboard) {
        gameboard.classList.add("fog");

        let buttons = Array.from(gameboard.querySelectorAll("button"));
        buttons.forEach(btn => {
            btn.classList.remove("show-grid");
        })
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