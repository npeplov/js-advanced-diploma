/* eslint-disable no-trailing-spaces */
/* eslint-disable implicit-arrow-linebreak */
import themes from './themes.js';
import cursors from './cursors.js';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellClickListener(this.onCellClick);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);
    this.gamePlay.onNewGameClick();

    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // 9. Выбор персонажа
    // проверка - был ли клик по чару игрока. если да - запомнить его индекс в gameState
    const clickedCharInd = this.gameState.chars.findIndex((elem) => {
      const { position, character } = elem;
      return (this.playersChars.includes(character.type) && position === index);
    });

    if (clickedCharInd !== -1) {
      this.selectCell(index);

      if (this.current) this.deselectCell(this.current.cell);

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
      this.redrawPositions(this.gameState.chars);
      this.setCursor(cursors.auto);
    }

    if (canAttack) {
      const targetInd = this.gameState.chars.findIndex((elem) =>
        this.pcChars.includes(elem.character.type) && elem.position === index);

      const attacker = {
        attack: this.gameState.chars[this.current.charInd].character.attack,
      };
      const target = {
        defense: this.gameState.chars[targetInd].character.defense,
      };
      const damage = Math.max(attacker.attack - target.defense, attacker.attack * 2);
      this.gameState.chars[targetInd].character.health -= damage;

      const respose = this.showDamage(index, damage);
      respose.then(() => {
        this.current = undefined;
        if (this.gameState.chars[targetInd].character.health <= 0) {
          this.gameState.chars.splice(targetInd, 1);
        }

        if (this.gameState.level === 1
          && this.gameState.chars.length === 2) {
          this.levelup(2);
        }

        if (this.gameState.level === 2
          && this.gameState.chars.length === 3) {
          this.levelup(3);
        }

        if (this.gameState.level === 3
          && this.gameState.chars.length === 5) {
          this.levelup(4);
        }
        // 1. чары расставляются на местах как на старте
        // 2. добавить 1 чара игрока 1 лвл и 3 для компа 1-2 лвл:
        // 2.1 generate дописать yield, генератор глобольным
        // чтобы был контекст gameCtrl - вызвать из GamePlay.js после onClick
        // 4. прибавить очки баллы игроку
        this.redrawPositions(this.gameState.chars);
      });
    }
    // }
  }

  onCellEnter(index) {
    // 8. Вывод информации о персонаже 🎖1 ⚔10 🛡40 ❤50
    const mOverCharInd = this.gameState.chars.findIndex((elem) => elem.position === index);
    const mOverPlCharInd = this.gameState.chars.findIndex((elem) => 
      (elem.position === index && this.playersChars.includes(elem.character.type)));

    if (mOverCharInd !== -1) {
      const element = this.gameState.chars[mOverCharInd].character;
      this.showCellTooltip(`
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
      this.setCursor(cursors.pointer);
      this.selectCell(index, 'green');
    }

    // 10.3 Проверка на допустимость атаки
    if (canAttack) {
      this.setCursor(cursors.crosshair);
      this.selectCell(index, 'red');
    }

    // 10.4 Проверка на недопустимое действие
    if (mOverPlCharInd !== -1) { this.setCursor(cursors.auto); return; }
    if (!canAttack && !canGo) this.setCursor(cursors.notallowed);
  }

  onCellLeave(index) {
    if (!this.current) return;
    this.setCursor(cursors.auto);

    // Если убрали курсор не с чара, то удалить зеленую обводку с клетки
    if (index !== this.current.cell) {
      this.deselectCell(index);
    }
  }
}
