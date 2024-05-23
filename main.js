/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/dom.js
const renderBoard = (container, gameboard, isEnemy, sqClickCb = null) => {
    if (isEnemy && !sqClickCb) {
        throw new Error('Callback not provided for enemy board!');
    }

    // Clear DOM board
    container.replaceChildren();

    for (let i = 0; i < gameboard.length; i++) {
        for (let j = 0; j < gameboard.length; j++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.dataset.row = i;
            square.dataset.column = j;
            if (!isEnemy && gameboard.hasShipAt([i, j])) {
                // Make ship visible in DOM
                square.classList.add('ship');
            }
            if (isEnemy) {
                square.addEventListener('click', sqClickCb);
                square.classList.add('enemy-square');
            }
            container.appendChild(square);
        }
    }
};

const markMiss = (square) => {
    square.classList.add('miss');
};

const markHit = (square) => {
    square.classList.add('hit');
};

const activateRandomizeShips = (callback) => {
    document
        .querySelector('#randomize-ships-btn')
        .addEventListener('click', callback);
};

const displayGameOver = (message) => {
    document.querySelector('#game-over-modal').showModal();
    document.querySelector('#winner').textContent = `${message}`;
    document
        .querySelector('#play-again-btn')
        .addEventListener('click', () => window.location.reload());
};



;// CONCATENATED MODULE: ./src/js/ship.js
class Ship {
    #length;
    #hits;

    constructor(length) {
        if (length < 2 || length > 5) {
            throw new Error('Ship length must be between 2 and 5!');
        }
        this.#length = length;
        this.#hits = 0;
    }

    get length() {
        return this.#length;
    }

    get hits() {
        return this.#hits;
    }

    // Increase number of 'hits' on ship, cap at length
    hit() {
        if (this.#hits < this.#length) this.#hits++;
    }

    // Calculate whether or not ship is sunk based on its length and hits received
    isSunk() {
        return this.#hits >= this.#length;
    }
}

/* harmony default export */ const js_ship = (Ship);

;// CONCATENATED MODULE: ./src/js/gameboard.js


class Gameboard {
    #board;
    #length;
    #ships;
    #hits;
    #misses;
    #allShipsSunk;

    constructor() {
        this.#length = 10;
        this.#board = [...Array(this.#length)].map(() =>
            Array(this.#length).fill(null)
        );
        this.#ships = [];
        this.#hits = new Set();
        this.#misses = new Set();
        this.#allShipsSunk = false;
    }

    get length() {
        return this.#length;
    }

    get ships() {
        return this.#ships;
    }

    // Returns array of received missed attack coordinates
    get misses() {
        return [...this.#misses].map((miss) => JSON.parse(miss));
    }

    get allShipsSunk() {
        return this.#allShipsSunk;
    }

    #isOnBoard(coordinates) {
        const [row, col] = coordinates;
        return (
            row >= 0 &&
            row < this.#board.length &&
            col >= 0 &&
            col < this.#board.length
        );
    }

    hasShipAt(coordinates) {
        const [row, col] = coordinates;
        return !!this.#board[row][col];
    }

    getShipAt(coordinates) {
        if (!this.hasShipAt(coordinates)) {
            throw new Error('No ship at given coordinates!');
        }
        const [row, col] = coordinates;
        return this.#board[row][col];
    }

    #isValidShipPlacement(startCoordinates, endCoordinates) {
        // Ensure coordinates are on the board
        if (
            !this.#isOnBoard(startCoordinates) ||
            !this.#isOnBoard(endCoordinates)
        ) {
            return false;
        }

        // Prevent diagonal ship placement
        if (
            startCoordinates[0] !== endCoordinates[0] &&
            startCoordinates[1] !== endCoordinates[1]
        ) {
            throw new Error('Ship cannot be placed diagonally!');
        }

