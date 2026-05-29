import { W, H } from './constants.js';
import { fishTypesByMap, mapEffects } from './data.js';
import { game, currentMap, currentRod, save } from './state.js';
import { rand, irand, clamp } from './utils.js';

const fishPool = [];
const particlePool = [];
const chestPool = [];

export const harpoon = { x: 750, y: 142, status: 'still', tipX: 750, tipY: 160, fish: null, chest: null };

function chooseVariant(typeId) {
  let goldenChance = 3 + game.upgrades.luck * 0.7 + (game.baitActive ? 4 : 0) + (game.potions.luck > 0 ? 5 : 0);
  let rainbowChance = 0.8 + game.upgrades.luck * 0.25 + (game.baitActive ? 1.5 : 0) + (game.potions.luck > 0 ? 2 : 0);
  if (typeId >= 5) {
    goldenChance += 2;
    rainbowChance += 1;
  }
  const r = rand(0, 100);
  if (r < rainbowChance) return { id: 'rainbow', label: 'Rainbow', mult: 5, border: '#ff4dff' };
  if (r < rainbowChance + goldenChance) return { id: 'golden', label: 'Golden', mult: 2.5, border: '#ffd700' };
  return null;
}

function pickBehavior(mapId) {
  const base = [
    { id: 'drift', w: 2.4 },
    { id: 'zigzag', w: 1.6 },
    { id: 'dart', w: 1.2 },
    { id: 'glide', w: 1.4 }
  ];

  if (mapId === 'storm') base[2].w += 0.6;
  if (mapId === 'toxic') base[1].w += 0.5;
  if (mapId === 'jungle') base[0].w += 0.4;

  const total = base.reduce((s, b) => s + b.w, 0);
  let roll = rand(0, total);
  for (const b of base) {
    roll -= b.w;
    if (roll <= 0) return b.id;
  }
  return 'drift';
}

class Fish {
  constructor() {
    this.reset(false);
  }

  reset(firstSpawn) {
    const map = currentMap();
    const effects = mapEffects[map.id] || {};
    const rareBoost = map.rare + game.upgrades.luck * 0.4 + (game.baitActive ? 20 : 0) + (game.potions.luck > 0 ? 24 : 0);
    const fishPool = fishTypesByMap[map.id] || fishTypesByMap.bay;

    let totalChance = 0;
    for (const f of fishPool) {
      let ch = f.chance;
      if (f.id >= 4) {
        const maxExtraMult = f.id === 4 ? 0.25 : 0.4;
        const dampeningFactor = 50;
        const subtleMultiplier = 1 + (maxExtraMult * rareBoost / (rareBoost + dampeningFactor));
        ch = ch * subtleMultiplier;
      }
      totalChance += ch;
    }

    let roll = rand(0, totalChance);
    let acc = 0;
    let chosen = fishPool[0];

    for (const f of fishPool) {
      let ch = f.chance;
      if (f.id >= 4) {
        const maxExtraMult = f.id === 4 ? 0.25 : 0.4;
        const dampeningFactor = 50;
        const subtleMultiplier = 1 + (maxExtraMult * rareBoost / (rareBoost + dampeningFactor));
        ch = ch * subtleMultiplier;
      }
      acc += ch;
      if (roll <= acc) {
        chosen = f;
        break;
      }
    }

    this.type = { ...chosen };
    this.variant = chooseVariant(chosen.id);
    this.dir = Math.random() < 0.5 ? -1 : 1;
    this.w = 140 * chosen.size;
    this.h = 70 * chosen.size;
    this.x = this.dir === 1 ? -this.w - rand(0, 500) : W + rand(0, 500);
    this.y = rand(245, 735);
    this.speed = rand(2.2, 4.8) + chosen.id * 0.18 + map.fishBonus * 0.05;
    this.speed *= effects.fishSlow ? effects.fishSlow : 1;
    this.speed *= effects.fishAggro ? effects.fishAggro : 1;
    this.bob = rand(0, Math.PI * 2);
    this.caught = false;
    this.behavior = pickBehavior(map.id);
    this.targetY = rand(260, 730);
    this.drift = rand(-0.25, 0.25);
    this.zigzagAmp = rand(0.05, 0.12);
    this.zigzagSpeed = rand(0.9, 1.3);
    this.dartCooldown = rand(600, 1400);
    this.dartTime = 0;

    if (firstSpawn) {
      this.x = rand(0, W);
    }
  }

