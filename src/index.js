import "./styles.css";
import screencontroller from "./screencontroller";
import GameController from "./gameController";

let game = new GameController();

document.addEventListener("DOMContentLoaded", () => {
    screencontroller.addEventListeners();
    game.startGame();
});