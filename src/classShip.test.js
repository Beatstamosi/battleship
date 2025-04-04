import Ship from "./classShip";

test("hit get increased by 1", () => {
  const ship = new Ship(3);
  expect(ship.hits).toBe(0);
  ship.hit();
  expect(ship.hits).toBe(1);
});

test("isSunk equals true when hit === length", () => {
  const ship = new Ship(3);
  ship.hit();
  ship.hit();
  ship.hit();
  expect(ship.sunk).toBeTruthy();
});
