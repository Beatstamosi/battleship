import Gameboard from "./gameboard";

export default class Player {
    constructor(type, name=undefined) {
        this.type = type;
        this.name = name ? name : "Computer";
        this.gameboard = new Gameboard();
    }
}