export function storePlayer1Name(playerName) {
    localStorage.setItem("player1", playerName);
}

export function storePlayer2Name(playerName) {
    localStorage.setItem("player2", playerName);
}

export function getPlayer1Name() {
    return localStorage.getItem("player1");
}

export function getPlayer2Name() {
    return localStorage.getItem("player2");
}

export function storePlayer1Character(playerCharacter) {
    localStorage.setItem("player1Character", playerCharacter);
}

export function storePlayer2Character(playerCharacter) {
    localStorage.setItem("player2Character", playerCharacter);
}

export function getPlayer1Character() {
    return localStorage.getItem("player1Character");
}

export function getPlayer2Character() {
    return localStorage.getItem("player2Character");
}
