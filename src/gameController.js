import Player from "./classPlayers";

function startGame(name1, name2=undefined) {
    let player1 = new Player("human", name1);
    let player2 = name2 ? new Player("human", name2) : new Player("computer");
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