  move(dt) {
    if (this.caught) return;

    this.bob += dt * 0.005;

    let speedMult = 1;

    if (this.behavior === 'glide') {
      speedMult *= 0.82;
      this.y += this.drift * dt * 0.04;
    }

    if (this.behavior === 'drift') {
      this.y += this.drift * dt * 0.06;
    }

    if (this.behavior === 'zigzag') {
      this.y += Math.sin(this.bob * this.zigzagSpeed) * this.zigzagAmp * dt;
      this.y += (this.targetY - this.y) * 0.0025 * dt;
    }

    if (this.behavior === 'dart') {
      if (this.dartTime > 0) {
        this.dartTime -= dt;
        speedMult *= 1.85;
      } else {
        this.dartCooldown -= dt;
        if (this.dartCooldown <= 0) {
          this.dartTime = rand(180, 360);
          this.dartCooldown = rand(700, 1400);
        }
      }
    }

    this.x += this.dir * this.speed * speedMult * dt * 0.06;
    this.y = clamp(this.y, 245, 735);

    if (this.x > W + this.w + 60 || this.x < -this.w - 60) {
      this.reset(false);
    }
  }

  rect() {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }
}

class TreasureChest {
  constructor() {
    this.reset(true);
  }

  reset(first) {
    this.w = 92;
    this.h = 66;
    this.x = first ? rand(160, W - 220) : Math.random() < 0.5 ? -140 : W + 140;
    this.y = rand(330, 735);
    this.dir = this.x < W / 2 ? 1 : -1;
    this.speed = rand(0.7, 1.35);
    this.bob = rand(0, Math.PI * 2);
    this.caught = false;
  }

  move(dt) {
    if (this.caught) return;
    this.bob += dt * 0.004;
    this.x += this.dir * this.speed * dt * 0.06;
    if (this.x > W + 160 || this.x < -180) this.reset(false);
  }

  rect() {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }
}

class Particle {
  reset(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = rand(-4, 4);
    this.vy = rand(-4, 4);
    this.life = rand(25, 55);
    this.color = color;
    this.r = rand(3, 5.5);
  }
}

function getFish(first) {
  const fish = fishPool.pop() || new Fish();
  fish.reset(!!first);
  return fish;
}

function releaseFish(fish) {
  fishPool.push(fish);
}

function getChest(first) {
  const chest = chestPool.pop() || new TreasureChest();
  chest.reset(!!first);
  return chest;
}

function releaseChest(chest) {
  chestPool.push(chest);
}

function getParticle(x, y, color) {
  const p = particlePool.pop() || new Particle();
  p.reset(x, y, color);
  return p;
}

export function harpoonSpeed() {
  const effects = mapEffects[currentMap().id] || {};
  const slow = effects.harpoonSlow ? effects.harpoonSlow : 1;
  return (10 + game.upgrades.speed * 2.1) * currentRod().power * (game.potions.speed > 0 ? 1.65 : 1) * slow;
}

function ropeRange() {
  return 660 + game.upgrades.rope * 70;
}

export function launch() {
  if (game.panel || game.transition.active) return;
  if (harpoon.status !== 'still') return;
  harpoon.status = 'out';
  harpoon.tipX = harpoon.x;
  harpoon.tipY = 170;
}

export function updateHarpoon(dt) {
  if (!harpoon) return;

  const sy = 160;
  if (harpoon.status === 'still') {
    harpoon.x = clamp(game.mouseX, 210, W - 210);
    harpoon.tipX = harpoon.x;
    harpoon.tipY = sy;
    return;
  }
  const step = harpoonSpeed() * dt * 0.06;
  if (harpoon.status === 'out') harpoon.tipY += step;
  else harpoon.tipY -= step * 1.15;

  if (harpoon.status === 'out' && !harpoon.fish) {
    if (harpoon.tipY - sy > ropeRange() || harpoon.tipY > H - 35) harpoon.status = 'back';
    for (const chest of game.chests) {
      const r = chest.rect();
      const hit = harpoon.tipX > r.x + 4 && harpoon.tipX < r.x + r.w - 4 && harpoon.tipY > r.y + 4 && harpoon.tipY < r.y + r.h - 4;
      if (hit) {
        harpoon.chest = chest;
        chest.caught = true;
        harpoon.status = 'back';
        game.shake = 8;
        burst(harpoon.tipX, harpoon.tipY, '#ffd700', 24);
        break;
      }
    }
    if (!harpoon.chest) {
      for (const fish of game.fish) {
        const r = fish.rect();
        const centerY = r.y + r.h / 2;
        const cleanHit = harpoon.tipX > r.x + 8 && harpoon.tipX < r.x + r.w - 8 && harpoon.tipY > r.y + 6 && harpoon.tipY < r.y + r.h - 6;
        if (cleanHit) {
          harpoon.fish = fish;
          fish.caught = true;
          harpoon.status = 'back';
          game.shake = 8;
          harpoon.tipY = centerY;
          burst(harpoon.tipX, harpoon.tipY, fish.type.body, 18);
          break;
        }
      }
    }
  }
  if (harpoon.fish) {
    harpoon.fish.x = harpoon.tipX - harpoon.fish.w / 2;
    harpoon.fish.y = harpoon.tipY - harpoon.fish.h / 2;
  }
  if (harpoon.chest) {
    harpoon.chest.x = harpoon.tipX - harpoon.chest.w / 2;
    harpoon.chest.y = harpoon.tipY - harpoon.chest.h / 2;
  }
  if (harpoon.status === 'back' && harpoon.tipY <= sy) {
    const missed = !harpoon.fish && !harpoon.chest;
    if (harpoon.fish) catchFish(harpoon.fish);
    if (harpoon.chest) catchChest(harpoon.chest);
    if (missed) {
      game.streak = 0;
      game.streakTimer = 0;
      msg('Streak lost', W / 2, 130, '#ff7675');
    }
    harpoon.status = 'still';
    harpoon.fish = null;
    harpoon.chest = null;
    harpoon.tipY = sy;
  }
}

