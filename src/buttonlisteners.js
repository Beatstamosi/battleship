import { storePlayer1Name, storePlayer2Name, getPlayer1Name, getPlayer2Name, storePlayer1Character, storePlayer2Character, getPlayer1Character, getPlayer2Character } from "./localStorage";

let dialog1Player = document.querySelector("#one-player-dialog");
let dialog2Players = document.querySelector("#two-players-dialog");

export function setDialogInteraction() {
    let buttonChoice1Player = document.querySelector("#choice-one-player");
    let buttonChoice2Players = document.querySelector("#choice-two-players");
    let closeDialog1Player = document.querySelector("#close-dialog-one-player");
    let closeDialog2Players = document.querySelector("#close-dialog-two-players");

    buttonChoice1Player.addEventListener("click", () => {
        dialog1Player.showModal();
    })

    closeDialog1Player.addEventListener("click", () => {
        dialog1Player.close();
    })

    buttonChoice2Players.addEventListener("click", () => {
        dialog2Players.showModal();
    })

    closeDialog2Players.addEventListener("click", () => {
        dialog2Players.close();
    })
}

export function setStartGameBtn() {
    let buttonStart1Player = document.querySelector("#start-game-one-player");
    let buttonStart2Players = document.querySelector("#start-game-two-players");
    let player1NameInput = document.querySelector("#playerOne-input");
    let player2NameInput = document.querySelector("#playerTwo-input");
    let startView = document.querySelector("#start-view");
    let enemySelectionView = document.querySelector("#enemy-selection-view");

    // start game
    buttonStart1Player.addEventListener("click", (e) => {
        e.preventDefault();
        let player1Name = player1NameInput.value ? player1NameInput.value : "Player 1";
        storePlayer1Name(player1Name);

        dialog1Player.close();

        startView.style.display = "none";
        enemySelectionView.style.display = "flex";

        // TODO: Set Buttonlistener on enemy div to start game
            // First display message of enemy
            // startGame later via setTimeOut
    })

    buttonStart2Players.addEventListener("click", (e) => {
        e.preventDefault();
        let player1Name = player1NameInput.value ? player1NameInput.value : "Player 1";
        let player2Name = player2NameInput.value ? player2NameInput.value : "Player 2";
        let player1Character = document.querySelector('input[name="player-1-character"]:checked').value;
        let player2Character = document.querySelector('input[name="player-2-character"]:checked').value;

        storePlayer1Name(player1Name);
        storePlayer2Name(player2Name);
        storePlayer1Character(player1Character);
        storePlayer2Character(player2Character);

        dialog2Players.close();

        // TODO: disable start-view, enable gameview
    })
}
