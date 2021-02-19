/* eslint-disable no-param-reassign */
/* eslint-disable no-mixed-operators */
import Bowman from './Characters/Bowman.js';
import Swordsman from './Characters/Swordsman.js';
import Daemon from './Characters/Daemon.js';
import Magician from './Characters/Magician.js';
import Vampire from './Characters/Vampire.js';
import Undead from './Characters/Undead.js';
import { generateTeam, positionGenerator } from './generators.js';
import PositionedCharacter from './PositionedCharacter.js';
import themes from './themes.js';
import Team from './Team.js';
import GameState from './GameState.js';
import cursors from './cursors.js';
import { getTooltipTemplate } from './utils.js';
import GamePlay from './GamePlay.js';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState();
    this.current = null;
    this.playersChars = [Bowman, Swordsman, Magician];
    this.pcChars = [Daemon, Undead, Vampire];
  }

  init() {
    this.gamePlay.drawUi(themes[1]);
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));
    const state = this.stateService.load();
    if (state) this.gameState.record = state.record;
  }

  onNewGameClick() {
    this.resetToDefault();
    this.init();

    const posPl = positionGenerator('player');
    const posPc = positionGenerator('computer');

    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      this.deselectCell(i);
    }

    const player = new Team(generateTeam([Bowman, Swordsman], 1, 2));
    const comp = new Team(generateTeam([Daemon, Vampire, Undead], 1, 2));

    for (let i = 0; i < player.chars.length; i += 1) {
      const plChar = new player.chars[i].Char(player.chars[i].lvl);
      const posChar = new PositionedCharacter(plChar, posPl.next().value);
      this.gameState.from(posChar);
    }

    for (let i = 0; i < comp.chars.length; i += 1) {
      const cmpChar = new comp.chars[i].Char(comp.chars[i].lvl);
      const posChar = new PositionedCharacter(cmpChar, posPc.next().value);
      this.gameState.from(posChar);
    }
    this.gamePlay.redrawPositions(this.gameState.chars);
    const state = this.stateService.load();
    if (!state) this.stateService.save(this.gameState);
  }

  onSaveGameClick() {
    this.stateService.save(this.gameState);
  }

  onLoadGameClick() {
    const state = this.stateService.load();
    if (!state.chars) return;

    this.gameState.chars = [];
    this.gameState.level = state.level;
    this.gameState.score = state.score;

    state.chars.forEach((elem) => {
      const { type, level } = elem.character;
      const { position } = elem;
      const Charclass = [...this.playersChars, ...this.pcChars]
        .find((clas) => clas.name.toLowerCase() === type);
      this.gameState.from({ character: new Charclass(level), position });
    });
    this.gamePlay.drawUi(themes[state.level]);
    this.gamePlay.redrawPositions(this.gameState.chars);
  }

  getCharIndex(cell, arr) {
    return this.gameState.chars.findIndex((elem) => {
      const { position, character } = elem;
      return (arr.find((clas) => clas.name.toLowerCase() === character.type)
      && position === cell);
    });
  }

  async onCellClick(index) {
    const clickedCharInd = this.getCharIndex(index, this.playersChars);
    if (clickedCharInd !== -1) {
      this.gamePlay.selectCell(index);
      if (this.current) this.gamePlay.deselectCell(this.current.cell);
      this.current = {
        type: this.gameState.chars[clickedCharInd].character.type,
        cell: index,
        charInd: clickedCharInd,
      };
    }

    if (!this.current) return;

    const { charInd } = this.current;
    const { character } = this.gameState.chars[charInd];
    // *** 10.2 Проверка на допустимость передвижения и атаки
    const canGo = this.checkTurnPossibility(index, character.rmove, 'move');
    const canAttack = this.checkTurnPossibility(index, character.rattack, 'attack');

    if (canGo) {
      this.gameState.chars[charInd].position = index;
      this.current.cell = index;
      this.current = null;
      this.gamePlay.redrawPositions(this.gameState.chars);
      this.gamePlay.setCursor(cursors.auto);
    }

    if (canAttack) {
      let targetInd = this.getCharIndex(index, this.pcChars);
      const attacker = { attack: this.gameState.chars[charInd].character.attack };
      const target = { defense: this.gameState.chars[targetInd].character.defense };
      const damage = Math.max(attacker.attack - target.defense, attacker.attack * 0.1);
      this.gameState.chars[targetInd].character.health -= damage;

      await this.gamePlay.showDamage(index, damage);
      if (this.gameState.chars[targetInd].character.health <= 0) {
        this.gameState.chars.splice(targetInd, 1);
        targetInd = null;
      }
      this.gamePlay.redrawPositions(this.gameState.chars);
      this.ai(targetInd, index, this.current.cell, charInd);
      this.current = null;
      this.checkForLevelUp();
    }
  }

  onCellEnter(index) {
    const mOverCharInd = this.gameState.chars.findIndex((elem) => elem.position === index);
    const mOverPlCharInd = this.getCharIndex(index, this.playersChars);

    if (mOverCharInd !== -1) {
      const char = this.gameState.chars[mOverCharInd].character;
      this.gamePlay.showCellTooltip(getTooltipTemplate(char), index);
    }

    if (!this.current) return;

    const { charInd } = this.current;
    const { character } = this.gameState.chars[charInd];
    // *** 10.2 Проверка на допустимость передвижения и атаки
    const canGo = this.checkTurnPossibility(index, character.rmove, 'move');
    const canAttack = this.checkTurnPossibility(index, character.rattack, 'attack');
    if (canGo) {
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.selectCell(index, 'green');
    }
    // 10.3 Проверка на допустимость атаки
    if (canAttack) {
      this.gamePlay.setCursor(cursors.crosshair);
      this.gamePlay.selectCell(index, 'red');
    }
    // 10.4 Проверка на недопустимое действие
    if (mOverPlCharInd !== -1) { this.gamePlay.setCursor(cursors.pointer); return; }

    if (!canAttack && !canGo) this.gamePlay.setCursor(cursors.notallowed);
  }

  onCellLeave(index) {
    if (!this.current) return;
    this.gamePlay.setCursor(cursors.auto);

    // Если убрали курсор не с чара, то удалить зеленую обводку с клетки
    if (index !== this.current.cell) {
      this.gamePlay.deselectCell(index);
    }
  }

  convertCoordinates(index) {
    if (!index) {
      return {
        x: this.current.cell % 8,
        y: (this.current.cell - (this.current.cell % 8)) / 8,
      };
    }
    return {
      x: index % 8,
      y: (index - (index % 8)) / 8,
    };
  }

  checkTurnPossibility(index, range, action, ai = 0) {
    const target = this.convertCoordinates(index);
    const selected = this.convertCoordinates();
    const difx = Math.abs(target.x - selected.x);
    const dify = Math.abs(target.y - selected.y);

    if (action === 'attack') {
      const clickOnPcChar = this.getCharIndex(index, this.pcChars);
      if ((clickOnPcChar + ai) === -1) return false;

      if ((difx <= range) && (dify <= range)) {
        return true;
      }
    } else if (action === 'move') {
      const clickOnChar = this.getCharIndex(index, [...this.playersChars, ...this.pcChars]);
      if (clickOnChar !== -1) return false;

      if ((difx <= range) && (target.y === selected.y)
      || (dify <= range) && (target.x === selected.x)
      || (difx === dify) && (difx <= range)) {
        return true;
      }
    }
    return false;
  }

  ai(charInd, cell, attackedCell, targetInd) {
    if (!charInd) { return; }
    const { character } = this.gameState.chars[charInd];
    const canAttack = this.checkTurnPossibility(attackedCell, character.rattack, 'attack', 1);
    if (canAttack) {
      const attacker = { attack: this.gameState.chars[charInd].character.attack };
      const target = { defense: this.gameState.chars[targetInd].character.defense };
      const damage = Math.max(attacker.attack - target.defense, attacker.attack * 0.1);
      this.gameState.chars[targetInd].character.health -= damage;

      const respose = this.gamePlay.showDamage(attackedCell, damage);
      respose.then(() => {
        if (this.gameState.chars[targetInd].character.health <= 0) {
          this.gameState.chars.splice(targetInd, 1);
        }
        this.gamePlay.redrawPositions(this.gameState.chars);
        this.checkForLevelUp();
      });
    }
  }

  checkForLevelUp() {
    const pcCharsOnBoard = this.gameState.chars.some((elem) => {
      const { character } = elem;
      return (this.pcChars.find((clas) => clas.name.toLowerCase() === character.type));
    });

    const playersCharsOnBoard = this.gameState.chars.some((elem) => {
      const { character } = elem;
      return (this.playersChars.find((clas) => clas.name.toLowerCase() === character.type));
    });

    if (!playersCharsOnBoard) {
      GamePlay.showMessage('You loose');
    }

    if (!pcCharsOnBoard) {
      this.gameState.level += 1;
      this.levelup(this.gameState.level);
    }
    this.checkForRecord();
  }

  levelup(lvl) {
    this.gameState.score = this.gameState.chars
      .reduce((acc, elem) => acc + elem.character.health, this.gameState.score);
    if (lvl > 4) { GamePlay.showMessage('You win!'); return; }

    // если уровень 2: у игрока должно стать 3 чара
    // нужно сосчитать сколько чаров осталось
    // можно все 6 запустить лвлап

    this.gamePlay.drawUi(themes[lvl]);
    this.checkForRecord();
    this.current = null;

    const posPl = positionGenerator('player');
    const posPc = positionGenerator('computer');

    this.gameState.chars.forEach((elem) => {
      elem.character.levelup();
      elem.position = posPl.next().value;
    });

    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      this.gamePlay.deselectCell(i);
    }
    const numberOfCharsToAdd = lvl - this.gameState.chars.length + 1;
    const player = generateTeam(this.playersChars, lvl, numberOfCharsToAdd);
    const comp = generateTeam(this.pcChars, lvl, lvl + 1);

    for (let i = 0; i < comp.length; i += 1) {
      const cmpChar = new comp[i].Char(comp[i].lvl);
      const posChar = new PositionedCharacter(cmpChar, posPc.next().value);
      this.gameState.from(posChar);
    }
    for (let i = 0; i < player.length; i += 1) {
      const plChar = new player[i].Char(player[i].lvl);
      const posChar = new PositionedCharacter(plChar, posPl.next().value);
      this.gameState.from(posChar);
    }
    this.gamePlay.redrawPositions(this.gameState.chars);
  }

  checkForRecord() {
    const state = this.stateService.load();

    if (this.gameState.score > this.gameState.record) {
      this.gameState.record = this.gameState.score;
      state.record = this.gameState.record;
      this.stateService.save(state);
    }
  }

  resetToDefault() {
    this.gamePlay.cellClickListeners = [];
    this.gamePlay.cellEnterListeners = [];
    this.gamePlay.cellLeaveListeners = [];
    this.gamePlay.newGameListeners = [];
    this.gamePlay.saveGameListeners = [];
    this.gamePlay.loadGameListeners = [];
    this.gameState.chars = [];
    this.gameState.level = 1;
    this.current = null;
  }
}
