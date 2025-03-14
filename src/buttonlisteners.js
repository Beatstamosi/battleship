export function setDialogInteraction() {
    let buttonChoice1Player = document.querySelector("#choice-one-player");
    let buttonChoice2Players = document.querySelector("#choice-two-players");
    let dialog1Player = document.querySelector("#one-player-dialog");
    let dialog2Players = document.querySelector("#two-players-dialog")
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

    // start game
    buttonStart1Player.addEventListener("click", (e) => {
        e.preventDefault();
        let player1Name = player1NameInput.value ? player1NameInput.value : "Player 1";
        // take player names and start game via Screencontroller
        // disable start-view, enable gameview
    })

    buttonStart2Players.addEventListener("click", (e) => {
        e.preventDefault();
        let player1Name = player1NameInput.value ? player1NameInput.value : "Player 1";
        let player2Name = player2NameInput.value ? player2NameInput.value : "Player 2";

        // take player names and start game
        // disable start-view, enable gameview
    })
}
