/* eslint-disable no-new */
import Character from '../Character.js';
import Bowman from '../Characters/Bowman.js';

test('new Character(1) -> Error', () => {
  expect(() => {
    new Character(1);
  }).toThrowError('Dont use "new Character()"');
});

test('new Bowman(1) -> Ok', () => {
  const char = new Bowman(1);
  expect(char.level).toBe(1);
});
