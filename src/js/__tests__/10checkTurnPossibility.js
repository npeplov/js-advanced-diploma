import GameController from '../GameController.js';
import Daemon from '../Characters/Daemon.js';
import Bowman from '../Characters/Bowman.js';

const gameCtrl = new GameController();

gameCtrl.gameState.from({ character: new Bowman(1), position: 0 });
const start = gameCtrl.gameState.chars[0].position;
let finish;

test('true, Bowman, move, from cell 0 -> 2', () => {
  finish = 2;
  expect(gameCtrl.checkTurnPossibility(start, finish, 2, 'move'))
    .toBe(true);
});

test('false, Bowman, move, from cell 0 -> 3', () => {
  finish = 3;
  expect(gameCtrl.checkTurnPossibility(start, finish, 2, 'move'))
    .toBe(false);
});

test('false, Bowman, attacks cell 2, Empty', () => {
  finish = 2;
  expect(gameCtrl.checkTurnPossibility(start, finish, 2, 'attack'))
    .toBe(false);
});

test('true, Bowman, attacks cell 10, with Daemon', () => {
  gameCtrl.gameState.from({ character: new Daemon(1), position: 10 });
  finish = gameCtrl.gameState.chars[1].position;
  expect(gameCtrl.checkTurnPossibility(start, finish, 2, 'attack'))
    .toBe(true);
});

test('2, Select another player\'s char', () => {
  gameCtrl.gameState.from({ character: new Bowman(1), position: 5 });
  finish = gameCtrl.gameState.chars[2].position;
  const mOverPlCharInd = gameCtrl.getCharIndex(finish, gameCtrl.playersChars);
  expect(mOverPlCharInd)
    .toBe(2);
});
