import { describe, expect, test } from '@jest/globals';
import Ship from '../src/js/ship';

describe('ship properties and methods', () => {
    test('has correct length', () => {
        expect(new Ship(4)).toHaveProperty('length', 4);
        expect(new Ship(2)).toHaveProperty('length', 2);
    });

    test('keeps track of number of times hit', () => {
        const ship = new Ship(4);
        expect(ship).toHaveProperty('hits', 0);

        ship.hit();
        expect(ship).toHaveProperty('hits', 1);

        ship.hit();
        ship.hit();
        expect(ship).toHaveProperty('hits', 3);
    });
});
