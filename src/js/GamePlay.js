/* eslint-disable no-mixed-operators */
import Bowman from './Characters/Bowman.js';
import Swordsman from './Characters/Swordsman.js';
import Daemon from './Characters/Daemon.js';
import Team from './Team.js';

import { calcHealthLevel, calcTileType } from './utils.js';
import { generateTeam, positionGenerator } from './generators.js';
import PositionedCharacter from './PositionedCharacter.js';
import GameState from './GameState.js';

export default class GamePlay {
  constructor() {
    this.boardSize = 8;
    this.container = null;
    this.boardEl = null;
    this.cells = [];
    this.cellClickListeners = [];
    this.cellEnterListeners = [];
    this.cellLeaveListeners = [];
    this.newGameListeners = [];
    this.saveGameListeners = [];
    this.loadGameListeners = [];
    this.current = undefined;
    this.gameState = new GameState();
    this.playersChars = ['bowman', 'swordsman', 'magician'];
    this.pcChars = ['daemon', 'undead', 'vampire'];
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  /**
   * Draws boardEl with specific theme
   *
   * @param theme
   */
  drawUi(theme) {
    this.checkBinding();

    this.container.innerHTML = `
      <div class="controls">
        <button data-id="action-restart" class="btn">New Game</button>
        <button data-id="action-save" class="btn">Save Game</button>
        <button data-id="action-load" class="btn">Load Game</button>
      </div>
      <div class="board-container">
        <div data-id="board" class="board"></div>
      </div>
    `;

    this.newGameEl = this.container.querySelector('[data-id=action-restart]');
    this.saveGameEl = this.container.querySelector('[data-id=action-save]');
    this.loadGameEl = this.container.querySelector('[data-id=action-load]');

    this.newGameEl.addEventListener('click', (event) => this.onNewGameClick(event));
    this.saveGameEl.addEventListener('click', (event) => this.onSaveGameClick(event));
    this.loadGameEl.addEventListener('click', (event) => this.onLoadGameClick(event));

    this.boardEl = this.container.querySelector('[data-id=board]');

    this.boardEl.classList.add(theme);
    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      const cellEl = document.createElement('div');
      cellEl.classList.add('cell', 'map-tile', `map-tile-${calcTileType(i, this.boardSize)}`);
      cellEl.addEventListener('mouseenter', (event) => this.onCellEnter(event));
      cellEl.addEventListener('mouseleave', (event) => this.onCellLeave(event));
      cellEl.addEventListener('click', (event) => this.onCellClick(event));
      this.boardEl.appendChild(cellEl);
    }

    this.cells = Array.from(this.boardEl.children);
  }

  /**
   * Draws positions (with chars) on boardEl
   *
   * @param positions array of PositionedCharacter objects
   */
  redrawPositions(positions) {
    for (const cell of this.cells) {
      cell.innerHTML = '';
      const index = this.cells.indexOf(cell);
      this.deselectCell(index);
      this.hideCellTooltip(index);
    }

    for (const position of positions) {
      const cellEl = this.boardEl.children[position.position];

      const charEl = document.createElement('div');
      charEl.classList.add('character', position.character.type);

      const healthEl = document.createElement('div');
      healthEl.classList.add('health-level');

      const healthIndicatorEl = document.createElement('div');
      healthIndicatorEl.classList.add('health-level-indicator', `health-level-indicator-${calcHealthLevel(position.character.health)}`);
      healthIndicatorEl.style.width = `${position.character.health}%`;
      healthEl.appendChild(healthIndicatorEl);

      charEl.appendChild(healthEl);
      cellEl.appendChild(charEl);
    }
  }

  /**
   * Add listener to mouse enter for cell
   *
   * @param callback
   */
  addCellEnterListener(callback) {
    this.cellEnterListeners.push(callback);
  }

  /**
   * Add listener to mouse leave for cell
   *
   * @param callback
   */
  addCellLeaveListener(callback) {
    this.cellLeaveListeners.push(callback);
  }

