/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */

export function* positionGenerator(side) {
  const positions = [];

  const posGen = () => {
    let rndPos;
    do {
      rndPos = Math.floor(Math.random() * 7) * 8;
    } while (positions.includes(rndPos));
    positions.push(rndPos);
    return rndPos;
  };

  if (side === 'player') {
    while (true) {
      yield posGen();
      yield posGen() + 1;
    }
  } else {
    while (true) {
      yield posGen() + 7;
      yield posGen() + 6;
    }
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
