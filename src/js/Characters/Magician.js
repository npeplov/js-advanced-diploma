import Character from '../Character.js';

export default class Magician extends Character {
  constructor(level) {
    super(level, 'magician');
    this.attack = 10;
    this.defense = 40;
    this.rmove = 1;
    this.rattack = 4;
  }
}
