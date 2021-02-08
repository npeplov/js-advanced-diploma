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

    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    this.positionedCharsArr.forEach((element) => {
      if (['swordsman', 'bowman', 'magician'].includes(element.character.type)
      && element.position === index) {
        this.selectCell(index);
        if (this.current) this.deselectCell(this.current.cell);
        this.current = { type: element.character.type, cell: index };
      }
    });
  }

  onCellEnter(index) {
    // 8. Вывод информации о персонаже 🎖1 ⚔10 🛡40 ❤50

    this.positionedCharsArr.forEach((element) => {
      if (element.position === index) {
        this.showCellTooltip(`
        🎖 ${element.character.level} ⚔${element.character.attack} 🛡 ${element.character.defense} ❤ ${element.character.health}
        `, index);
        if (this.current) {
          this.cells[index].style.cursor = cursors.pointer;
        }
      }
    });

    if (!this.current) return;

    // 10.2 Проверка на допустимость передвижения

    if (this.current.type === 'bowman') {
      const canGo = this.checkMovePossibility(index, 2);
      if (canGo) {
        this.cells[index].style.cursor = cursors.pointer;
        this.selectCell(index, 'green');
      }

      // 10.3 Проверка на допустимость атаки
      const canAttack = this.checkAttackPossibility(index, 5);
      if (canAttack) {
        this.cells[index].style.cursor = cursors.crosshair;
        this.selectCell(index, 'red');
      }
    }

    if (this.current.type === 'swordsman') {
      const canGo = this.checkMovePossibility(index, 4);
      if (canGo) {
        this.cells[index].style.cursor = cursors.pointer;
        this.selectCell(index, 'green');
      }
    }
  }

  onCellLeave(index) {
    if (!this.current) return;
    this.cells[index].style.cursor = cursors.auto;

    // Если убрали курсор не с чара, то удалить зеленую обводку с клетки
    if (index !== this.current.cell) {
      this.deselectCell(index);
    }
  }
}
