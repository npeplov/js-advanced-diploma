import { getTooltipTemplate } from '../utils.js';
import Bowman from '../Characters/Bowman.js';

test('message, index', () => {
  const bowman = new Bowman(1);
  expect(getTooltipTemplate(bowman))
    .toBe('🎖 1 ⚔ 25 🛡 25 ❤ 50');
});
