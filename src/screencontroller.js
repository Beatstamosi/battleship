import { setDialogInteraction, setStartGameBtn, setBtnsEnemyIntro } from "./buttonlisteners";
import missed from "./img/sea_1.png";
import rotate from "./img/rotate.svg";

const screencontroller = {
    addEventListeners() {
        setDialogInteraction();
        setStartGameBtn();
        setBtnsEnemyIntro();
    },

    handleBoardSetUp(player) {
        return new Promise((resolve) => {
            let boardPlayer = document.querySelector(`#board-${player.order}`);

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
                        this._removeAllShipsFromView(boardPlayer);
                        this._updateDisplayHowManyShipsLeft(player);
                        this._fogGameboard(boardPlayer);
                    }, 1500);
                    setTimeout(() => {
                        resolve()
                    }, 4000);
                });
            } else {
                this._fogGameboard(boardPlayer);
                this._updateDisplayHowManyShipsLeft(player);
                resolve();
            }
        })
    },

    _updateDisplayHowManyShipsLeft(player) {
        let display = document.querySelector(`#ships-left-${player.order}`);
        display.textContent = `Ships Left: ${player.gameboard.ships.length}`;
    },

    activateAttackFunctionsBoards(game) {
        let [player1, player2] = game.getPlayers();
        let boardPlayer1 = document.querySelector("#board-player-1");
        let boardPlayer2 = document.querySelector("#board-player-2");

        this._addEventListenerBoard(player1, boardPlayer1, game);
        this._addEventListenerBoard(player2, boardPlayer2, game);
    },

    _renderBoard: function(player, boardPlayer) {
        let board = player.gameboard.board;
        let length = board.length;
    
        boardPlayer.style.boxShadow = player.character.styling.playerBoardBoxShadow;
    
        for (let i = 0; i < length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                let button = document.createElement("button");
                button.dataset.row = j;
                button.dataset.column = i;
                button.classList.add("field-board", "show-grid");
    
                button.style.backgroundColor = "black";
    
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
                let draggedShipDiv = Array.from(document.querySelectorAll(".container-ship"))
                .find(ship => ship.dataset.shipLength == shipData.length);

                try {
                    // Call the placeShip function with the dropped coordinates and ship data
                    player.gameboard.placeShip(dropX, dropY, shipData.direction, shipData.length, shipData.image);
                    button.classList.remove("drag-over"); // remove the highlight class after drop
                    
                    if (draggedShipDiv) {
                        draggedShipDiv.remove(); // Remove the shipDiv from the DOM after placing it
                    }

                } catch (error) {
                    console.error("Failed to place ship:", error);
                    button.classList.remove("drag-over");
                } 
            });
        }) 
        
    },

    _addEventListenerBoard: function(player, boardPlayer, game) {
        let DOMfields = Array.from(boardPlayer.querySelectorAll(".field-board"));

        // use a named function so it can be removed after first click
        const attack = (event) => {
                let DOMfield = event.target;
                let x = DOMfield.dataset.row;
                let y = DOMfield.dataset.column;

                // TODO: Handle via eventTarget?
                player.gameboard.receiveAttack(x, y)
                .then((result) => this._updateFieldStatus(result, DOMfield, boardPlayer))
                .then(() => this._deactivateEventlistenerBoard(DOMfield, attack))
                .then(() => this._updateDisplayHowManyShipsLeft(player))
                .then(() => this._onAttackCompleted(game));
        }

        DOMfields.forEach((DOMfield) => {
            DOMfield.addEventListener("click", attack);
        })
    },

    _updateFieldStatus: function(result, DOMfield) {   
        DOMfield.classList.add('lightning-flash');
        DOMfield.classList.add(result);
     
        let image = result == "hit" ? `url(${DOMfield.gameField.ship.imageURL})` : `url(${missed})`;
    
        // Wait for the lightning flash animation to finish, then update the background image
        setTimeout(() => {
            DOMfield.style.backgroundImage = image;
            DOMfield.classList.remove('lightning-flash');
        }, 800); // matches the duration of the lightning animation
    },

    _deactivateEventlistenerBoard: function(DOMfield, attack) {
        DOMfield.removeEventListener("click", attack);
    },

    _onAttackCompleted: function(game) {
        setTimeout(() => {
            game.switchActivePlayer();
            game.playRound();
        }, 1500);
        
    },

    _removeAllShipsFromView(gameboard) {
        let buttons = Array.from(gameboard.querySelectorAll("button"));
        buttons.forEach(btn => {
            btn.style.backgroundImage = "";
        })
    },

    _fogGameboard(gameboard) {
        gameboard.classList.add("fog");

        let buttons = Array.from(gameboard.querySelectorAll("button"));
        buttons.forEach(btn => {
            btn.classList.remove("show-grid");
        })
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
        let containerInstructions = document.querySelector(".container-instructions");
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
        })
    },

    _toggleAssignShipDirection() {
        let containerShips = document.querySelector(".container-ship-assignment");
        let shipDivs = Array.from(containerShips.querySelectorAll('.container-ship'));
    
        // Toggle flex-direction of containerShips
        containerShips.style.flexDirection = containerShips.style.flexDirection === "column" ? "row" : "column";
    
        // Now toggle the flex-direction of each ship
        shipDivs.forEach((ship) => {
            ship.style.flexDirection = ship.style.flexDirection === "row" ? "column" : "row";
    
            // Toggle the dataset direction for the ships
            ship.dataset.direction = ship.dataset.direction === "horizontal" ? "vertical" : "horizontal";
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

        shipFields.forEach(field => {
            let fieldButton = allFields.find(button => button.gameField === field);
            if (fieldButton) {
                fieldButton.style.backgroundImage = `url(${imageURL})`;
            }
        });
    },

    displayTurnInfo(activePlayer) {
        let instructions = document.querySelector("#instructions");
        instructions.textContent = `${activePlayer.name}'s Turn`;
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
    }
}

export default screencontroller;


// - Display how many ships left
// - Display game over
//     - Offer restart