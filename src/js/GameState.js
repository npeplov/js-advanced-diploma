export default class GameState {
  constructor() {
    this.chars = [];
    this.level = 1;
    this.score = null;
    this.record = null;
  }

  from(object) {
    this.chars.push({ character: object.character, position: object.position });
  }
}
