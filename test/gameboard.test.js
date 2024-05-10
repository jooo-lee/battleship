import { describe, expect, test } from '@jest/globals';
import Gameboard from '../src/js/gameboard';
import Ship from '../src/js/ship';

describe('gameboard class', () => {
    test('places ship horizontally', () => {
        const gameboard = new Gameboard();
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
});