        /**
         * Ensure coordinates from startCoordinates to endCoordinates (inclusive)
         * are not already occupied by another ship.
         */
        if (startCoordinates[0] === endCoordinates[0]) {
            let [row, col1] = startCoordinates;
            let col2 = endCoordinates[1];

            /**
             * Ensure col1 <= col2 since we are incrementing from col1 to col2 in
             * the for loop below.
             */
            if (col1 > col2) {
                [col1, col2] = [col2, col1];
            }

            // Traverse horizontally
            for (let j = col1; j <= col2; j++) {
                if (this.hasShipAt([row, j])) {
                    // Coordinates already occupied
                    return false;
                }
            }

            return true;
        } else {
            let [row1, col] = startCoordinates;
            let row2 = endCoordinates[0];

            /**
             * Ensure row1 <= row2 since we are incrementing from row1 to row2 in
             * the for loop below.
             */
            if (row1 > row2) {
                [row1, row2] = [row2, row1];
            }

            // Traverse vertically
            for (let i = row1; i <= row2; i++) {
                if (this.hasShipAt([i, col])) {
                    // Coordinates already occupied
                    return false;
                }
            }

            return true;
        }
    }

    // Places ship horizontally
    #placeShipHorizontally(startCoordinates, endCoordinates) {
        let [row, col1] = startCoordinates;
        let col2 = endCoordinates[1];

        /**
         * Ensure col1 <= col2 since we are incrementing from col1 to col2 in
         * the for loop below to place the ship.
         */
        if (col1 > col2) {
            [col1, col2] = [col2, col1];
        }

        const ship = new js_ship(col2 - col1 + 1);
        this.#ships.push(ship);
        for (let j = col1; j <= col2; j++) {
            this.#board[row][j] = ship;
        }
    }

    // Places ship vertically
    #placeShipVertically(startCoordinates, endCoordinates) {
        let [row1, col] = startCoordinates;
        let row2 = endCoordinates[0];

        /**
         * Ensure row1 <= row2 since we are incrementing from row1 to row2 in
         * the for loop below to place the ship.
         */
        if (row1 > row2) {
            [row1, row2] = [row2, row1];
        }

        const ship = new js_ship(row2 - row1 + 1);
        this.#ships.push(ship);
        for (let i = row1; i <= row2; i++) {
            this.#board[i][col] = ship;
        }
    }

    // Places ship at specified coordinates if possible
    placeShip(startCoordinates, endCoordinates) {
        if (this.#isValidShipPlacement(startCoordinates, endCoordinates)) {
            if (startCoordinates[0] === endCoordinates[0]) {
                this.#placeShipHorizontally(startCoordinates, endCoordinates);
            } else {
                this.#placeShipVertically(startCoordinates, endCoordinates);
            }
        }
    }

    #placeShipRandomly(shipLength) {
        if (typeof shipLength === 'undefined') {
            throw new Error('Missing ship length!');
        }
        let isShipVertical = Math.random() < 0.5;
        let rowStart = Math.floor(Math.random() * 10);
        let colStart = Math.floor(Math.random() * 10);
        let rowEnd;
        let colEnd;
        if (isShipVertical) {
            rowEnd = rowStart + shipLength - 1;
            colEnd = colStart;
        } else {
            rowEnd = rowStart;
            colEnd = colStart + shipLength - 1;
        }
        while (
            !this.#isValidShipPlacement([rowStart, colStart], [rowEnd, colEnd])
        ) {
            rowStart = Math.floor(Math.random() * 10);
            colStart = Math.floor(Math.random() * 10);
            if (isShipVertical) {
                rowEnd = rowStart + shipLength - 1;
                colEnd = colStart;
            } else {
                rowEnd = rowStart;
                colEnd = colStart + shipLength - 1;
            }
        }
        this.placeShip([rowStart, colStart], [rowEnd, colEnd]);
    }

    #reset() {
        this.#length = 10;
        this.#board = [...Array(this.#length)].map(() =>
            Array(this.#length).fill(null)
        );
        this.#ships = [];
        this.#hits = new Set();
        this.#misses = new Set();
        this.#allShipsSunk = false;
    }

    randomizeShips() {
        this.#reset();
        this.#placeShipRandomly(5);
        this.#placeShipRandomly(4);
        this.#placeShipRandomly(3);
        this.#placeShipRandomly(3);
        this.#placeShipRandomly(2);
    }

    /**
     * Receives attack at coordinates and returns whether or not those
     * coordinates have been attacked previously.
     */
    receiveAttack(coordinates) {
        if (!this.#isOnBoard(coordinates)) {
            throw new Error('Attack coordinates out of bounds!');
        }

        // Returns false if coordinates have previously been attacked
        if (
            this.#hits.has(JSON.stringify(coordinates)) ||
            this.#misses.has(JSON.stringify(coordinates))
        ) {
            return false;
        }

        if (this.hasShipAt(coordinates)) {
            // Ship present at coordinates
            const ship = this.getShipAt(coordinates);
            ship.hit();
            this.#hits.add(JSON.stringify(coordinates));

            // Update whether or not all ships have been sunk
            this.#allShipsSunk = this.#ships.every((ship) => ship.isSunk());
        } else {
            // Ship not present at coordinates
            this.#misses.add(JSON.stringify(coordinates));
        }
        return true;
    }
}

