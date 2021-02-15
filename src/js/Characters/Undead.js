import Character from '../Character.js';

export default class Undead extends Character {
  constructor(level) {
    super(level, 'undead');
    this.attack = 25;
    this.defense = 25;
    this.rmove = 1;
    this.rattack = 4;
  }
}
