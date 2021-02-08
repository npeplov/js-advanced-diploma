/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */

export function* positionGenerator(level) {
  if (level === 1) {
    let rndPos = Math.floor(Math.random() * (56 - 0 + 1) + 1);
    yield (rndPos % 8) * 8;
    rndPos = Math.floor(Math.random() * (56 - 0 + 1) + 1);
    yield (rndPos % 8) * 8 + 1;
    rndPos = Math.floor(Math.random() * (56 - 0 + 1) + 1);
    yield (rndPos % 8) * 8 + 7;
    rndPos = Math.floor(Math.random() * (56 - 0 + 1) + 1);
    yield (rndPos % 8) * 8 + 6;
  }
}

export function* characterGenerator(allowedTypes, maxLevel) {
  const rndInd = Math.floor(Math.random() * allowedTypes.length);
  const rndLvl = Math.floor(Math.random() * maxLevel) + 1;
  yield { Char: allowedTypes[rndInd], lvl: rndLvl };
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const chars = [];
  for (let i = 0; i < characterCount; i += 1) {
    chars.push(characterGenerator(allowedTypes, maxLevel).next().value);
  }
  return chars;
}
