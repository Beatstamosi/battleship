import Gameboard from "./gameboard";

export default class Player {
  constructor(type, order, name = undefined, character = undefined) {
    this.type = type;
    this.name = name ? name : "Computer";
    this.order = `player-${order}`;
    this.character = character ? character : null;
    this.gameboard = new Gameboard();
  }

  updatePlayer(character) {
    this.character = character;
    this.name = character.name;
  }
}
