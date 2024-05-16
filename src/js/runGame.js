import { renderBoard } from './dom';
import Player from './player';

const runGame = () => {
    const playerOne = new Player('human');
    const playerOneBoard = playerOne.gameboard;
    playerOneBoard.placeShip([0, 0], [0, 4]);
    playerOneBoard.placeShip([1, 5], [2, 5]);
    playerOneBoard.placeShip([4, 7], [7, 7]);
    playerOneBoard.placeShip([8, 1], [8, 3]);
    playerOneBoard.placeShip([9, 5], [9, 7]);
    renderBoard(
        document.querySelector('#player-one-board'),
        playerOneBoard.board,
        true
    );

    const playerTwo = new Player('computer');
    const playerTwoBoard = playerTwo.gameboard;
    playerTwoBoard.placeShip([4, 1], [4, 5]);
    playerTwoBoard.placeShip([1, 8], [1, 9]);
    playerTwoBoard.placeShip([4, 9], [7, 9]);
    playerTwoBoard.placeShip([6, 4], [8, 4]);
    playerTwoBoard.placeShip([6, 6], [8, 6]);
    renderBoard(
        document.querySelector('#player-two-board'),
        playerTwoBoard.board,
        true
    );
};

export default runGame;
