import GameController from '../GameController.js';
import Daemon from '../Characters/Daemon.js';
import Bowman from '../Characters/Bowman.js';

const gameCtrl = new GameController();

gameCtrl.gameState.from({ character: new Bowman(1), position: 0 });
gameCtrl.current = {
  type: gameCtrl.gameState.chars[0].character.type,
  cell: 0,
  charInd: 0,
};

test('true, Bowman, move, from cell 0 -> 2', () => {
  expect(gameCtrl.checkTurnPossibility(2, 2, 'move'))
    .toBe(true);
});

test('false, Bowman, move, from cell 0 -> 3', () => {
  expect(gameCtrl.checkTurnPossibility(3, 2, 'move'))
    .toBe(false);
});

test('false, Bowman, attacks cell 2, Empty', () => {
  expect(gameCtrl.checkTurnPossibility(2, 2, 'attack'))
    .toBe(false);
});

test('true, Bowman, attacks cell 10, with Daemon', () => {
  gameCtrl.gameState.from({ character: new Daemon(1), position: 10 });
  expect(gameCtrl.checkTurnPossibility(10, 2, 'attack'))
    .toBe(true);
});

test('2, Select another player\'s char', () => {
  gameCtrl.gameState.from({ character: new Bowman(1), position: 5 });
  const mOverPlCharInd = gameCtrl.getCharIndex(5, gameCtrl.playersChars);
  expect(mOverPlCharInd)
    .toBe(2);
});
