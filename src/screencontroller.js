import {
  setDialogInteraction,
  setStartGameBtn,
  setBtnsEnemyIntro,
} from "./buttonlisteners";
import { characters } from "./enemyCharacters";
import { getSpeech } from "./enemyCharacters";
import missed from "./img/sea_1.png";
import rotate from "./img/rotate.svg";
let intervalEnemySpeech;

const screencontroller = {
  addEventListeners() {
    setDialogInteraction();
    setStartGameBtn();
  },

  handleBoardSetUp(player) {
    return new Promise((resolve) => {
      let boardPlayer = this.getDOMBoard(player);

      // renderBoard player
      this._renderBoard(player, boardPlayer);

      if (player.type === "human") {
        // renderAssignShips player1
        this._renderAssignShips(player);

        // After ship assigning is started, listen for the 'shipPlaced' event
        player.gameboard.eventTarget.addEventListener("shipPlaced", (event) => {
          const { shipFields, imageURL } = event.detail;
          this._showShipsInGridAfterDrop(shipFields, boardPlayer, imageURL);
        });

        player.gameboard.eventTarget.addEventListener("allShipsPlaced", () => {
          this._clearInstructions();
          setTimeout(() => {
            this._fogInstructions();
            this._fogGameboard(boardPlayer);
            this._removeAllShipsFromView(boardPlayer);
            this._updateDisplayHowManyShipsLeft(player);
          }, 1000);
          setTimeout(() => {
            resolve();
          }, 2000);
        });
      } else {
        this._fogGameboard(boardPlayer);
        this._updateDisplayHowManyShipsLeft(player);
        this._displayEnemySpeech(player);
        this._startUpdatingEnemySpeech(player);
        resolve();
      }
    });
  },

  _updateDisplayHowManyShipsLeft(player) {
    let display = document.querySelector(`#ships-left-${player.order}`);
    display.textContent = `Ships Left: ${player.gameboard.ships.length}`;
  },

  activateAttackFunctionsBoards(game) {
    let [player1, player2] = game.getPlayers();
    let boardPlayer1 = this.getDOMBoard(player1);
    let boardPlayer2 = this.getDOMBoard(player2);

    this._addEventListenerBoard(player1, boardPlayer1, game);
    this._addEventListenerBoard(player2, boardPlayer2, game);
  },

  _renderBoard: function (player, boardPlayer) {
    let board = player.gameboard.board;
    let length = board.length;

    boardPlayer.style.boxShadow = player.character.styling.playerBoardBoxShadow;

    for (let i = 0; i < length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        let button = document.createElement("button");
        button.dataset.row = j;
        button.dataset.column = i;
        button.classList.add("field-board", "show-grid");

        // Link the button with the corresponding field
        button.gameField = board[j][i];

        boardPlayer.append(button);
      }
    }

    // assign drop Functionality to Grid after board is rendered
    let fields = Array.from(boardPlayer.querySelectorAll("button"));
    this._dropFunctionalityGridButtons(player, fields);
  },

  _dropFunctionalityGridButtons(player, fields) {
    fields.forEach((button) => {
      // Enable the grid cell to accept drops
      button.addEventListener("dragover", (e) => {
        e.preventDefault(); // Necessary to allow the drop
        button.classList.add("drag-over"); // Optional: add class to highlight the field when dragging over
      });

      button.addEventListener("dragleave", (e) => {
        button.classList.remove("drag-over"); // Optional: remove the highlight class
      });

      button.addEventListener("drop", (e) => {
        e.preventDefault();
        // Retrieve the ship data from the dataTransfer object (parse the JSON)
        const shipData = JSON.parse(e.dataTransfer.getData("ship")); // Parse the JSON back into an object

        // Get the drop coordinates (the first field position)
        let dropX = e.target.dataset.row;
        let dropY = e.target.dataset.column;

        // Find the dragged ship div using its length
        let draggedShipDiv = Array.from(
          document.querySelectorAll(".container-ship"),
        ).find((ship) => ship.dataset.shipLength == shipData.length);

        try {
          // Call the placeShip function with the dropped coordinates and ship data
          player.gameboard.placeShip(
            dropX,
            dropY,
            shipData.direction,
            shipData.length,
            shipData.image,
          );
          button.classList.remove("drag-over"); // remove the highlight class after drop

          if (draggedShipDiv) {
            draggedShipDiv.remove(); // Remove the shipDiv from the DOM after placing it
          }
        } catch (error) {
          console.error("Failed to place ship:", error);
          button.classList.remove("drag-over");
        }
      });
    });
  },

  _addEventListenerBoard: function (player, boardPlayer, game) {
    let DOMfields = Array.from(boardPlayer.querySelectorAll(".field-board"));

    // use a named function so it can be removed after first click
    const attack = (event) => {
      let DOMfield = event.target;
      let x = DOMfield.dataset.row;
      let y = DOMfield.dataset.column;

      let inactivePLayer = game.getNonActivePlayer();
      this.disableBoard(inactivePLayer);

      // TODO: Handle via eventTarget?
      player.gameboard
        .receiveAttack(x, y)
        .then((result) =>
          this._updateFieldStatus(result, DOMfield, boardPlayer, player),
        )
        .then(() => this._deactivateEventlistenerBoard(DOMfield, attack))
        .then(() => this._updateDisplayHowManyShipsLeft(player))
        .then(() => this._onAttackCompleted(game))
        .catch((error) => {
          console.error("Error during attack:", error);
        });
    };

    DOMfields.forEach((DOMfield) => {
      DOMfield.addEventListener("click", attack);
    });
  },

  _updateFieldStatus: function (result, DOMfield, boardPlayer, player) {
    DOMfield.classList.add("lightning-flash");
    DOMfield.classList.add(result);

    let image = result.includes("hit")
      ? `url(${DOMfield.gameField.ship.imageURL})`
      : `url(${missed})`;

    // Wait for the lightning flash animation to finish, then update the background image
    setTimeout(() => {
      DOMfield.style.backgroundImage = image;
      DOMfield.classList.remove("lightning-flash");
    }, 600); // matches the duration of the lightning animation

    if (result.includes("sunk")) {
      let DOMfields = Array.from(boardPlayer.querySelectorAll(".field-board"));

      // filter allButtons for matching DOMfield.gamefield.ship.imageURL
      let shipFields = DOMfields.filter((field) => {
        return (
          field.gameField &&
          field.gameField.ship &&
          field.gameField.ship.imageURL === DOMfield.gameField.ship.imageURL
        );
      });

      // for each button classlist.add(crossed-out)
      shipFields.forEach((field) => {
        setTimeout(() => {
          field.classList.add("crossed-out");
          let color = player.character.styling.backGroundColorBoard;
          field.style.color = `${color}`;
          field.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}, 0 0 15px ${color};`;
        }, 800);
      });
    }
  },

  _deactivateEventlistenerBoard: function (DOMfield, attack) {
    DOMfield.removeEventListener("click", attack);
  },

  _onAttackCompleted: function (game) {
    setTimeout(() => {
      game.switchActivePlayer();
      game.playRound();
    }, 1700);
  },

  _removeAllShipsFromView(gameboard) {
    let buttons = Array.from(gameboard.querySelectorAll("button"));
    buttons.forEach((btn) => {
      btn.style.backgroundImage = "";
    });
  },

  _fogGameboard(gameboard) {
    gameboard.classList.add("fog");

    let buttons = Array.from(gameboard.querySelectorAll("button"));
    buttons.forEach((btn) => {
      btn.classList.remove("show-grid");
    });
  },

  _fogInstructions() {
    let instructions = document.querySelector("#instructions");
    instructions.textContent = "The Fog has swallowed your fleet!";
  },

  _clearInstructions() {
    let instructions = document.querySelector("#instructions");
    let containerShips = document.querySelector(".container-ship-assignment");
    let containerRotateFn = document.querySelector(".container-rotate-btn");

    if (containerShips) containerShips.remove();
    if (containerRotateFn) containerRotateFn.remove();

    instructions.textContent = "";
  },

  _renderAssignShips(player) {
    let containerInstructions = document.querySelector(
      ".container-instructions",
    );
    let instructions = document.querySelector("#instructions");

    instructions.textContent = `${player.name} drag your fleet onto your board.`;

    let containerShips = document.createElement("div");
    containerShips.classList.add("container-ship-assignment");
    containerShips.style.flexDirection = "column";
    containerInstructions.appendChild(containerShips);

    for (let i = 1; i <= 5; i++) {
      let shipDiv = document.createElement("div");
      shipDiv.classList.add("container-ship");
      shipDiv.style.flexDirection = "row";
      shipDiv.setAttribute("draggable", "true"); // Make the ship draggable

      // Set custom properties for direction, length, and image URL
      shipDiv.dataset.direction = "horizontal"; // Default to horizontal direction
      shipDiv.dataset.shipLength = i; // Length of the ship (1 to 5)

      let image = player.character.ships[i];
      shipDiv.imageURL = image; // Store the image URL directly on the shipDiv

      // Create ship images based on the ship length
      let fragment = document.createDocumentFragment();
      for (let j = 0; j < i; j++) {
        let imgElement = document.createElement("img");
        imgElement.src = image;
        fragment.appendChild(imgElement);
      }

      shipDiv.appendChild(fragment);
      containerShips.appendChild(shipDiv);

      this.enableDragStartOnShipAssignment(shipDiv);
    }

    // add button to rotate all ships
    let rotateBtnContainer = document.createElement("div");
    rotateBtnContainer.classList.add("container-rotate-btn");

    let text = document.createElement("p");
    text.textContent = "Rotate Ships";
    let img = document.createElement("img");
    img.src = rotate;

    rotateBtnContainer.append(text, img);

    containerInstructions.insertBefore(rotateBtnContainer, containerShips);

    rotateBtnContainer.addEventListener("click", () => {
      this._toggleAssignShipDirection();
    });
  },

  renderEnemySelectionView() {
    const enemySelectionView = document.getElementById("enemy-selection-view");
    enemySelectionView.innerHTML = `
            <div>
                <h1 class="title-small">Choose your enemy</h1>
            </div>
            <div id="container-enemies">
                ${Object.values(characters)
                  .filter((char) => char !== characters.human)
                  .map(
                    (character) => `
                    <div class="enemy-intro ${character.styling.cssClass}">
                        <img src="${character.styling.imageUrl}" alt="">
                        <h2>${character.name}</h2>
                        <p>${character.description}</p>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        `;

    setBtnsEnemyIntro(); // Set up the event listeners
  },

  _toggleAssignShipDirection() {
    let containerShips = document.querySelector(".container-ship-assignment");
    let shipDivs = Array.from(
      containerShips.querySelectorAll(".container-ship"),
    );

    // Toggle flex-direction of containerShips
    containerShips.style.flexDirection =
      containerShips.style.flexDirection === "column" ? "row" : "column";

    // Now toggle the flex-direction of each ship
    shipDivs.forEach((ship) => {
      ship.style.flexDirection =
        ship.style.flexDirection === "row" ? "column" : "row";

      // Toggle the dataset direction for the ships
      ship.dataset.direction =
        ship.dataset.direction === "horizontal" ? "vertical" : "horizontal";
    });
  },

  enableDragStartOnShipAssignment(shipDiv) {
    shipDiv.addEventListener("dragstart", (e) => {
      // Create the ship data object with direction, length, and image URL
      const shipData = {
        direction: shipDiv.dataset.direction,
        length: shipDiv.dataset.shipLength,
        image: shipDiv.imageURL,
      };

      // Set the ship data to be transferred (convert to JSON string)
      e.dataTransfer.setData("ship", JSON.stringify(shipData)); // Convert the data to a JSON string

      // Customize the drag image
      e.dataTransfer.setDragImage(shipDiv, 0, 0);

      e.dataTransfer.effectAllowed = "move"; // Specify the allowed effect (move)
    });
  },

  _showShipsInGridAfterDrop(shipFields, boardPlayer, imageURL) {
    let allFields = Array.from(boardPlayer.querySelectorAll(".field-board")); // Use the provided board element

    shipFields.forEach((field) => {
      let fieldButton = allFields.find((button) => button.gameField === field);
      if (fieldButton) {
        fieldButton.style.backgroundImage = `url(${imageURL})`;
      }
    });
  },

  displayTurnInfo(activePlayer) {
    let instructions = document.querySelector("#instructions");
    instructions.textContent = `${activePlayer.name}'s Turn`;

    let attackInstructions = document.querySelector("#attack-instructions");

    if (activePlayer.type === "human") {
      attackInstructions.textContent = "Click on enemies board to attack field";
    } else {
      attackInstructions.textContent = "";
    }
  },

  _displayEnemySpeech(player) {
    let container = document.createElement("div");
    container.classList.add("container-enemy-speech");

    let img = document.createElement("img");
    img.src = player.character.styling.imageUrl;
    img.style.border = `1px solid ${player.character.styling.backGroundColorBoard}`;

    let text = document.createElement("p");
    text.textContent = `${getSpeech(player.character)}`;
    text.style.color = player.character.styling.backGroundColorBoard;

    container.append(img, text);
    document.body.append(container);
  },

  _updateEnemySpeech(player) {
    let speechDOM = document.querySelector(".container-enemy-speech p");
    let speech = getSpeech(player.character);

    speechDOM.textContent = speech;
  },

  _startUpdatingEnemySpeech(player) {
    intervalEnemySpeech = setInterval(() => {
      this._updateEnemySpeech(player);
    }, 6000);
  },

  _stopUpdatingEnemySpeech() {
    clearInterval(intervalEnemySpeech);
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
    instructions.textContent = `${player.name} wins!`;

    let attackInstructions = document.querySelector("#attack-instructions");
    attackInstructions.textContent = "";

    this._stopUpdatingEnemySpeech();

    // restart Game
    let containerInstructions = document.querySelector(
      ".container-instructions",
    );
    let restartBtn = document.createElement("button");
    restartBtn.classList.add("restart-btn");
    restartBtn.textContent = "Back to Start";
    containerInstructions.appendChild(restartBtn);

    restartBtn.addEventListener("click", () => {
      location.reload();
    });
  },
};

export default screencontroller;
