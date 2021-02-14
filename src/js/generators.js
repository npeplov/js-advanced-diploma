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
  if (level === 2) {
    let rndPos = Math.floor(Math.random() * (4 - 0 + 0) + 0);
    yield (rndPos * 8);
    rndPos = Math.floor(Math.random() * (7 - 3 + 0) + 4);
    yield (rndPos * 8);
    rndPos = Math.floor(Math.random() * (7 - 0 + 0) + 0);
    yield (rndPos * 8) + 1;
    // comp
    rndPos = Math.floor(Math.random() * (4 - 0 + 0) + 0);
    yield (rndPos * 8) + 6;
    rndPos = Math.floor(Math.random() * (7 - 3 + 0) + 4);
    yield (rndPos * 8) + 6;
    rndPos = Math.floor(Math.random() * (7 - 0 + 0) + 0);
    yield (rndPos * 8) + 7;
  }
}

export function* characterGenerator(allowedTypes, maxLevel) {
  const rndInd = Math.floor(Math.random() * allowedTypes.length);
  const rndLvl = Math.floor(Math.random() * maxLevel) + 1;
  yield { Char: allowedTypes[rndInd], lvl: rndLvl };
}

/**
 * Generates random characters
 *
 * @param allowedTypes list of classes
 * @param maxLevel max character level
 * @param characterCount number of chart to generate
  */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const chars = [];
  for (let i = 0; i < characterCount; i += 1) {
    chars.push(characterGenerator(allowedTypes, maxLevel).next().value);
  }
  return chars;
}
