import { describe, expect, test } from '@jest/globals';
import Ship from '../src/js/ship';

describe('ship class', () => {
    test('has correct length', () => {
        expect(new Ship(4)).toHaveProperty('length', 4);
        expect(new Ship(2)).toHaveProperty('length', 2);
    });

    test('keeps track of number of times hit', () => {
        const ship = new Ship(4);
        expect(ship).toHaveProperty('hits', 0);

        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship).toHaveProperty('hits', 3);

        ship.hit();
        expect(ship).toHaveProperty('hits', 4);
    });

    test('caps number of hits at ship length', () => {
        const ship = new Ship(3);
        ship.hit();
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship).toHaveProperty('hits', 3);
    });

    test('is sunk if number of hits equals ship length', () => {
        const ship = new Ship(2);
        expect(ship.isSunk()).toBe(false);
        ship.hit();
        expect(ship.isSunk()).toBe(false);
        ship.hit();
        expect(ship.isSunk()).toBe(true);
    });
});
