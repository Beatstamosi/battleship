import GameController from "./gameController"

test("initializes player vs computer", () => {
    let game = new GameController();
    game.initializePlayers("Test");
    let players = game.getPlayers();
    expect(players[0].name).toBe("Test");
    expect(players[1].name).toBe("Computer");
})

test("initializes player vs player", () => {
    let game = new GameController();
    game.initializePlayers("Test", "Test2");
    let players = game.getPlayers();
    expect(players[0].name).toBe("Test");
    expect(players[1].name).toBe("Test2");
})

test("returns correct active player", () => {
    let game = new GameController();
    game.initializePlayers("Test");
    let players = game.getPlayers();
    expect(game.getActivePlayer()).toBe(players[0]);
    game.switchActivePlayer();
    expect(game.getActivePlayer()).toBe(players[1]);
})

test("assigns Ships correctly", () => {
    let game = new GameController();
    game.initializePlayers("Test");
    game.assignRandomShips();
    let players = game.getPlayers();
    expect(players[0].gameboard.board[1][3].ship).toBeTruthy();
    expect(players[1].gameboard.board[1][3].ship).toBeTruthy();
    expect(players[0].gameboard.board[2][7].ship).toBeTruthy();
    expect(players[1].gameboard.board[2][7].ship).toBeTruthy();
    expect(players[0].gameboard.board[7][6].ship).toBeTruthy();
    expect(players[1].gameboard.board[2][4].ship).toBeTruthy();
    expect(players[0].gameboard.board[8][0].ship).toBeTruthy();
    expect(players[1].gameboard.board[8][0].ship).toBeTruthy();

})
