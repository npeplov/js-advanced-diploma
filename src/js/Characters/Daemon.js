import Character from '../Character.js';

export default class Daemon extends Character {
  constructor(level) {
    super(level, 'daemon');
    this.attack = 25;
    this.defense = 25;
  }
}