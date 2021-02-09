export function calcTileType(index, boardSize) {
  if (index === 0) return 'top-left';
  if (index === 7) return 'top-right';
  if (index === 56) return 'bottom-left';
  if (index === 63) return 'bottom-right';
  if (index > 0 && index < 7) return 'top';
  if ((index % boardSize) === 0) return 'left';
  if (((index - 7) % 8) === 0) return 'right';
  if (index > 54) return 'bottom';
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