function streakBonus() {
  const tier = Math.floor(game.streak / 3);
  return 1 + Math.min(0.25, tier * 0.05);
}

function catchFish(fish) {
  const map = currentMap();
  const effects = mapEffects[map.id] || {};
  const variantMult = fish.variant ? fish.variant.mult : 1;
  const potionMult = game.potions.coin > 0 ? 2 : 1;
  const surgeBonus = game.hazards.surge > 0 ? effects.surgeBonus || 0 : 0;
  const deepBonus = effects.deepBonus && fish.y > effects.deepY ? effects.deepBonus : 0;

  game.combo = Math.min(2, game.combo + 0.125);
  game.comboTimer = 2600;

  game.streak += 1;
  game.streakTimer = 2400 + (effects.streakWindowBonus || 0);
  if (game.streak % 3 === 0) {
    msg(`Streak bonus +${Math.round((streakBonus() - 1) * 100)}%`, W / 2, 160, '#ffeaa7');
  }

  const base = fish.type.value * map.mult * variantMult * potionMult;
  const earned = Math.round(base * game.combo * streakBonus() * (1 + surgeBonus) * (1 + deepBonus));

  game.coins += earned;
  game.score += earned;
  game.caught++;
  game.bestCatch = `${fish.variant ? fish.variant.label + ' ' : ''}${fish.type.name}`;
  game.collection[fish.type.name] = true;

  if (fish.type.id >= 5) game.gems += fish.type.id - 4;

  msg(`+${earned} coins`, fish.x + fish.w / 2, fish.y, '#fff16a');
  if (fish.type.id >= 5) msg(`+${fish.type.id - 4} gem`, fish.x + fish.w / 2, fish.y - 30, '#9effff');

  game.fish.splice(game.fish.indexOf(fish), 1);
  releaseFish(fish);
  game.fish.push(getFish(false));
  checkQuests(fish);
  save();
}

function catchChest(chest) {
  const effects = mapEffects[currentMap().id] || {};
  const rewards = [
    { name: 'Lucky Potion', key: 'luck', time: 30000, color: '#a29bfe', text: '+Luck for 30s' },
    { name: 'Speed Potion', key: 'speed', time: 25000, color: '#54a0ff', text: '+Harpoon speed for 25s' },
    { name: 'Coin Potion', key: 'coin', time: 35000, color: '#ffdd59', text: '2x coins for 35s' }
  ];
  const r = rewards[irand(0, rewards.length - 1)];
  const durationMult = effects.potionDurationMult || 1;
  game.potions[r.key] = Math.round(r.time * durationMult);
  msg(`${r.name}! ${r.text}`, chest.x + chest.w / 2, chest.y - 10, r.color);
  burst(chest.x + chest.w / 2, chest.y + chest.h / 2, r.color, 34);
  game.chests.splice(game.chests.indexOf(chest), 1);
  releaseChest(chest);
  setTimeout(() => {
    if (game.chests.length < 2) game.chests.push(getChest(false));
  }, irand(5000, 11000));
}

function checkQuests(fish) {
  for (const q of game.quests) {
    if (q.done) continue;
    let ok = false;
    if (q.type === 'caught' && game.caught >= q.goal) ok = true;
    if (q.type === 'catches' && game.caught >= q.goal) ok = true;
    if (q.type === 'lotofcatches' && game.caught >= q.goal) ok = true;
    if (q.type === 'combo' && game.combo >= q.goal) ok = true;
    if (q.type === 'legend' && fish.type.id >= 5) ok = true;
    if (ok) {
      q.done = true;
      game.coins += q.reward;
      msg(`QUEST DONE +${q.reward}`, W / 2, 120, '#7bed9f');
    }
  }
}

