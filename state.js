import { maps, rods } from './data.js';

export const game = {
  coins: 0,
  gems: 0,
  score: 0,
  caught: 0,
  bestCatch: 'None',
  map: 'bay',
  rod: 'wood',
  bait: 0,
  baitActive: false,
  unlockedMaps: { bay: true },
  unlockedRods: { wood: true },
  shopTab: 'upgrades',
  panel: null,
  mouseX: 750,
  mouseY: 430,
  last: 0,
  wave: 0,
  shake: 0,
  combo: 1,
  comboTimer: 0,
  streak: 0,
  streakTimer: 0,
  potions: { luck: 0, speed: 0, coin: 0 },
  hazards: { lightning: null, surge: 0 },
  transition: { active: false, phase: 'none', t: 0, nextMap: null, boatX: 0 },
  upgrades: { speed: 0, rope: 0, luck: 0, magnet: 0 },
  quests: [
    { text: 'Catch 10 fish', goal: 10, type: 'caught', reward: 250, done: false },
    { text: 'Reach max combo level', goal: 2, type: 'combo', reward: 500, done: false },
    { text: 'Catch a rainbow fish', goal: 1, type: 'legend', reward: 1000, done: false },
    { text: 'Catch 100 fish', goal: 100, type: 'catches', reward: 5000, done: false },
    { text: 'Catch 1000 fish', goal: 1000, type: 'lotofcatches', reward: 50000, done: false }
  ],
  collection: {},
  messages: [],
  particles: [],
  fish: [],
  chests: [],
  mapScroll: 0,
  collectionScroll: 0
};

export function save() {
  localStorage.setItem(
    'fishingEmpireSave',
    JSON.stringify({
      coins: game.coins,
      gems: game.gems,
      score: game.score,
      caught: game.caught,
      bestCatch: game.bestCatch,
      map: game.map,
      rod: game.rod,
      unlockedMaps: game.unlockedMaps,
      unlockedRods: game.unlockedRods,
      upgrades: game.upgrades,
      quests: game.quests,
      collection: game.collection
    })
  );
}

export function load() {
  try {
    const s = JSON.parse(localStorage.getItem('fishingEmpireSave') || '{}');
    Object.assign(game, s);
    game.messages = [];
    game.particles = [];
    game.fish = [];
    game.chests = [];
    game.potions = { luck: 0, speed: 0, coin: 0 };
    game.hazards = { lightning: null, surge: 0 };
  } catch (e) {
    return;
  }
}

export function reset() {
  localStorage.removeItem('fishingEmpireSave');
  location.reload();
}

export function currentMap() {
  return maps.find((m) => m.id === game.map);
}

export function currentRod() {
  return rods.find((r) => r.id === game.rod);
}
