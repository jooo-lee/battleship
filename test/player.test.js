import { expect, test } from '@jest/globals';
import Player from '../src/js/player';

test('is either of type human or computer', () => {
    expect(() => {
        new Player('human');
    }).not.toThrow();
    expect(() => {
        new Player('computer');
    }).not.toThrow();
    expect(() => {
        new Player('bird');
    }).toThrow();
    expect(() => {
        new Player('barbell');
    }).toThrow();
});
