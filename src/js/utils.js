/* eslint-disable no-mixed-operators */
export function calcTileType(index, boardSize) {
  if (index === 0) return 'top-left';
  if (index === 7) return 'top-right';
  if (index === 56) return 'bottom-left';
  if (index === 63) return 'bottom-right';
  if (index > 0 && index < 7) return 'top';
  if ((index % boardSize) === 0) return 'left';
  if (((index - 7) % 8) === 0) return 'right';
  if (index > 56) return 'bottom';
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }
  if (health < 50) {
    return 'normal';
  }
  return 'high';
}

export function getTooltipTemplate(char) {
  return `🎖 ${char.level} ⚔ ${char.attack} 🛡 ${char.defense} ❤ ${char.health}`;
}

export function convertCoordinates(cell) {
  if (cell.x !== undefined) {
    return cell.y * 8 + cell.x;
  }
  return {
    x: cell % 8,
    y: (cell - (cell % 8)) / 8,
  };
}
