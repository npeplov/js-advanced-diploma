export default class GameState {
  constructor() {
    this.chars = [];
  }

  from(object) {
    this.chars.push({ character: object.character, position: object.position });
  // TODO: create object
  // 1. объекты класса char(bowman, daemon и тд)
  // 2. позиции
  // 3. чей ход.
  // ? выбранный чар/ или отдельная переменная
  }
}
