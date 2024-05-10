import Ship from './ship';

class Gameboard {
    constructor() {
        this.board = [...Array(10)].map(() => Array(10).fill(null));
    }

    getBoard() {
        return this.board;
    }

    /**
     * For horizontal ships, assume that col1 < col2
     * For vertical ships, assume that row1 < row2
     */
    placeShip(start, end) {
        const [row1, col1] = start;
        const [row2, col2] = end;
        if (row1 === row2) {
            // Place ship horizontally
            const shipLength = Math.abs(col2 - col1);
            const ship = new Ship(shipLength);
            for (let j = col1; j <= col2; j++) {
                this.board[row1][j] = ship;
            }
        }
    }
}

export default Gameboard;
