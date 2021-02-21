!function(e){var t={};function a(s){if(t[s])return t[s].exports;var r=t[s]={i:s,l:!1,exports:{}};return e[s].call(r.exports,r,r.exports,a),r.l=!0,r.exports}a.m=e,a.c=t,a.d=function(e,t,s){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(a.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)a.d(s,r,function(t){return e[t]}.bind(null,r));return s},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="",a(a.s=0)}([function(e,t,a){"use strict";function s(e){return void 0!==e.x?8*e.y+e.x:{x:e%8,y:(e-e%8)/8}}a.r(t);class r{constructor(){this.boardSize=8,this.container=null,this.boardEl=null,this.cells=[],this.cellClickListeners=[],this.cellEnterListeners=[],this.cellLeaveListeners=[],this.newGameListeners=[],this.saveGameListeners=[],this.loadGameListeners=[]}bindToDOM(e){if(!(e instanceof HTMLElement))throw new Error("container is not HTMLElement");this.container=e}drawUi(e){this.checkBinding(),this.container.innerHTML='\n      <div class="controls">\n        <button data-id="action-restart" class="btn">New Game</button>\n        <button data-id="action-save" class="btn">Save Game</button>\n        <button data-id="action-load" class="btn">Load Game</button>\n      </div>\n      <div class="board-container">\n        <div data-id="board" class="board"></div>\n      </div>\n    ',this.newGameEl=this.container.querySelector("[data-id=action-restart]"),this.saveGameEl=this.container.querySelector("[data-id=action-save]"),this.loadGameEl=this.container.querySelector("[data-id=action-load]"),this.newGameEl.addEventListener("click",e=>this.onNewGameClick(e)),this.saveGameEl.addEventListener("click",e=>this.onSaveGameClick(e)),this.loadGameEl.addEventListener("click",e=>this.onLoadGameClick(e)),this.boardEl=this.container.querySelector("[data-id=board]"),this.boardEl.classList.add(e);for(let e=0;e<this.boardSize**2;e+=1){const s=document.createElement("div");s.classList.add("cell","map-tile","map-tile-"+(t=e,a=this.boardSize,0===t?"top-left":7===t?"top-right":56===t?"bottom-left":63===t?"bottom-right":t>0&&t<7?"top":t%a==0?"left":(t-7)%8==0?"right":t>56?"bottom":"center")),s.addEventListener("mouseenter",e=>this.onCellEnter(e)),s.addEventListener("mouseleave",e=>this.onCellLeave(e)),s.addEventListener("click",e=>this.onCellClick(e)),this.boardEl.appendChild(s)}var t,a;this.cells=Array.from(this.boardEl.children)}redrawPositions(e){for(const e of this.cells){e.innerHTML="";const t=this.cells.indexOf(e);this.deselectCell(t),this.hideCellTooltip(t)}for(const a of e){const e=this.boardEl.children[a.position],s=document.createElement("div");s.classList.add("character",a.character.type);const r=document.createElement("div");r.classList.add("health-level");const i=document.createElement("div");i.classList.add("health-level-indicator","health-level-indicator-"+((t=a.character.health)<15?"critical":t<50?"normal":"high")),i.style.width=a.character.health+"%",r.appendChild(i),s.appendChild(r),e.appendChild(s)}var t}addCellEnterListener(e){this.cellEnterListeners.push(e)}addCellLeaveListener(e){this.cellLeaveListeners.push(e)}addCellClickListener(e){this.cellClickListeners.push(e)}addNewGameListener(e){this.newGameListeners.push(e)}addSaveGameListener(e){this.saveGameListeners.push(e)}addLoadGameListener(e){this.loadGameListeners.push(e)}onCellEnter(e){e.preventDefault();const t=this.cells.indexOf(e.currentTarget);this.cellEnterListeners.forEach(e=>e.call(null,t))}onCellLeave(e){e.preventDefault();const t=this.cells.indexOf(e.currentTarget);this.cellLeaveListeners.forEach(e=>e.call(null,t))}onCellClick(e){const t=this.cells.indexOf(e.currentTarget);this.cellClickListeners.forEach(e=>e.call(null,t))}onNewGameClick(e){e.preventDefault(),this.newGameListeners.forEach(e=>e.call(null))}onSaveGameClick(e){e.preventDefault(),this.saveGameListeners.forEach(e=>e.call(null))}onLoadGameClick(e){e.preventDefault(),this.loadGameListeners.forEach(e=>e.call(null))}static showError(e){return"undefined"!=typeof exports?e:(alert(e),!0)}static showMessage(e){alert(e)}selectCell(e,t="yellow"){this.cells[e].classList.add("selected","selected-"+t)}deselectCell(e){const t=this.cells[e];t.classList.remove(...Array.from(t.classList).filter(e=>e.startsWith("selected")))}showCellTooltip(e,t){this.cells[t].title=e}hideCellTooltip(e){this.cells[e].title=""}showDamage(e,t){return new Promise(a=>{const s=this.cells[e],r=document.createElement("span");r.textContent=t,r.classList.add("damage"),s.appendChild(r),r.addEventListener("animationend",()=>{s.removeChild(r),a()})})}setCursor(e){this.boardEl.style.cursor=e}checkBinding(){if(null===this.container)throw new Error("GamePlay not bind to DOM")}}class i{constructor(e,t="generic"){if(this.level=e,this.attack=0,this.defense=0,this.health=50,this.type=t,"Character"===new.target.name)throw new Error('Dont use "new Character()"')}levelup(){const e=1.8-(1-this.health/100);this.attack=Math.round(Math.max(this.attack,this.attack*e)),this.defense=Math.round(Math.max(this.defense,this.defense*e)),this.health=Math.min(this.health+80,100),this.level+=1}}class n extends i{constructor(e){super(e,"bowman"),this.attack=25,this.defense=25,this.rmove=2,this.rattack=2}static name(){return"bowman"}}class c extends i{constructor(e){super(e,"swordsman"),this.attack=40,this.defense=10,this.rmove=4,this.rattack=1}static name(){return"swordsman"}}class h extends i{constructor(e){super(e,"daemon"),this.attack=10,this.defense=40,this.rmove=1,this.rattack=4}static name(){return"daemon"}}class l extends i{constructor(e){super(e,"magician"),this.attack=10,this.defense=40,this.rmove=1,this.rattack=4}static name(){return"magician"}}class o extends i{constructor(e){super(e,"vampire"),this.attack=25,this.defense=25,this.rmove=2,this.rattack=2}static name(){return"vampire"}}class d extends i{constructor(e){super(e,"undead"),this.attack=40,this.defense=10,this.rmove=4,this.rattack=1}static name(){return"undead"}}class m{constructor(e,t){if(!(e instanceof i))throw new Error("character must be instance of Character or its children");if("number"!=typeof t)throw new Error("position must be a number");this.character=e,this.position=t}}var u={1:"prairie",2:"desert",3:"arctic",4:"mountain"};class g{constructor(e){this.chars=e}}class f{constructor(){this.chars=[],this.level=1,this.score=null,this.record=null}from(e){this.chars.push({character:e.character,position:e.position})}}var v={auto:"auto",pointer:"pointer",crosshair:"crosshair",notallowed:"not-allowed"};function*p(e){const t=[],a=()=>{let e;do{e=8*Math.floor(7*Math.random())}while(t.includes(e));return t.push(e),e};if("player"===e)for(;;)yield a(),yield a()+1;else for(;;)yield a()+7,yield a()+6}function*y(e,t){const a=Math.floor(Math.random()*e.length),s=Math.floor(Math.random()*t)+1;yield{Char:e[a],lvl:s}}function C(e,t,a){const s=[];for(let r=0;r<a;r+=1)s.push(y(e,t).next().value);return s}const S=new r;S.bindToDOM(document.querySelector("#game-container"));const w=new class{constructor(e){this.storage=e}save(e){this.storage.setItem("state",JSON.stringify(e))}load(){try{return JSON.parse(this.storage.getItem("state"))}catch(e){throw new Error("Invalid state")}}}(localStorage);new class{constructor(e,t){this.gamePlay=e,this.stateService=t,this.gameState=new f,this.current=null,this.playersChars=[n,c,l],this.pcChars=[h,d,o]}init(){this.gamePlay.drawUi(u[1]),this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this)),this.gamePlay.addCellClickListener(this.onCellClick.bind(this)),this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this)),this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this)),this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this)),this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));const e=this.stateService.load();e&&(this.gameState.record=e.record)}onNewGameClick(){this.resetToDefault(),this.init();const e=p("player"),t=p("computer");for(let e=0;e<this.boardSize**2;e+=1)this.deselectCell(e);const a=new g(C([n,c],1,2)),s=new g(C([h,o,d],1,2));for(let t=0;t<a.chars.length;t+=1){const s=new a.chars[t].Char(a.chars[t].lvl),r=new m(s,e.next().value);this.gameState.from(r)}for(let e=0;e<s.chars.length;e+=1){const a=new s.chars[e].Char(s.chars[e].lvl),r=new m(a,t.next().value);this.gameState.from(r)}this.gamePlay.redrawPositions(this.gameState.chars);this.stateService.load()||this.stateService.save(this.gameState)}onSaveGameClick(){this.stateService.save(this.gameState)}onLoadGameClick(){const e=this.stateService.load();e.chars&&(this.gameState.chars=[],this.gameState.level=e.level,this.gameState.score=e.score,e.chars.forEach(e=>{const{type:t,level:a}=e.character,{position:s}=e,r=[...this.playersChars,...this.pcChars].find(e=>e.name()===t);this.gameState.from({character:new r(a),position:s})}),this.gamePlay.drawUi(u[e.level]),this.gamePlay.redrawPositions(this.gameState.chars))}getCharIndex(e,t){return this.gameState.chars.findIndex(a=>{const{position:s,character:r}=a;return t.find(e=>e.name()===r.type)&&s===e})}async onCellClick(e){const t=this.getCharIndex(e,this.playersChars);if(-1!==t&&(this.gamePlay.selectCell(e),this.current&&this.gamePlay.deselectCell(this.current.cell),this.current={type:this.gameState.chars[t].character.type,cell:e,charInd:t}),!this.current)return;const{charInd:a}=this.current,{character:s}=this.gameState.chars[a],r=this.checkTurnPossibility(this.current.cell,e,s.rmove,"move"),i=this.checkTurnPossibility(this.current.cell,e,s.rattack,"attack");if(r&&(this.gameState.chars[a].position=e,this.current.cell=e,this.current=null,this.gamePlay.redrawPositions(this.gameState.chars),this.gamePlay.setCursor(v.auto)),i){let t=this.getCharIndex(e,this.pcChars);const s={attack:this.gameState.chars[a].character.attack},r={defense:this.gameState.chars[t].character.defense},i=Math.max(s.attack-r.defense,.1*s.attack).toFixed();this.gameState.chars[t].character.health-=i,await this.gamePlay.showDamage(e,i),this.gameState.chars[t].character.health<=0&&(this.gameState.chars.splice(t,1),t=null),this.gamePlay.redrawPositions(this.gameState.chars),this.aiTurn(t,this.current.cell,a),this.current=null,this.checkForLevelUp()}}onCellEnter(e){const t=this.gameState.chars.findIndex(t=>t.position===e),a=this.getCharIndex(e,this.playersChars);if(-1!==t){const a=this.gameState.chars[t].character;this.gamePlay.showCellTooltip(function(e){return`🎖 ${e.level} ⚔ ${e.attack} 🛡 ${e.defense} ❤ ${e.health}`}(a),e)}if(!this.current)return;const{charInd:s}=this.current,{character:r}=this.gameState.chars[s],i=this.checkTurnPossibility(this.current.cell,e,r.rmove,"move"),n=this.checkTurnPossibility(this.current.cell,e,r.rattack,"attack");i&&(this.gamePlay.setCursor(v.pointer),this.gamePlay.selectCell(e,"green")),n&&(this.gamePlay.setCursor(v.crosshair),this.gamePlay.selectCell(e,"red")),-1===a?n||i||this.gamePlay.setCursor(v.notallowed):this.gamePlay.setCursor(v.pointer)}onCellLeave(e){this.current&&(this.gamePlay.setCursor(v.auto),e!==this.current.cell&&this.gamePlay.deselectCell(e))}checkTurnPossibility(e,t,a,r){const i=this.getCharIndex(e,this.pcChars)+1,n=s(e),c=s(t),h=Math.abs(c.x-n.x),l=Math.abs(c.y-n.y);if("attack"===r){if(this.getCharIndex(t,this.pcChars)+i===-1)return!1;if(h<=a&&l<=a)return!0}else if("move"===r){if(-1!==this.getCharIndex(t,[...this.playersChars,...this.pcChars]))return!1;if(h<=a&&c.y===n.y||l<=a&&c.x===n.x||h===l&&h<=a)return!0}else if("approach"===r)return l>h?(c.y>n.y?n.y+=1:n.y-=1,s({x:n.x,y:n.y})):s({x:n.x-1,y:n.y});return!1}async aiTurn(e,t,a){if(!e)return;const{character:s}=this.gameState.chars[e],r=this.gameState.chars[e].position,i=this.checkTurnPossibility(r,t,s.rattack,"attack");if(i){const s={attack:this.gameState.chars[e].character.attack},r={defense:this.gameState.chars[a].character.defense},i=Math.max(s.attack-r.defense,.1*s.attack).toFixed(0);this.gameState.chars[a].character.health-=i,await this.gamePlay.showDamage(t,i),this.gameState.chars[a].character.health<=0&&this.gameState.chars.splice(a,1),this.gamePlay.redrawPositions(this.gameState.chars),this.checkForLevelUp()}if(i)return;const n=this.checkTurnPossibility(r,t,s.rattack,"approach");this.checkTurnPossibility(r,n,s.rattack,"move")&&(this.gameState.chars[e].position=n,this.gamePlay.redrawPositions(this.gameState.chars))}checkForLevelUp(){const e=this.gameState.chars.some(e=>{const{character:t}=e;return this.pcChars.find(e=>e.name()===t.type)});this.gameState.chars.some(e=>{const{character:t}=e;return this.playersChars.find(e=>e.name()===t.type)})||r.showMessage("You loose"),e||(this.gameState.level+=1,this.levelup(this.gameState.level)),this.checkForRecord()}levelup(e){if(this.gameState.score=this.gameState.chars.reduce((e,t)=>e+t.character.health,this.gameState.score),e>4)return void r.showMessage("You win!");this.gamePlay.drawUi(u[e]),this.checkForRecord(),this.current=null;const t=p("player"),a=p("computer");this.gameState.chars.forEach(e=>{e.character.levelup(),e.position=t.next().value});for(let e=0;e<this.boardSize**2;e+=1)this.gamePlay.deselectCell(e);const s=e-this.gameState.chars.length+1,i=C(this.playersChars,e,s),n=C(this.pcChars,e,e+1);for(let e=0;e<n.length;e+=1){const t=new n[e].Char(n[e].lvl),s=new m(t,a.next().value);this.gameState.from(s)}for(let e=0;e<i.length;e+=1){const a=new i[e].Char(i[e].lvl),s=new m(a,t.next().value);this.gameState.from(s)}this.gamePlay.redrawPositions(this.gameState.chars)}checkForRecord(){const e=this.stateService.load();this.gameState.score>this.gameState.record&&(this.gameState.record=this.gameState.score,e.record=this.gameState.record,this.stateService.save(e))}resetToDefault(){this.gamePlay.cellClickListeners=[],this.gamePlay.cellEnterListeners=[],this.gamePlay.cellLeaveListeners=[],this.gamePlay.newGameListeners=[],this.gamePlay.saveGameListeners=[],this.gamePlay.loadGameListeners=[],this.gameState.chars=[],this.gameState.level=1,this.current=null}}(S,w).init()}]);