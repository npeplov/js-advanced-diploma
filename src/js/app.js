/**
 * Entry point of app: don't change this
 */
import GamePlay from './GamePlay.js';
import GameController from './GameController.js';
import GameStateService from './GameStateService.js';
import GameState from './GameState.js';
// import PositionedCharacter from './PositionedCharacter.js';
// import Bowman from './Characters/Bowman.js';
// import Swordsman from './Characters/Swordsman.js';
// import Team from './Team.js';
// import { generateTeam } from './generators.js';

const gamePlay = new GamePlay();
gamePlay.bindToDOM(document.querySelector('#game-container'));

const stateService = new GameStateService(localStorage);

const gameCtrl = new GameController(gamePlay, stateService);
gameCtrl.init();

// don't write your code here
console.log(GameState.from(true));
// const player = new Team(generateTeam([Bowman, Swordsman], 1, 2));

// const plChar = new player.chars[0].Char(player.chars[0].lvl);
// for (const value of posChars) {
// }
