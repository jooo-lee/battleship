import { describe, expect, test, beforeEach } from '@jest/globals';
import Gameboard from '../src/js/gameboard';
import Ship from '../src/js/ship';

describe('gameboard class', () => {
    let gameboard;
    beforeEach(() => {
        gameboard = new Gameboard();
    });

    test('placeShip creates ship of correct length', () => {
        gameboard.placeShip([1, 1], [1, 4]);
        gameboard.placeShip([6, 3], [4, 3]);
        gameboard.placeShip([0, 0], [0, 1]);
        const board = gameboard.board;
        expect(board[1][1].length).toBe(4);
        expect(board[6][3].length).toBe(3);
        expect(board[0][0].length).toBe(2);
    });

    test('places ship horizontally left to right', () => {
        const row1 = 2;
        const col1 = 3;
        const row2 = 2;
        const col2 = 5;
        gameboard.placeShip([row1, col1], [row2, col2]);
        const board = gameboard.board;

        // Assert that ship is only placed at its respective coordinates
        expect(board[row1][col1]).toBeInstanceOf(Ship);
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                if (i === row1 && col1 <= j && j <= col2) {
                    expect(board[row1][col1]).toBe(board[i][j]);
                } else {
                    expect(board[row1][col1]).not.toBe(board[i][j]);
                }
            }
        }
    });

    test('places ship horizontally right to left', () => {
        const row1 = 8;
        const col1 = 9;
        const row2 = 8;
        const col2 = 7;
        gameboard.placeShip([row1, col1], [row2, col2]);
        const board = gameboard.board;

        // Assert that ship is only placed at its respective coordinates
        expect(board[row1][col1]).toBeInstanceOf(Ship);
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                if (i === row1 && col2 <= j && j <= col1) {
                    expect(board[row1][col1]).toBe(board[i][j]);
                } else {
                    expect(board[row1][col1]).not.toBe(board[i][j]);
                }
            }
        }
    });

    test('places ship vertically top to bottom', () => {
        const row1 = 4;
        const col1 = 5;
        const row2 = 8;
        const col2 = 5;
        gameboard.placeShip([row1, col1], [row2, col2]);
        const board = gameboard.board;

        // Assert that ship is only placed at its respective coordinates
        expect(board[row1][col1]).toBeInstanceOf(Ship);
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                if (j === col1 && row1 <= i && i <= row2) {
                    expect(board[row1][col1]).toBe(board[i][j]);
                } else {
                    expect(board[row1][col1]).not.toBe(board[i][j]);
                }
            }
        }
    });

    test('places ship vertically bottom to top', () => {
        const row1 = 4;
        const col1 = 9;
        const row2 = 1;
        const col2 = 9;
        gameboard.placeShip([row1, col1], [row2, col2]);
        const board = gameboard.board;

        // Assert that ship is only placed at its respective coordinates
        expect(board[row1][col1]).toBeInstanceOf(Ship);
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                if (j === col1 && row2 <= i && i <= row1) {
                    expect(board[row1][col1]).toBe(board[i][j]);
                } else {
                    expect(board[row1][col1]).not.toBe(board[i][j]);
                }
            }
        }
    });

    test('throws if ship placed diagonally', () => {
        expect(() => {
            gameboard.placeShip([4, 4], [6, 6]);
        }).toThrow();
    });

    test('does not place ship off the board', () => {
        const oldBoard = gameboard.board;
        gameboard.placeShip([-1, 1], [2, 1]);
        gameboard.placeShip([0, -3], [0, 1]);
        gameboard.placeShip([9, 9], [11, 9]);
        gameboard.placeShip([2, 8], [2, 10]);
        const newBoard = gameboard.board;
        expect(oldBoard).toEqual(newBoard);
    });

    test('does not place ship on occupied coordinates', () => {
        gameboard.placeShip([1, 1], [1, 4]);
        const oldBoard = gameboard.board;

        // Attempt to place ship on occupied coordinates
        gameboard.placeShip([0, 1], [2, 1]);

        const newBoard = gameboard.board;
        expect(oldBoard).toEqual(newBoard);
    });

    test('correct ship is hit when receiving attack', () => {
        gameboard.placeShip([2, 3], [2, 5]);
        gameboard.placeShip([0, 1], [2, 1]);
        const board = gameboard.board;

        const shipToBeHit = board[2][3];
        expect(shipToBeHit.hits).toBe(0);
        gameboard.receiveAttack([2, 3]);
        gameboard.receiveAttack([2, 4]);
        expect(shipToBeHit.hits).toBe(2);

        const shipToNotBeHit = board[0][1];
        expect(shipToNotBeHit.hits).toBe(0);
    });

    test('records coordinates of missed shot when receiving attack', () => {
        const expectedMisses = [
            [1, 7],
            [9, 4],
            [4, 3],
        ];
        expectedMisses.forEach((shot) => gameboard.receiveAttack(shot));
        expect(gameboard.misses).toEqual(expectedMisses);
    });

    test('reports whether or not all of its ships have been sunk', () => {
        gameboard.placeShip([1, 1], [1, 2]);
        gameboard.placeShip([3, 3], [3, 4]);
        expect(gameboard.allShipsSunk).toBe(false);

        gameboard.receiveAttack([1, 1]);
        gameboard.receiveAttack([1, 2]);
        expect(gameboard.allShipsSunk).toBe(false);

        gameboard.receiveAttack([3, 3]);
        gameboard.receiveAttack([3, 4]);
        expect(gameboard.allShipsSunk).toBe(true);
    });

    test('throws if receiving attack off the board', () => {
        expect(() => {
            gameboard.receiveAttack([-1, -1]);
        }).toThrow();
        expect(() => {
            gameboard.receiveAttack([10, 4]);
        }).toThrow();
    });

    test('prevents hit at same spot more than once', () => {
        gameboard.placeShip([1, 1], [1, 2]);
        gameboard.receiveAttack([1, 1]);
        gameboard.receiveAttack([1, 1]);
        const board = gameboard.board;
        const ship = board[1][1];
        expect(ship.hits).toBe(1);
    });
});
