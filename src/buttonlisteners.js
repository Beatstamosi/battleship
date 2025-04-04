import { characters } from "./enemyCharacters";
import screencontroller from "./screencontroller";
import game from "./game";

let dialog1Player = document.querySelector("#one-player-dialog");
let dialog2Players = document.querySelector("#two-players-dialog");

function turnOffStartView() {
  let startView = document.querySelector("#start-view");
  startView.style.display = "none";
}

export function turnOnGame() {
  let gameView = document.querySelector("#game-view");
  gameView.style.display = "flex";
  game.startGame();
}

function toggleEnemyIntroView() {
  const enemySelectionView = document.getElementById("enemy-selection-view");
  const isHidden =
    !enemySelectionView.style.display ||
    enemySelectionView.style.display === "none";

  enemySelectionView.style.display = isHidden ? "flex" : "none";

  // Only render when showing the view
  if (isHidden) {
    screencontroller.renderEnemySelectionView();
  }
}

export function setDialogInteraction() {
  let buttonChoice1Player = document.querySelector("#choice-one-player");
  let buttonChoice2Players = document.querySelector("#choice-two-players");
  let closeDialog1Player = document.querySelector("#close-dialog-one-player");
  let closeDialog2Players = document.querySelector("#close-dialog-two-players");

  buttonChoice1Player.addEventListener("click", () => {
    dialog1Player.showModal();
  });

  closeDialog1Player.addEventListener("click", () => {
    dialog1Player.close();
  });

  buttonChoice2Players.addEventListener("click", () => {
    dialog2Players.showModal();
  });

  closeDialog2Players.addEventListener("click", () => {
    dialog2Players.close();
  });
}

export function setStartGameBtn() {
  let buttonStart1Player = document.querySelector("#start-game-one-player");
  let buttonStart2Players = document.querySelector("#start-game-two-players");
  let player1NameInput = document.querySelector("#playerOne-input");
  let player1NameInput2Players = document.querySelector(
    "#playerOne-input-2-players",
  );
  let player2NameInput = document.querySelector("#playerTwo-input");

  // initialize players
  // single player
  buttonStart1Player.addEventListener("click", (e) => {
    e.preventDefault();
    let player1Name = player1NameInput.value
      ? player1NameInput.value
      : "Player 1";

    dialog1Player.close();

    // change view
    turnOffStartView();
    toggleEnemyIntroView();

    // initialize players
    game.initializePlayers(player1Name);
  });

  // multi player
  buttonStart2Players.addEventListener("click", (e) => {
    e.preventDefault();
    let player1Name = player1NameInput2Players.value
      ? player1NameInput2Players.value
      : "Player 1";
    let player2Name = player2NameInput.value
      ? player2NameInput.value
      : "Player 2";
    let player1CharacterChoice = document.querySelector(
      'input[name="player-1-character"]:checked',
    ).value;
    let player2CharacterChoice = document.querySelector(
      'input[name="player-2-character"]:checked',
    ).value;
    let player1Character = characters[player1CharacterChoice];
    let player2Character = characters[player2CharacterChoice];

    dialog2Players.close();

    // initialize both players with styling
    game.initializePlayers(
      player1Name,
      player1Character,
      player2Name,
      player2Character,
    );

    // change view and start game
    turnOffStartView();
    turnOnGame();
  });
}

export function setBtnsEnemyIntro() {
  const enemyIntros = document.querySelectorAll(".enemy-intro");

  enemyIntros.forEach((intro) => {
    intro.addEventListener("click", () => {
      const character = Object.values(characters).find(
        (char) => char.styling.cssClass === intro.classList[1],
      );

      if (character) {
        game.updateCharacterPlayer2(character);
        toggleEnemyIntroView();
        turnOnGame();
      }
    });
  });
}
