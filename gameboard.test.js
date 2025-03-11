import Gameboard from "./gameboard";

// test placeShip
test("places ship on gameboard horizontally", () => {
    const board = new Gameboard();
    board.placeShip([2, 3], "horizontal", 3);
    expect(board.board[2][3].ship).toBeTruthy();
    expect(board.board[3][3].ship).toBeTruthy();
    expect(board.board[4][3].ship).toBeTruthy();
    expect(board.board[5][3].ship).toBeFalsy();
})

test("places ship on gameboard vertically", () => {
    const board = new Gameboard();
    board.placeShip([2, 3], "vertical", 3);
    expect(board.board[2][3].ship).toBeTruthy();
    expect(board.board[2][4].ship).toBeTruthy();
    expect(board.board[2][5].ship).toBeTruthy();
    expect(board.board[2][6].ship).toBeFalsy();
})

test("starting coords must be within bounds of gameboard", () => {
    const board = new Gameboard();
    expect(() => {
        board.placeShip([4, 10], "vertical", 3)
    }).toThrow("Coordinates must be from 0 - 9");
    expect(() => {
        board.placeShip([-3, 5], "vertical", 3)
    }).toThrow("Coordinates must be from 0 - 9");
    expect(() => {
        board.placeShip([10, 6], "vertical", 3)
    }).toThrow("Coordinates must be from 0 - 9");
    expect(() => {
        board.placeShip([4, -3], "vertical", 3)
    }).toThrow("Coordinates must be from 0 - 9");
})

test("ship cant be placed out of bounds", () => {
    const board = new Gameboard();
    expect(() => {
        board.placeShip([2, 8], "vertical", 3);
    }).toThrow("Coordinates must stay in range of gameboard ((starting coordinates + length) < 9)");
})

test("cant place ship in the same spot", () => {
    const board = new Gameboard();
    board.placeShip([2, 3], "vertical", 3);
    expect(() => {
        board.placeShip([2, 5], "vertical", 3);
    }).toThrow("A ship has already been placed in this spot");
})