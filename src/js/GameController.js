/* eslint-disable no-param-reassign */
/* eslint-disable no-mixed-operators */
/* eslint-disable implicit-arrow-linebreak */
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

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState();
    this.current = undefined;
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
    this.onNewGameClick();
  }

  onNewGameClick() {
    this.gamePlay.drawUi(themes[1]);
    this.gameState.chars = [];
    this.gameState.level = 1;
    this.current = undefined;
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
  }

  onSaveGameClick() {
    this.stateService.save(this.gameState);
  }

  onLoadGameClick() {
    this.gameState.chars = [];
    const state = this.stateService.load();
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

  onCellClick(index) {
    const clickedCharInd = this.gameState.chars.findIndex((elem) => {
      const { position, character } = elem;
      return (this.playersChars.find((clas) => clas.name.toLowerCase() === character.type)
      && position === index);
    });
    if (clickedCharInd !== -1) {
      this.gamePlay.selectCell(index);

      if (this.current) this.gamePlay.deselectCell(this.current.cell);

      this.current = {
        type: this.gameState.chars[clickedCharInd].character.type,
        cell: index,
        charInd: clickedCharInd,
      };
    }

    const { charInd } = this.current;
    const { character } = this.gameState.chars[charInd];
    // *** 10.2 Проверка на допустимость передвижения и атаки
    const canGo = this.checkMovePossibility(index, character.rmove);
    const canAttack = this.checkAttackPossibility(index, character.rattack);

    if (canGo) {
      this.gameState.chars[charInd].position = index;
      this.current.cell = index;
      this.current = undefined;
      this.gamePlay.redrawPositions(this.gameState.chars);
      this.gamePlay.setCursor(cursors.auto);
    }

    if (canAttack) {
      const targetInd = this.gameState.chars.findIndex((elem) =>
        this.pcChars.find((clas) => clas.name.toLowerCase() === elem.character.type
        && elem.position === index));

      const attacker = {
        attack: this.gameState.chars[this.current.charInd].character.attack,
      };
      const target = {
        defense: this.gameState.chars[targetInd].character.defense,
      };
      const damage = Math.max(attacker.attack - target.defense, attacker.attack * 2);
      this.gameState.chars[targetInd].character.health -= damage;

      const respose = this.gamePlay.showDamage(index, damage);
      respose.then(() => {
        this.current = undefined;
        if (this.gameState.chars[targetInd].character.health <= 0) {
          this.gameState.chars.splice(targetInd, 1);
        }
        this.checkForLevelUp();
        this.gamePlay.redrawPositions(this.gameState.chars);
      });
    }
  }

  onCellEnter(index) {
    const mOverCharInd = this.gameState.chars.findIndex((elem) => elem.position === index);

    const mOverPlCharInd = this.gameState.chars.findIndex((elem) => {
      const { position, character } = elem;
      return (this.playersChars.find((clas) => clas.name.toLowerCase() === character.type)
      && position === index);
    });

    if (mOverCharInd !== -1) {
      const element = this.gameState.chars[mOverCharInd].character;
      this.gamePlay.showCellTooltip(`
      🎖 ${element.level} ⚔${element.attack} 🛡 ${element.defense} ❤ ${element.health}
      `, index);
    }

    if (!this.current) return;

    const { charInd } = this.current;
    const { character } = this.gameState.chars[charInd];
    // *** 10.2 Проверка на допустимость передвижения и атаки
    const canGo = this.checkMovePossibility(index, character.rmove);
    const canAttack = this.checkAttackPossibility(index, character.rattack);
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
    if (mOverPlCharInd !== -1) { this.gamePlay.setCursor(cursors.auto); return; }
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

  checkMovePossibility(index, range) {
    const clickOnPlayersChar = this.gameState.chars.findIndex((elem) => {
      const { position, character } = elem;
      return (this.playersChars.find((clas) => clas.name.toLowerCase() === character.type)
      && position === index);
    });
    if (clickOnPlayersChar !== -1) return false;

    const clickOnPcChar = this.gameState.chars.findIndex((elem) => {
      const { position, character } = elem;
      return (this.pcChars.find((clas) => clas.name.toLowerCase() === character.type)
      && position === index);
    });
    if (clickOnPcChar !== -1) return false;

    const target = {
      x: index % 8,
      y: (index - (index % 8)) / 8,
    };
    const selected = {
      x: this.current.cell % 8,
      y: (this.current.cell - (this.current.cell % 8)) / 8,
    };

    const difx = Math.abs(target.x - selected.x);
    const dify = Math.abs(target.y - selected.y);

    if ((difx <= range) && (target.y === selected.y)
    || (dify <= range) && (target.x === selected.x)
    || (difx === dify) && (difx <= range)) {
      return true;
    }
    return false;
  }

  checkAttackPossibility(index, range) {
    const clickOnPcChar = this.gameState.chars.findIndex((elem) => {
      const { position, character } = elem;
      return (this.pcChars.find((clas) => clas.name.toLowerCase() === character.type)
      && position === index);
    });
    if (clickOnPcChar === -1) return false;

    const target = {
      x: index % 8,
      y: (index - (index % 8)) / 8,
    };
    const selected = {
      x: this.current.cell % 8,
      y: (this.current.cell - (this.current.cell % 8)) / 8,
    };

    const difx = Math.abs(target.x - selected.x);
    const dify = Math.abs(target.y - selected.y);

    if ((difx <= range)
    || (dify <= range)) {
      return true;
    }
    return false;
  }

  checkForLevelUp() {
    if (this.gameState.chars.length === 2) {
      this.levelup(2);
    }
    if (this.gameState.level === 2
      && this.gameState.chars.length === 3) {
      this.levelup(3);
    }
    if (this.gameState.level === 3
      && this.gameState.chars.length === 4) {
      this.levelup(4);
    }
  }

  levelup(lvl) {
    this.gamePlay.drawUi(themes[lvl]);
    this.gameState.level = lvl;
    this.current = undefined;

    const posPl = positionGenerator('player');
    const posPc = positionGenerator('computer');

    this.gameState.score = this.gameState.chars
      .reduce((acc, elem) => acc + elem.character.health, this.gameState.score);

    this.gameState.chars.forEach((elem) => {
      elem.character.levelup();
      elem.position = posPl.next().value;
    });

    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      this.gamePlay.deselectCell(i);
    }
    const player = generateTeam(this.playersChars, lvl, 1);
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
    console.log(`Level ${this.gameState.level} reached`);
  }
}
