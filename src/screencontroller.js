import { setDialogInteraction, setStartGameBtn } from "./buttonlisteners";

export default screencontroller = {
    addEventListeners() {
        setDialogInteraction();
        setStartGameBtn();
    },

    
}


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