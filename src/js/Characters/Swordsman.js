import Character from '../Character.js';

export default class Swordsman extends Character {
  constructor(level) {
    super(level, 'swordsman');
    this.attack = 40;
    this.defense = 10;
    this.rmove = 4;
    this.rattack = 1;
  }
}
