import Ship from './ship';

class Gameboard {
    constructor() {
        this.board = [...Array(10)].map(() => Array(10).fill(null));
    }

    getBoard() {
        return this.board;
    }

    placeShip(start, end) {
        const [row1, col1] = start;
        const [row2, col2] = end;

        if (
            row1 < 0 ||
            row1 > 9 ||
            col1 < 0 ||
            col1 > 9 ||
            row2 < 0 ||
            row2 > 9 ||
            col2 < 0 ||
            col2 > 9
        ) {
            throw new Error('Ship coordinates out of bounds!');
        }

        if (row1 === row2) {
            const shipLength = Math.abs(col2 - col1);
            const ship = new Ship(shipLength);
            if (col1 < col2) {
                // Places ship horizontally left to right
                for (let j = col1; j <= col2; j++) {
                    // Check that coordinates are unoccupied
                    if (this.board[row1][j]) {
                        for (j = j - 1; j >= col1; j--) {
                            // Undo new ship placement
                            this.board[row1][j] = null;
                        }
                        throw new Error('Cannot stack ships!');
                    }

                    this.board[row1][j] = ship;
                }
            } else {
                // Places ship horizontally right to left
                for (let j = col2; j <= col1; j++) {
                    // Check that coordinates are unoccupied
                    if (this.board[row1][j]) {
                        for (j = j - 1; j >= col2; j--) {
                            // Undo new ship placement
                            this.board[row1][j] = null;
                        }
                        throw new Error('Cannot stack ships!');
                    }

                    this.board[row1][j] = ship;
                }
            }
        } else if (col1 === col2) {
            const shipLength = Math.abs(row2 - row1);
            const ship = new Ship(shipLength);
            if (row1 < row2) {
                const ship = new Ship(shipLength);
                for (let i = row1; i <= row2; i++) {
                    // Check that coordinates are unoccupied
                    if (this.board[i][col1]) {
                        for (i = i - 1; i >= row1; i--) {
                            // Undo new ship placement
                            this.board[i][col1] = null;
                        }
                        throw new Error('Cannot stack ships!');
                    }

                    this.board[i][col1] = ship;
                }
            } else {
                // Places ship vertically bottom to top
                for (let i = row2; i <= row1; i++) {
                    // Check that coordinates are unoccupied
                    if (this.board[i][col1]) {
                        for (i = i - 1; i >= row2; i--) {
                            // Undo new ship placement
                            this.board[i][col1] = null;
                        }
                        throw new Error('Cannot stack ships!');
                    }

                    this.board[i][col1] = ship;
                }
            }
        } else {
            throw new Error('Ships must be placed horizontally or vertically!');
        }
    }
}

export default Gameboard;