  /**
   * Add listener to mouse click for cell
   *
   * @param callback
   */
  addCellClickListener(callback) {
    this.cellClickListeners.push(callback);
  }

  /**
   * Add listener to "New Game" button click
   *
   * @param callback
   */
  addNewGameListener(callback) {
    this.newGameListeners.push(callback);
  }

  /**
   * Add listener to "Save Game" button click
   *
   * @param callback
   */
  addSaveGameListener(callback) {
    this.saveGameListeners.push(callback);
  }

  /**
   * Add listener to "Load Game" button click
   *
   * @param callback
   */
  addLoadGameListener(callback) {
    this.loadGameListeners.push(callback);
  }

  onCellEnter(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellEnterListeners.forEach((o) => o.call(this, index));
  }

  onCellLeave(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellLeaveListeners.forEach((o) => o.call(this, index));
  }

  onCellClick(event) {
    const index = this.cells.indexOf(event.currentTarget);
    this.cellClickListeners.forEach((o) => o.call(this, index));
  }

  onNewGameClick(event) {
    event.preventDefault();
    this.gameState.chars = [];
    this.current = undefined;
    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      this.deselectCell(i);
    }

    const player = new Team(generateTeam([Bowman, Swordsman], 1, 2));
    const comp = new Team(generateTeam([Daemon], 1, 2));
    const pos = positionGenerator(1);

    for (let i = 0; i < player.chars.length; i += 1) {
      const plChar = new player.chars[i].Char(player.chars[i].lvl);
      const posChar = new PositionedCharacter(plChar, pos.next().value);
      this.gameState.from(posChar);
    }

    for (let i = 0; i < comp.chars.length; i += 1) {
      const cmpChar = new comp.chars[i].Char(comp.chars[i].lvl);
      const posChar = new PositionedCharacter(cmpChar, pos.next().value);
      this.gameState.from(posChar);
    }

    this.redrawPositions(this.gameState.chars);
    this.newGameListeners.forEach((o) => o.call(null));
  }

  onSaveGameClick(event) {
    event.preventDefault();
    this.saveGameListeners.forEach((o) => o.call(null));
  }

  onLoadGameClick(event) {
    event.preventDefault();
    this.loadGameListeners.forEach((o) => o.call(null));
  }

  static showError(message) {
    alert(message);
  }

  static showMessage(message) {
    alert(message);
  }

  selectCell(index, color = 'yellow') {
    this.cells[index].classList.add('selected', `selected-${color}`);
  }

  deselectCell(index) {
    const cell = this.cells[index];
    cell.classList.remove(...Array.from(cell.classList)
      .filter((o) => o.startsWith('selected')));
  }

  showCellTooltip(message, index) {
    this.cells[index].title = message;
  }

  hideCellTooltip(index) {
    this.cells[index].title = '';
  }

  showDamage(index, damage) {
    return new Promise((resolve) => {
      const cell = this.cells[index];
      const damageEl = document.createElement('span');
      damageEl.textContent = damage;
      damageEl.classList.add('damage');
      cell.appendChild(damageEl);

      damageEl.addEventListener('animationend', () => {
        cell.removeChild(damageEl);
        resolve();
      });
    });
  }

  setCursor(cursor) {
    this.boardEl.style.cursor = cursor;
  }

  checkBinding() {
    if (this.container === null) {
      throw new Error('GamePlay not bind to DOM');
    }
  }

  checkMovePossibility(index, range) {
    const clickOnPlayersChar = this.gameState.chars.findIndex((elem) => {
      const { position, character } = elem;
      return (this.playersChars.includes(character.type) && position === index);
    });
    if (clickOnPlayersChar !== -1) return false;

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
      return (position === index && this.pcChars.includes(character.type));
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

    if ((difx <= range) && (target.y === selected.y)
    || (dify <= range) && (target.x === selected.x)
    || (difx === dify) && (difx <= range)) {
      return true;
    }
    return false;
  }
}
