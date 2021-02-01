/**
 * Entry point of app: don't change this
 */
import GamePlay from './GamePlay.js';
import GameController from './GameController.js';
import GameStateService from './GameStateService.js';
import PositionedCharacter from './PositionedCharacter.js';
import Bowman from './Characters/Bowman.js';
import Swordsman from './Characters/Swordsman.js';

import { generateTeam, positionGenerator } from './generators.js';

const gamePlay = new GamePlay();
gamePlay.bindToDOM(document.querySelector('#game-container'));

const stateService = new GameStateService(localStorage);

const gameCtrl = new GameController(gamePlay, stateService);
gameCtrl.init();

// don't write your code here
// const team = generateTeam([Bowman, Swordsman], 2, 3);
// const posChars = [];
// for (let i = 0; i < team.length; i += 1) {
//   const posChar = new PositionedCharacter(new team[i].Char(team[i].lvl), i);
//   posChars.push(posChar);
// }
const posChars = positionGenerator(true, 1);

for (const value of posChars) {
  console.log(value);
}
