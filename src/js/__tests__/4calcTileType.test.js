import { calcTileType } from '../utils.js';

test('0 (index === 0) return top-left', () => {
  expect(calcTileType(0)).toBe('top-left');
});
test('7 (index === 7) return top-right', () => {
  expect(calcTileType(7)).toBe('top-right');
});
test('56 (index === 56) return bottom-left', () => {
  expect(calcTileType(56)).toBe('bottom-left');
});
test('63 (index === 63) return bottom-right', () => {
  expect(calcTileType(63)).toBe('bottom-right');
});

test('1 - (index > 0 && index < 7) return top', () => {
  expect(calcTileType(1)).toBe('top');
});
test('6 - (index > 0 && index < 7) return top', () => {
  expect(calcTileType(6)).toBe('top');
});

test('48 ((index % boardSize) === 0) return left', () => {
  expect(calcTileType(48, 8)).toBe('left');
});
test('15 ((index - 7) % 8) === 0) return right', () => {
  expect(calcTileType(15)).toBe('right');
});
test('57 (index > 56) return bottom', () => {
  expect(calcTileType(57)).toBe('bottom');
});
test('10 other cases', () => {
  expect(calcTileType(10)).toBe('center');
});
