export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defense = 0;
    this.health = 50;
    this.type = type;
    if (new.target.name === 'Character') throw new Error('Dont use "new Character()"');
  }

  levelup() {
    this.attack = Math.round(Math.max(this.attack, (this.attack * (this.health / 30))));
    this.defense = Math.round(Math.max(this.defense, (this.defense * (this.health / 30))));
    this.health = Math.min(this.health + 80, 100);
    this.level += 1;
  }
}