export function burst(x, y, color, n = 10) {
  for (let i = 0; i < n; i++) game.particles.push(getParticle(x, y, color));
}

export function msg(text, x, y, color) {
  game.messages.push({ text, x, y, color, life: 80 });
}

function updateHazards(dt) {
  const mapId = currentMap().id;
  const effects = mapEffects[mapId] || {};

  if (effects.lightningChance) {
    if (!game.hazards.lightning && Math.random() < effects.lightningChance * (dt / 16)) {
      game.hazards.lightning = { x: rand(240, W - 240), life: 280, maxLife: 280 };
      game.hazards.surge = effects.surgeTime || 0;
      msg('Storm surge +coins', W / 2, 140, '#74b9ff');
    }
  }

  if (game.hazards.lightning) {
    game.hazards.lightning.life -= dt;

    if (harpoon.status === 'out') {
      const dx = Math.abs(harpoon.tipX - game.hazards.lightning.x);
      if (dx < 45 && harpoon.tipY > 260) {
        harpoon.status = 'back';
        harpoon.fish = null;
        harpoon.chest = null;
        game.combo = 1;
        game.streak = 0;
        game.streakTimer = 0;
        game.shake = 10;
        msg('Lightning strike!', W / 2, 120, '#ff7675');
      }
    }

    if (game.hazards.lightning.life <= 0) {
      game.hazards.lightning = null;
    }
  }
}

export function updateEffects(dt) {
  if (game.comboTimer > 0) {
    game.comboTimer -= dt;
    if (game.comboTimer <= 0) game.combo = 1;
  }

  if (game.streakTimer > 0) {
    game.streakTimer -= dt;
    if (game.streakTimer <= 0) game.streak = 0;
  }

  for (const k of Object.keys(game.potions)) {
    if (game.potions[k] > 0) game.potions[k] = Math.max(0, game.potions[k] - dt);
  }

  if (game.hazards.surge > 0) {
    game.hazards.surge = Math.max(0, game.hazards.surge - dt);
  }

  game.shake *= 0.9;

  for (const p of game.particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.08;
    p.life--;
  }

  for (let i = game.particles.length - 1; i >= 0; i--) {
    const p = game.particles[i];
    if (p.life <= 0) {
      game.particles.splice(i, 1);
      particlePool.push(p);
    }
  }

  for (const m of game.messages) {
    m.y -= 0.7;
    m.life--;
  }
  game.messages = game.messages.filter((m) => m.life > 0);

  updateHazards(dt);
}

export function spawnFish() {
  game.fish = [];
  const count = 15 + currentMap().fishBonus;
  for (let i = 0; i < count; i++) {
    game.fish.push(getFish(true));
  }
  spawnChests();
}

export function spawnChests() {
  game.chests = [];
  const count = currentMap().id === 'bay' ? 1 : 2;
  for (let i = 0; i < count; i++) game.chests.push(getChest(true));
}

export function changeMap(id) {
  if (game.transition?.active) return;
  if (game.map === id) return;

  game.panel = null;

  game.transition = {
    active: true,
    phase: 'sailOut',
    t: 0,
    nextMap: id,
    boatX: 0
  };

  harpoon.status = 'still';
  harpoon.fish = null;
  harpoon.chest = null;
}

export function updateTransition(dt) {
  if (!game.transition.active) return;

  const delta = dt / 1000;
  const tr = game.transition;
  tr.t += delta;

  if (tr.phase === 'sailOut') {
    tr.boatX += 900 * delta;

    if (tr.t > 1.2) {
      tr.phase = 'black';
      tr.t = 0;
      tr.boatX = -W - 260;
    }
  } else if (tr.phase === 'black') {
    if (tr.t > 0.7) {
      game.map = tr.nextMap;
      spawnFish();
      save();

      tr.phase = 'sailIn';
      tr.t = 0;
    }
  } else if (tr.phase === 'sailIn') {
    tr.boatX += 900 * delta;

    if (tr.boatX >= 0) {
      game.transition = {
        active: false,
        phase: 'none',
        t: 0,
        nextMap: null,
        boatX: 0
      };

      msg(`Arrived: ${currentMap().name}`, W / 2, 120, '#fff16a');
    }
  }
}

export function update(dt) {
  for (const f of game.fish) f.move(dt);
  for (const c of game.chests) c.move(dt);
  updateHarpoon(dt);
  updateEffects(dt);
  updateTransition(dt);
}
