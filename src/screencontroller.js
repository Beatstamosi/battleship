import { setDialogInteraction, setStartGameBtn } from "./buttonlisteners";

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
        this._addEventListenerBoard(player1, boardPlayer1);
        this._addEventListenerBoard(player2, boardPlayer2);
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

    _addEventListenerBoard: function(player, boardPlayer) {
        let DOMfields = Array.from(boardPlayer.querySelectorAll(".field-board"));

        // use a named function so it can be removed after first click
        const attack = (event) => {
                let DOMfield = event.target;
                let x = DOMfield.dataset.row;
                let y = DOMfield.dataset.column;

                player.gameboard.receiveAttack(x, y);

                this._updateFieldStatus(player.gameboard.board[x][y], DOMfield, attack);
        }

        DOMfields.forEach((DOMfield) => {
            DOMfield.addEventListener("click", attack);
        })
    },

    _updateFieldStatus: function(boardfield, DOMfield, attack) {
        if (boardfield.missed === true) {
            DOMfield.textContent = "X";     // TODO: remove after class has design
            DOMfield.classList.add("missed");
        } else if (boardfield.hit === true) {
            DOMfield.textContent = "0";     // TODO: remove after class has design
            DOMfield.classList.add("hit");
        }

        // deactivate button
        DOMfield.removeEventListener("click", attack);

        // TODO: update later with ship.sunk ?
            // update all fields of ship
    }
}

export default screencontroller;

// screencontroller.displayTurnInfo(activePlayer);
// screencontroller.disableBoard(activePlayer);


// - Display how many ships left
// - Display game over
//     - Offer restart