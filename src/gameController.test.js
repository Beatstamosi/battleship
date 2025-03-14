import GameController from "./gameController"

test("initializes player vs computer", () => {
    let game = new GameController();
    game.initializePlayers("Test");
    let players = game.getPlayers();
    expect(players[0].name).toBe("Test");
    expect(players[1].name).toBe("Computer");
})

test("returns correct active player", () => {
    let game = new GameController();
    game.initializePlayers("Test");
    let players = game.getPlayers();
    expect(game.getActivePlayer()).toBe(players[0]);
    game.switchActivePlayer();
    expect(game.getActivePlayer()).toBe(players[1]);
})
