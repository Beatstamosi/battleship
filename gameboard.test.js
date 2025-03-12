import Gameboard from "./gameboard";

// test placeShip
test("places ship on gameboard horizontally", () => {
    const gameboard = new Gameboard();
    gameboard.placeShip(2, 3, "horizontal", 3);
    expect(gameboard.board[2][3].ship).toBeTruthy();
    expect(gameboard.board[3][3].ship).toBeTruthy();
    expect(gameboard.board[4][3].ship).toBeTruthy();
    expect(gameboard.board[5][3].ship).toBeFalsy();
})

test("places ship on gameboard vertically", () => {
    const gameboard = new Gameboard();
    gameboard.placeShip(2, 3, "vertical", 3);
    expect(gameboard.board[2][3].ship).toBeTruthy();
    expect(gameboard.board[2][4].ship).toBeTruthy();
    expect(gameboard.board[2][5].ship).toBeTruthy();
    expect(gameboard.board[2][6].ship).toBeFalsy();
})

test("starting coords must be within bounds of gameboard", () => {
    const gameboard = new Gameboard();
    expect(() => {
        gameboard.placeShip(4, 10, "vertical", 3)
    }).toThrow("Coordinates must be from 0 - 9");
    expect(() => {
        gameboard.placeShip(-3, 5, "vertical", 3)
    }).toThrow("Coordinates must be from 0 - 9");
    expect(() => {
        gameboard.placeShip(10, 6, "vertical", 3)
    }).toThrow("Coordinates must be from 0 - 9");
    expect(() => {
        gameboard.placeShip(4, -3, "vertical", 3)
    }).toThrow("Coordinates must be from 0 - 9");
})

test("ship cant be placed out of bounds", () => {
    const gameboard = new Gameboard();
    expect(() => {
        gameboard.placeShip(2, 8, "vertical", 3);
    }).toThrow("Coordinates must stay in range of gameboard ((starting coordinates + length) < 9)");
})

test("cant place ship in the same spot", () => {
    const gameboard = new Gameboard();
    gameboard.placeShip(2, 3, "vertical", 3);
    expect(() => {
        gameboard.placeShip(2, 5, "vertical", 3);
    }).toThrow("A ship has already been placed in this spot");
})

// test receiveAttack
test("updates hit counter on ship object", () => {
    const gameboard = new Gameboard();
    gameboard.placeShip(2, 3, "vertical", 3);
    gameboard.receiveAttack(2, 3);
    expect(gameboard.board[2][3].ship.hits).toBe(1);
})

test("updates field hit status to true", () => {
    const gameboard = new Gameboard();
    gameboard.placeShip(2, 3, "vertical", 3);
    gameboard.receiveAttack(2, 3);
    expect(gameboard.board[2][3].hit).toBeTruthy();
})

test("updates field missed status to true", () => {
    const gameboard = new Gameboard();
    gameboard.receiveAttack(2, 3);
    expect(gameboard.board[2][3].hit).toBeFalsy();
    expect(gameboard.board[2][3].missed).toBeTruthy();
})