/* harmony default export */ const gameboard = (Gameboard);

;// CONCATENATED MODULE: ./src/js/player.js


class Player {
    #type;
    #gameboard;

    constructor(type) {
        if (type !== 'human' && type !== 'computer') {
            throw new Error('Invalid player type!');
        }
        this.#type = type;
        this.#gameboard = new gameboard();
    }

    get type() {
        return this.#type;
    }

    get gameboard() {
        return this.#gameboard;
    }
}

/* harmony default export */ const player = (Player);

;// CONCATENATED MODULE: ./src/js/runGame.js



const playerOne = new player('human');
const playerOneGameboard = playerOne.gameboard;

const playerTwo = new player('computer');
const playerTwoGameboard = playerTwo.gameboard;

const players = [playerOne, playerTwo];
let activePlayer = players[0];

const switchTurns = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
};

const playerOneWon = () => {
    return playerTwoGameboard.allShipsSunk;
};

const playerTwoWon = () => {
    return playerOneGameboard.allShipsSunk;
};

const getRandomCoordinates = () => {
    const randomRow = Math.floor(Math.random() * 10);
    const randomCol = Math.floor(Math.random() * 10);
    return [randomRow, randomCol];
};

const takeTurn = (e) => {
    if (activePlayer !== players[0]) {
        return;
    }

    // Player one's turn
    const attackedCoordinates = [e.target.dataset.row, e.target.dataset.column];
    if (playerTwoGameboard.receiveAttack(attackedCoordinates)) {
        if (playerTwoGameboard.hasShipAt(attackedCoordinates)) {
            markHit(e.target);
            if (playerOneWon()) {
                displayGameOver('You win!');
                return;
            }
        } else {
            markMiss(e.target);
        }
    } else {
        return;
    }
    switchTurns();

    // Player two's turn
    setTimeout(() => {
        let randomCoordinates = getRandomCoordinates();

        while (!playerOneGameboard.receiveAttack(randomCoordinates)) {
            randomCoordinates = getRandomCoordinates();
        }

        const [chosenRow, chosenCol] = randomCoordinates;
        const attackedSquare = document.querySelector(
            `#player-one-board > .square:nth-child(${chosenRow * 10 + chosenCol + 1})`
        );

        if (playerOneGameboard.hasShipAt(randomCoordinates)) {
            markHit(attackedSquare);
            if (playerTwoWon()) {
                displayGameOver('Computer wins!');
                return;
            }
        } else {
            markMiss(attackedSquare);
        }
        switchTurns();
    }, 500);
};

const randomizeShips = () => {
    playerOneGameboard.randomizeShips();
    playerTwoGameboard.randomizeShips();

    renderBoard(
        document.querySelector('#player-one-board'),
        playerOneGameboard,
        false
    );
    renderBoard(
        document.querySelector('#player-two-board'),
        playerTwoGameboard,
        true,
        takeTurn
    );
};

const runGame = () => {
    activateRandomizeShips(randomizeShips);
    randomizeShips();
};

/* harmony default export */ const js_runGame = (runGame);

;// CONCATENATED MODULE: ./src/js/index.js



js_runGame();

/******/ })()
;
//# sourceMappingURL=main.js.map