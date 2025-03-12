import Gameboard from "./gameboard";

export default class Player {
    constructor(type) {
        this.type = type;
        this.gameboard = new Gameboard();
    }
}