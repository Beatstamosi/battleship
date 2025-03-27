import { characters } from "./enemyCharacters";
import game from "./game";

let dialog1Player = document.querySelector("#one-player-dialog");
let dialog2Players = document.querySelector("#two-players-dialog");

function turnOffStartView() {
    let startView = document.querySelector("#start-view");
    startView.style.display = "none";
}

function turnOnGame() {
    let gameView = document.querySelector("#game-view");
    gameView.style.display = "flex";
    game.startGame();
}

function toggleEnemyIntroView() {
    let enemySelectionView = document.querySelector("#enemy-selection-view");
    enemySelectionView.style.display = (enemySelectionView.style.display === "none" || enemySelectionView.style.display === "") ? "flex" : "none";
}

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

    // initialize game
    buttonStart1Player.addEventListener("click", (e) => {
        e.preventDefault();
        let player1Name = player1NameInput.value ? player1NameInput.value : "Player 1";

        dialog1Player.close();

        // change view
        turnOffStartView();
        toggleEnemyIntroView();

        // initialize players
        game.initializePlayers(player1Name);

    })

    buttonStart2Players.addEventListener("click", (e) => {
        e.preventDefault();
        let player1Name = player1NameInput.value ? player1NameInput.value : "Player 1";
        let player2Name = player2NameInput.value ? player2NameInput.value : "Player 2";
        let player1CharacterChoice = document.querySelector('input[name="player-1-character"]:checked').value;
        let player2CharacterChoice = document.querySelector('input[name="player-2-character"]:checked').value;
        let player1Character = characters[player1CharacterChoice];
        let player2Character = characters[player2CharacterChoice];

        dialog2Players.close();

        // initialize both players with styling
        game.initializePlayers(player1Name, player1Character, player2Name, player2Character);

        // change view and start game
        turnOffStartView();
        turnOnGame();
        
    })
}

export function setBtnsEnemyIntro() {
    let wraithmoorDiv = document.querySelector(".enemy-intro.wraithmoor");
    let grimhollowDiv = document.querySelector(".enemy-intro.grimhollow");
    let boneshardDiv = document.querySelector(".enemy-intro.boneshard");

    wraithmoorDiv.addEventListener("click", () => {
        game.updateCharacterPlayer2(characters.wraithmoor);
        toggleEnemyIntroView()
        turnOnGame();        
    });

    grimhollowDiv.addEventListener("click", () => {
        game.updateCharacterPlayer2(characters.grimhollow);
        toggleEnemyIntroView()
        turnOnGame();
    });

   boneshardDiv.addEventListener("click", () => {
        game.updateCharacterPlayer2(characters.boneshard);
        toggleEnemyIntroView()
        turnOnGame();
    });
}
