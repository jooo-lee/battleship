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
        if (row1 === row2) {
            const shipLength = Math.abs(col2 - col1);
            if (col1 < col2) {
                // Places ship horizontally left to right
                const ship = new Ship(shipLength);
                for (let j = col1; j <= col2; j++) {
                    this.board[row1][j] = ship;
                }
            } else {
                // Places ship horizontally right to left
                const ship = new Ship(shipLength);
                for (let j = col2; j <= col1; j++) {
                    this.board[row1][j] = ship;
                }
            }
        } else if (col1 === col2) {
            const shipLength = Math.abs(row2 - row1);
            if (row1 < row2) {
                // Places ship vertically top to bottom
                const ship = new Ship(shipLength);
                for (let i = row1; i <= row2; i++) {
                    this.board[i][col1] = ship;
                }
            } else {
                // Places ship vertically bottom to top
                const ship = new Ship(shipLength);
                for (let i = row2; i <= row1; i++) {
                    this.board[i][col1] = ship;
                }
            }
        } else {
            throw new Error('Ships must be placed horizontally or vertically!');
        }
    }
}

export default Gameboard;
