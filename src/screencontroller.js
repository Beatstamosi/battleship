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
    }
}

export default screencontroller;


// - Display game-view
// - loadBoard on start
    // add eventlistener for each button
// - updateBoard
//     - miss
//     - hit
//     - Ship sunk
// - Display turn message
// - Display how many ships left
// - Display game over
//     - Offer restart