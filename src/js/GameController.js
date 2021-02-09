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
    // 9. Выбор персонажа
    const charInd = this.gameState.plPositions.findIndex((elem) => elem === index);
    if (charInd !== -1) {
      this.selectCell(index);
      if (this.current) this.deselectCell(this.current.cell);
      this.current = { type: this.gameState.chars[charInd].type, cell: index };
    }
  }

  onCellEnter(index) {
    // 8. Вывод информации о персонаже 🎖1 ⚔10 🛡40 ❤50

    const charInd = this.gameState.positions.findIndex((elem) => elem === index);
    if (charInd !== -1) {
      const element = this.gameState.chars[charInd];
      this.showCellTooltip(`
      🎖 ${element.level} ⚔${element.attack} 🛡 ${element.defense} ❤ ${element.health}
      `, index);
    }

    if (!this.current) return;

    if (this.current.type === 'bowman') {
    // 10.2 Проверка на допустимость передвижения
      const canGo = this.checkMovePossibility(index, 2);
      if (canGo) {
        this.setCursor(cursors.pointer);
        this.selectCell(index, 'green');
      }

      // 10.3 Проверка на допустимость атаки
      const canAttack = this.checkAttackPossibility(index, 5);
      if (canAttack) {
        this.cells[index].style.cursor = cursors.crosshair;
        this.selectCell(index, 'red');
      }
      if (this.gameState.plPositions.includes(index)) {
        this.setCursor(cursors.auto);
        return;
      }

      // 10.4 Проверка на недопустимое действие
      if (!canAttack && !canGo) this.setCursor(cursors.notallowed);
    }

    if (this.current.type === 'swordsman') {
    // 10.2 Проверка на допустимость передвижения
      const canGo = this.checkMovePossibility(index, 4);
      if (canGo) {
        this.setCursor(cursors.pointer);
        this.selectCell(index, 'green');
      }

      // 10.3 Проверка на допустимость атаки
      const canAttack = this.checkAttackPossibility(index, 5);
      if (canAttack) {
        this.cells[index].style.cursor = cursors.crosshair;
        this.selectCell(index, 'red');
      }
      if (this.gameState.plPositions.includes(index)) {
        this.setCursor(cursors.auto);
        return;
      }

      // 10.4 Проверка на недопустимое действие
      if (!canAttack && !canGo) this.setCursor(cursors.notallowed);
    }
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
