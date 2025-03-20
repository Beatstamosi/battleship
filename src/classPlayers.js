import Gameboard from "./gameboard";

export default class Player {
    constructor(type, order, name=undefined) {
        this.type = type;
        this.name = name ? name : "Computer";
        this.order = `player-${order}`;
        this.gameboard = new Gameboard();
    }
}