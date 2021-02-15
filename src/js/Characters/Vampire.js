import Character from '../Character.js';

export default class Vampire extends Character {
  constructor(level) {
    super(level, 'vampire');
    this.attack = 25;
    this.defense = 25;
    this.rmove = 1;
    this.rattack = 4;
  }
}
