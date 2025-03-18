import { setDialogInteraction, setStartGameBtn } from "./buttonlisteners";
import GameController from "./gameController";

const screencontroller = {
    addEventListeners() {
        setDialogInteraction();
        setStartGameBtn();
    },

    startGame() {
        let startView = document.querySelector("#start-view");
        let gameView = document.querySelector("#game-view");

        startView.style.display = "none",
        gameView.style.display = "flex";
    },

    _loadBoardOnStart: function() {
        let game = new GameController();
        let [player1, player2] = game.getPlayers();

        player1.gameboard.board.forEach((field) => {

        })
        
        // get gameboards
        // for each gameboard --> for loop through inner and outer arr
            // loop through board
            // create button
            // add row and column dataset via i + j
            // add class missed, hit, sunk
            // append to DOM
            // only for computerBoard
                // add eventlistener for each button

    }
}

export default screencontroller;


// - Display game-view
// - loadBoard on start
// - updateBoard
//     - miss
//     - hit
//     - Ship sunk
// - Display turn message
// - Display how many ships left
// - Display game over
//     - Offer restart