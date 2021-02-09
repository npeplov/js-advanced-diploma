export default class GameState {
  constructor() {
    this.chars = [];
    this.positions = [];
    this.plPositions = [];
  }

  from(object) {
    this.chars.push(object.character);
    this.positions.push(object.position);
    if (object.plPositions) this.plPositions.push(object.plPositions);
  // TODO: create object
  // 1. объекты класса char(bowman, daemon и тд)
  // 2. позиции
  // 3. чей ход.
  // ? выбранный чар/ или отдельная переменная
  }
}
