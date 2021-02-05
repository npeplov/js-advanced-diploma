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

// test('Wounded after Damage ', () => {
//   const char = new Bowman('Indrgyh');
//   char.damage(50);
//   expect(char.health).toBe(62.5);
// });

// test('Dead after Damage ', () => {
//   const char = new Bowman('Indrgyh', 'Bowman', 25);
//   char.damage(40);
//   expect(char.health).toBe(0);
// });
