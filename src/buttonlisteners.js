export default function addEventListeners() {
    let buttonChoice1Player = document.querySelector("#choice-one-player");
    let buttonChoice2Players = document.querySelector("#choice-two-players");
    let dialog1Player = document.querySelector("#one-player-dialog");
    let dialog2Players = document.querySelector("#two-players-dialog")
    let closeDialog1Player = document.querySelector("#close-dialog-one-player");
    let closeDialog2Players = document.querySelector("#close-dialog-two-players");
    let buttonStart1Player = document.querySelector("#start-game-one-player");
    let buttonStart2Players = document.querySelector("#start-game-two-players");

    // dialog interaction
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

    // start game
    buttonStart1Player.addEventListener("click", () => {
        // take player names and start game
    })

    buttonStart2Players.addEventListener("click", () => {
        // take player names and start game
    })


}