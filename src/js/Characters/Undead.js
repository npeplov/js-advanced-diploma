import Character from '../Character.js';

export default class Undead extends Character {
  constructor(level) {
    super(level, 'undead');
    this.attack = 40;
    this.defense = 10;
    this.rmove = 4;
    this.rattack = 1;
  }

  static name() {
    return 'undead';
  }
}
