import GameStateService from '../GameStateService.js';
import GamePlay from '../GamePlay.js';

jest.mock('../GameStateService');
const stateService = new GameStateService();

test('Load ok', () => {
  expect(stateService.load())
    .toBe(undefined);
});

test('Load fail, GamePlay.showError()', () => {
  stateService.load = () => GamePlay.showError('Error in load');
  expect(stateService.load())
    .toBe('Error in load');
});
