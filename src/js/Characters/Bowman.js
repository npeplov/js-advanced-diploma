import Character from '../Character.js';

export default class Bowman extends Character {
  constructor(level) {
    super(level, 'bowman');
    this.attack = 25;
    this.defense = 25;
    this.rmove = 2;
    this.rattack = 2;
  }
}
