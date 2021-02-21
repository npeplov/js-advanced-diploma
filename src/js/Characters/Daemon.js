import Character from '../Character.js';

export default class Daemon extends Character {
  constructor(level) {
    super(level, 'daemon');
    this.attack = 10;
    this.defense = 40;
    this.rmove = 1;
    this.rattack = 4;
  }

  static name() {
    return 'daemon';
  }
}
