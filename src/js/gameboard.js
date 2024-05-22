import Ship from './ship';

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

        const ship = new Ship(col2 - col1 + 1);
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

        const ship = new Ship(row2 - row1 + 1);
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

export default Gameboard;
