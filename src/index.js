import "./styles.css";
import screencontroller from "./screencontroller";
import game from "./game";

document.addEventListener("DOMContentLoaded", () => {
    screencontroller.addEventListeners();
    game.startGame();
});