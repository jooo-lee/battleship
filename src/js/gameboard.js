import Ship from './ship';

class Gameboard {
    constructor() {
        // 10x10 grid
        this.board = [...Array(10)].map(() => Array(10).fill(null));
    }

    getBoard() {
        return this.board;
    }

    // Check if coordinate is within bounds of our board
    #checkOnBoard(coordinate) {
        const [row, col] = coordinate;
        if (
            row < 0 ||
            row > this.board.length - 1 ||
            col < 0 ||
            col > this.board.length - 1
        ) {
            throw new Error('Coordinate out of bounds!');
        }
    }

    // Helper method for placeShip
    #placeShipHorizontally(startCoordinate, endCoordinate) {
        let [row, col1] = startCoordinate;
        let col2 = endCoordinate[1];
        /**
         * Ensure col1 <= col2 since we are incrementing from col1 to col2 in
         * the for loop below to place the ship.
         */
        if (col1 > col2) {
            [col1, col2] = [col2, col1];
        }
        const ship = new Ship(col2 - col1);
        for (let j = col1; j <= col2; j++) {
            // Undo new ship placement if we reach occupied coordinates
            if (this.board[row][j]) {
                for (j = j - 1; j >= col1; j--) {
                    this.board[row][j] = null;
                }
                throw new Error('Cannot stack ships!');
            }
            this.board[row][j] = ship;
        }
    }

    // Helper method for placeShip
    #placeShipVertically(startCoordinate, endCoordinate) {
        let [row1, col] = startCoordinate;
        let row2 = endCoordinate[0];
        /**
         * Ensure row1 <= row2 since we are incrementing from row1 to row2 in
         * the for loop below to place the ship.
         */
        if (row1 > row2) {
            [row1, row2] = [row2, row1];
        }
        const ship = new Ship(row2 - row1);
        for (let i = row1; i <= row2; i++) {
            // Undo new ship placement if we reach occupied coordinates
            if (this.board[i][col]) {
                for (i = i - 1; i >= row1; i--) {
                    this.board[i][col] = null;
                }
                throw new Error('Cannot stack ships!');
            }
            this.board[i][col] = ship;
        }
    }

    placeShip(startCoordinate, endCoordinate) {
        this.#checkOnBoard(startCoordinate);
        this.#checkOnBoard(endCoordinate);
        if (startCoordinate[0] === endCoordinate[0]) {
            this.#placeShipHorizontally(startCoordinate, endCoordinate);
        } else if (startCoordinate[1] === endCoordinate[1]) {
            this.#placeShipVertically(startCoordinate, endCoordinate);
        } else {
            throw new Error('Ships must be placed horizontally or vertically!');
        }
    }
}

export default Gameboard;
