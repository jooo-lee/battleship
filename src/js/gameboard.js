import Ship from './ship';

class Gameboard {
    #board;
    #ships;
    #hits;
    #misses;

    constructor() {
        // 10x10 grid
        this.#board = [...Array(10)].map(() => Array(10).fill(null));

        this.#ships = [];
        this.#hits = new Set();
        this.#misses = new Set();
        this.allShipsSunk = false;
    }

    getBoard() {
        return this.#board;
    }

    // Returns array of received missed attack coordinates
    getMisses() {
        return [...this.#misses].map((miss) => JSON.parse(miss));
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

    /**
     * Helper method for placeShip, attempts to place ship horizontally and
     * returns whether or not it was successful.
     */
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

        const ship = new Ship(col2 - col1 + 1);
        this.#ships.push(ship);
        for (let j = col1; j <= col2; j++) {
            // Undo new ship placement if we reach occupied coordinates
            if (this.#board[row][j]) {
                for (j = j - 1; j >= col1; j--) {
                    this.#board[row][j] = null;
                }
                return false;
            }
            this.#board[row][j] = ship;
        }
        return true;
    }

    /**
     * Helper method for placeShip, attempts to place ship vertically and
     * returns whether or not it was successful.
     */
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

        const ship = new Ship(row2 - row1 + 1);
        this.#ships.push(ship);
        for (let i = row1; i <= row2; i++) {
            // Undo new ship placement if we reach occupied coordinates
            if (this.#board[i][col]) {
                for (i = i - 1; i >= row1; i--) {
                    this.#board[i][col] = null;
                }
                return false;
            }
            this.#board[i][col] = ship;
        }
        return true;
    }

    // Attempts to place ship and returns whether or not it was successful
    placeShip(startCoordinates, endCoordinates) {
        if (
            !this.#isOnBoard(startCoordinates) ||
            !this.#isOnBoard(endCoordinates)
        ) {
            return false;
        }

        if (startCoordinates[0] === endCoordinates[0]) {
            return this.#placeShipHorizontally(
                startCoordinates,
                endCoordinates
            );
        } else if (startCoordinates[1] === endCoordinates[1]) {
            return this.#placeShipVertically(startCoordinates, endCoordinates);
        }
        return false;
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

        const [row, col] = coordinates;
        if (this.#board[row][col]) {
            // Ship present at coordinates
            const ship = this.#board[row][col];
            ship.hit();
            this.#hits.add(JSON.stringify(coordinates));

            // Update whether or not all ships have been sunk
            this.allShipsSunk = this.#ships.every((ship) => ship.isSunk());
        } else {
            // Ship not present at coordinates
            this.#misses.add(JSON.stringify(coordinates));
        }
        return true;
    }
}

export default Gameboard;
