import { describe, expect, test } from '@jest/globals';
import Ship from '../src/js/ship';

describe('ship properties and methods', () => {
    test('has correct length', () => {
        expect(new Ship(4)).toHaveProperty('length', 4);
        expect(new Ship(2)).toHaveProperty('length', 2);
    });
});
