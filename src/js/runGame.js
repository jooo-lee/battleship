import { renderBoard, markMiss, markHit, displayGameOver } from './dom';
import Player from './player';

const playerOne = new Player('human');
const playerOneGameboard = playerOne.gameboard;

const playerTwo = new Player('computer');
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

const takeTurn = (e) => {
    if (activePlayer !== players[0]) {
        return;
    }

    // Player one's turn
    const row = e.target.dataset.row;
    const col = e.target.dataset.column;
    if (playerTwoGameboard.receiveAttack([row, col])) {
        if (playerTwoGameboard.board[row][col]) {
            // Ship present at [row, col]
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
        let randomRow = Math.floor(Math.random() * 10);
        let randomCol = Math.floor(Math.random() * 10);

        while (!playerOneGameboard.receiveAttack([randomRow, randomCol])) {
            randomRow = Math.floor(Math.random() * 10);
            randomCol = Math.floor(Math.random() * 10);
        }

        const attackedSquare = document.querySelector(
            `#player-one-board > .square:nth-child(${randomRow * 10 + randomCol + 1})`
        );

        if (playerOneGameboard.board[randomRow][randomCol]) {
            // Ship present at [randomRow, randomCol]
            markHit(attackedSquare);

            if (playerTwoWon()) {
                displayGameOver('Computer wins!');
                return;
            }
        } else {
            markMiss(attackedSquare);
        }
        switchTurns();
    }, 1000);
};

const runGame = () => {
    playerOneGameboard.placeShip([0, 0], [0, 4]);
    playerOneGameboard.placeShip([1, 5], [2, 5]);
    playerOneGameboard.placeShip([4, 7], [7, 7]);
    playerOneGameboard.placeShip([8, 1], [8, 3]);
    playerOneGameboard.placeShip([9, 5], [9, 7]);
    renderBoard(
        document.querySelector('#player-one-board'),
        playerOneGameboard.board,
        false
    );

    playerTwoGameboard.placeShip([4, 1], [4, 5]);
    playerTwoGameboard.placeShip([1, 8], [1, 9]);
    playerTwoGameboard.placeShip([4, 9], [7, 9]);
    playerTwoGameboard.placeShip([6, 4], [8, 4]);
    playerTwoGameboard.placeShip([6, 6], [8, 6]);
    renderBoard(
        document.querySelector('#player-two-board'),
        playerTwoGameboard.board,
        true,
        takeTurn
    );
};

export default runGame;
