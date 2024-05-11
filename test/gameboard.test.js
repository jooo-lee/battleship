import { describe, expect, test, beforeEach } from '@jest/globals';
import Gameboard from '../src/js/gameboard';
import Ship from '../src/js/ship';

describe('gameboard class', () => {
    let gameboard;
    beforeEach(() => {
        gameboard = new Gameboard();
    });

    test('places ship horizontally left to right', () => {
        const row1 = 2;
        const col1 = 3;
        const row2 = 2;
        const col2 = 5;
        gameboard.placeShip([row1, col1], [row2, col2]);
        const board = gameboard.getBoard();

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
        const board = gameboard.getBoard();

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
        const board = gameboard.getBoard();

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
        const board = gameboard.getBoard();

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

    test('throws if ship not placed horizontally or vertically', () => {
        const oldBoard = gameboard.getBoard();
        const row1 = 4;
        const col1 = 4;
        const row2 = 6;
        const col2 = 6;

        expect(() => {
            gameboard.placeShip([row1, col1], [row2, col2]);
        }).toThrow();

        // Assert that new ship is not placed and board is not changed
        const newBoard = gameboard.getBoard();
        expect(oldBoard).toEqual(newBoard);
    });
});
