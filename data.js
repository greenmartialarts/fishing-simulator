export const maps = [
  { id: 'bay', name: 'Starter Bay', cost: 0, mult: 1, depth: '#1e90ff', sky1: '#86e1ff', sky2: '#2196f3', fishBonus: 0, rare: 0, desc: 'Balanced beginner waters.' },
  { id: 'reef', name: 'Coral Reef', cost: 150, mult: 1.1, depth: '#00a8a8', sky1: '#8ff8ff', sky2: '#03a9a9', fishBonus: 1, rare: 1, desc: 'More fish, better coin rewards.' },
  { id: 'deep', name: 'Deep Sea', cost: 400, mult: 1.2, depth: '#071a4a', sky1: '#23406d', sky2: '#081027', fishBonus: 1, rare: 2, desc: 'Dark water with expensive catches.' },
  { id: 'lava', name: 'Volcano Coast', cost: 1000, mult: 1.3, depth: '#b83220', sky1: '#ff9955', sky2: '#33100b', fishBonus: 2, rare: 3, desc: 'Dangerous water, huge profit.' },
  { id: 'ice', name: 'Frozen Abyss', cost: 2200, mult: 1.4, depth: '#7ee8ff', sky1: '#e8fbff', sky2: '#0d4064', fishBonus: 2, rare: 4, desc: 'Endgame map with elite fish.' },
  { id: 'mangrove', name: 'Mangrove Swamp', cost: 4500, mult: 1.5, depth: '#1f6b4a', sky1: '#9be7a1', sky2: '#154734', fishBonus: 3, rare: 5, desc: 'Thick swamp waters with strange fish.' },
  { id: 'crystal', name: 'Crystal Lagoon', cost: 9000, mult: 1.6, depth: '#5df2ff', sky1: '#d7ffff', sky2: '#26b6c9', fishBonus: 4, rare: 6, desc: 'Bright crystal water with shiny catches.' },
  { id: 'storm', name: 'Stormy Ocean', cost: 18000, mult: 1.7, depth: '#1d263b', sky1: '#5f6c86', sky2: '#101827', fishBonus: 4, rare: 7, desc: 'Rough waves and powerful fish.' },
  { id: 'jungle', name: 'Jungle River', cost: 35000, mult: 1.8, depth: '#0b8f5a', sky1: '#88ff88', sky2: '#0d5c36', fishBonus: 5, rare: 8, desc: 'Fast river full of rare jungle fish.' },
  { id: 'toxic', name: 'Toxic Marsh', cost: 65000, mult: 1.9, depth: '#7cff00', sky1: '#d4ff75', sky2: '#234d00', fishBonus: 6, rare: 9, desc: 'Glowing waters with dangerous rewards.' },
  { id: 'desert', name: 'Desert Oasis', cost: 120000, mult: 2, depth: '#1ecbe1', sky1: '#ffe29a', sky2: '#d88b35', fishBonus: 7, rare: 10, desc: 'Hidden oasis with valuable fish.' },
  { id: 'moon', name: 'Moonlit Tide', cost: 220000, mult: 2.1, depth: '#151a40', sky1: '#8d9bff', sky2: '#06091f', fishBonus: 8, rare: 11, desc: 'Night water with glowing moon fish.' },
  { id: 'void', name: 'Void Sea', cost: 400000, mult: 2.2, depth: '#090014', sky1: '#3b0a69', sky2: '#050008', fishBonus: 8, rare: 12, desc: 'Dark reality-bending waters.' },
  { id: 'heaven', name: 'Skyfall Waters', cost: 650000, mult: 2.3, depth: '#8ee7ff', sky1: '#ffffff', sky2: '#76b6ff', fishBonus: 9, rare: 13, desc: 'Floating ocean above the clouds.' },
  { id: 'galaxy', name: 'Galaxy Ocean', cost: 1000000, mult: 2.5, depth: '#12003b', sky1: '#bb8cff', sky2: '#020010', fishBonus: 10, rare: 15, desc: 'Final cosmic map with insane rewards.' }
];

export const mapEffects = {
  reef: { potionDurationMult: 1.2 },
  lava: { deepBonus: 0.15, deepY: 640 },
  ice: { harpoonSlow: 0.9, fishSlow: 0.92 },
  storm: { lightningChance: 0.002, surgeTime: 5000, surgeBonus: 0.12 },
  jungle: { streakWindowBonus: 600 },
  toxic: { fishAggro: 1.1 }
};

export const rods = [
  { id: 'wood', name: 'Wood Rod', cost: 0, power: 1, desc: 'Normal speed.' },
  { id: 'steel', name: 'Steel Rod', cost: 1200, power: 1.15, desc: '+15% harpoon speed.' },
  { id: 'gold', name: 'Gold Rod', cost: 25000, power: 1.25, desc: '+25% harpoon speed.' },
  { id: 'mythic', name: 'Mythic Rod', cost: 300000, power: 1.55, desc: '+55% harpoon speed.' }
];

export const fishTypesByMap = {
  bay: [
    { id: 1, name: 'Orange Minnow', value: 2, body: '#ff9f43', fin: '#ff6b35', chance: 58, size: 1, shape: 'round', pattern: 'none', tail: 'fork' },
    { id: 2, name: 'Blue Sardine', value: 4, body: '#48dbfb', fin: '#0abde3', chance: 28, size: 1, shape: 'long', pattern: 'stripe', tail: 'fork' },
    { id: 3, name: 'Purple Bass', value: 8, body: '#a55eea', fin: '#8854d0', chance: 11, size: 1.1, shape: 'tall', pattern: 'spot', tail: 'triangle' },
    { id: 4, name: 'Golden Bay Fish', value: 20, body: '#feca57', fin: '#ff9f43', chance: 2.5, size: 1.35, shape: 'tall', pattern: 'gold', tail: 'fork', golden: true },
    { id: 5, name: 'Rainbow Minnow', value: 60, body: '#ffffff', fin: '#70a1ff', chance: 0.5, size: 1.45, shape: 'round', pattern: 'rainbow', tail: 'fork', rainbow: true, glow: true }
  ],
  reef: [
    { id: 1, name: 'Coral Clownfish', value: 3, body: '#ff7675', fin: '#fd79a8', chance: 56, size: 1, shape: 'round', pattern: 'stripe', tail: 'fan' },
    { id: 2, name: 'Reef Tang', value: 6, body: '#00cec9', fin: '#0984e3', chance: 29, size: 1.05, shape: 'tall', pattern: 'dot', tail: 'fork' },
    { id: 3, name: 'Pink Angelfish', value: 12, body: '#fd79a8', fin: '#e84393', chance: 12, size: 1.15, shape: 'tall', pattern: 'finstripe', tail: 'fan' },
    { id: 4, name: 'Golden Coral Fish', value: 30, body: '#ffeaa7', fin: '#fdcb6e', chance: 2.5, size: 1.4, shape: 'tall', pattern: 'gold', tail: 'fork', golden: true },
    { id: 5, name: 'Rainbow Reef Fish', value: 90, body: '#ffffff', fin: '#a29bfe', chance: 0.5, size: 1.55, shape: 'round', pattern: 'rainbow', tail: 'fan', rainbow: true, glow: true }
  ],
  deep: [
    { id: 1, name: 'Deep Lanternfish', value: 5, body: '#2d3436', fin: '#74b9ff', chance: 55, size: 1, shape: 'long', pattern: 'glowdot', tail: 'fork', glow: true },
    { id: 2, name: 'Abyss Eel', value: 8, body: '#636e72', fin: '#0984e3', chance: 29, size: 1.2, shape: 'eel', pattern: 'line', tail: 'spike' },
    { id: 3, name: 'Shadow Tuna', value: 20, body: '#130f40', fin: '#5352ed', chance: 13, size: 1.35, shape: 'long', pattern: 'shadow', tail: 'fork' },
    { id: 4, name: 'Golden Abyss Fish', value: 40, body: '#f9ca24', fin: '#f0932b', chance: 2.5, size: 1.55, shape: 'shark', pattern: 'gold', tail: 'fork', golden: true },
    { id: 5, name: 'Rainbow Deep Fish', value: 180, body: '#ffffff', fin: '#686de0', chance: 0.5, size: 1.7, shape: 'eel', pattern: 'rainbow', tail: 'spike', rainbow: true, glow: true }
  ],
  lava: [
    { id: 1, name: 'Ember Fish', value: 6, body: '#ff6b35', fin: '#ee5253', chance: 54, size: 1, shape: 'round', pattern: 'lava', tail: 'triangle' },
    { id: 2, name: 'Magma Snapper', value: 8, body: '#ff4757', fin: '#c0392b', chance: 29, size: 1.15, shape: 'tall', pattern: 'crack', tail: 'triangle' },
    { id: 3, name: 'Volcano Pike', value: 25, body: '#b33939', fin: '#ff9f43', chance: 14, size: 1.35, shape: 'spiky', pattern: 'lava', tail: 'spike' },
    { id: 4, name: 'Golden Flame Fish', value: 100, body: '#feca57', fin: '#ff9f43', chance: 2.5, size: 1.6, shape: 'spiky', pattern: 'gold', tail: 'spike', golden: true },
    { id: 5, name: 'Rainbow Lava Fish', value: 375, body: '#ffffff', fin: '#ff6b81', chance: 0.5, size: 1.8, shape: 'spiky', pattern: 'rainbow', tail: 'spike', rainbow: true, glow: true }
  ],
  ice: [
    { id: 1, name: 'Frost Minnow', value: 8, body: '#dff9fb', fin: '#7ed6df', chance: 54, size: 1, shape: 'round', pattern: 'ice', tail: 'fork' },
    { id: 2, name: 'Ice Trout', value: 15, body: '#c7ecee', fin: '#22a6b3', chance: 29, size: 1.15, shape: 'long', pattern: 'ice', tail: 'fork' },
    { id: 3, name: 'Frozen Shark', value: 30, body: '#95afc0', fin: '#535c68', chance: 14, size: 1.55, shape: 'shark', pattern: 'ice', tail: 'fork' },
    { id: 4, name: 'Golden Ice Fish', value: 150, body: '#f6e58d', fin: '#f9ca24', chance: 2.5, size: 1.65, shape: 'tall', pattern: 'gold', tail: 'fork', golden: true },
    { id: 5, name: 'Rainbow Frost Fish', value: 600, body: '#ffffff', fin: '#badc58', chance: 0.5, size: 1.9, shape: 'long', pattern: 'rainbow', tail: 'fork', rainbow: true, glow: true }
  ],
  mangrove: [
    { id: 1, name: 'Swamp Guppy', value: 10, body: '#55efc4', fin: '#00b894', chance: 53, size: 1, shape: 'round', pattern: 'leaf', tail: 'fan' },
    { id: 2, name: 'Mud Catfish', value: 25, body: '#6ab04c', fin: '#badc58', chance: 30, size: 1.2, shape: 'eel', pattern: 'mud', tail: 'round' },
    { id: 3, name: 'Vine Bass', value: 50, body: '#218c74', fin: '#33d9b2', chance: 14, size: 1.35, shape: 'tall', pattern: 'leaf', tail: 'fan' },
    { id: 4, name: 'Golden Swamp Fish', value: 200, body: '#f9ca24', fin: '#f0932b', chance: 2.5, size: 1.65, shape: 'tall', pattern: 'gold', tail: 'fork', golden: true },
    { id: 5, name: 'Rainbow Mangrove Fish', value: 750, body: '#ffffff', fin: '#00cec9', chance: 0.5, size: 1.9, shape: 'eel', pattern: 'rainbow', tail: 'round', rainbow: true, glow: true }
  ],
  crystal: [
    { id: 1, name: 'Crystal Minnow', value: 15, body: '#81ecec', fin: '#00cec9', chance: 52, size: 1, shape: 'round', pattern: 'crystal', tail: 'fork' },
    { id: 2, name: 'Glassfin', value: 35, body: '#dff9fb', fin: '#7ed6df', chance: 30, size: 1.15, shape: 'tall', pattern: 'crystal', tail: 'fan' },
    { id: 3, name: 'Diamond Bass', value: 70, body: '#74b9ff', fin: '#0984e3', chance: 13, size: 1.4, shape: 'spiky', pattern: 'crystal', tail: 'fork' },
    { id: 4, name: 'Golden Crystal Fish', value: 300, body: '#ffeaa7', fin: '#fdcb6e', chance: 4, size: 1.7, shape: 'spiky', pattern: 'gold', tail: 'fork', golden: true },
    { id: 5, name: 'Rainbow Crystal Fish', value: 1200, body: '#ffffff', fin: '#a29bfe', chance: 1, size: 1.95, shape: 'spiky', pattern: 'rainbow', tail: 'fork', rainbow: true, glow: true }
  ],
  storm: [
    { id: 1, name: 'Storm Minnow', value: 20, body: '#636e72', fin: '#74b9ff', chance: 52, size: 1, shape: 'long', pattern: 'bolt', tail: 'fork' },
    { id: 2, name: 'Thunder Eel', value: 50, body: '#2d3436', fin: '#ffeaa7', chance: 30, size: 1.25, shape: 'eel', pattern: 'bolt', tail: 'spike' },
    { id: 3, name: 'Lightning Marlin', value: 100, body: '#5352ed', fin: '#f9ca24', chance: 13, size: 1.55, shape: 'shark', pattern: 'bolt', tail: 'fork' },
    { id: 4, name: 'Golden Storm Fish', value: 400, body: '#feca57', fin: '#ff9f43', chance: 4, size: 1.75, shape: 'shark', pattern: 'gold', tail: 'fork', golden: true },
    { id: 5, name: 'Rainbow Storm Fish', value: 2000, body: '#ffffff', fin: '#686de0', chance: 1, size: 2, shape: 'eel', pattern: 'rainbow', tail: 'spike', rainbow: true, glow: true }
  ],
  jungle: [
    { id: 1, name: 'Jungle Guppy', value: 30, body: '#badc58', fin: '#6ab04c', chance: 52, size: 1, shape: 'round', pattern: 'leaf', tail: 'fan' },
    { id: 2, name: 'Leaf Snapper', value: 70, body: '#55efc4', fin: '#00b894', chance: 30, size: 1.2, shape: 'tall', pattern: 'leaf', tail: 'fan' },
    { id: 3, name: 'Tiger Bass', value: 150, body: '#f0932b', fin: '#eb4d4b', chance: 13, size: 1.45, shape: 'long', pattern: 'tiger', tail: 'fork' },
    { id: 4, name: 'Golden Jungle Fish', value: 500, body: '#f9ca24', fin: '#f0932b', chance: 4, size: 1.75, shape: 'tall', pattern: 'gold', tail: 'fork', golden: true },
    { id: 5, name: 'Rainbow Jungle Fish', value: 2500, body: '#ffffff', fin: '#badc58', chance: 1, size: 2, shape: 'long', pattern: 'rainbow', tail: 'fork', rainbow: true, glow: true }
  ],
  toxic: [
    { id: 1, name: 'Toxic Minnow', value: 40, body: '#7cff00', fin: '#badc58', chance: 51, size: 1, shape: 'round', pattern: 'toxic', tail: 'triangle', glow: true },
    { id: 2, name: 'Acid Eel', value: 100, body: '#b8ff00', fin: '#44bd32', chance: 31, size: 1.25, shape: 'eel', pattern: 'toxic', tail: 'round', glow: true },
    { id: 3, name: 'Mutant Bass', value: 180, body: '#009432', fin: '#A3CB38', chance: 13, size: 1.55, shape: 'spiky', pattern: 'toxic', tail: 'spike', glow: true },
    { id: 4, name: 'Golden Toxic Fish', value: 600, body: '#f9ca24', fin: '#f0932b', chance: 4, size: 1.8, shape: 'spiky', pattern: 'gold', tail: 'spike', golden: true },
    { id: 5, name: 'Rainbow Toxic Fish', value: 3000, body: '#ffffff', fin: '#7cff00', chance: 1, size: 2.05, shape: 'eel', pattern: 'rainbow', tail: 'round', rainbow: true, glow: true }
  ],
  desert: [
    { id: 1, name: 'Oasis Minnow', value: 50, body: '#1ecbe1', fin: '#22a6b3', chance: 51, size: 1, shape: 'round', pattern: 'wave', tail: 'fork' },
    { id: 2, name: 'Sandscale Fish', value: 110, body: '#f6e58d', fin: '#e1b12c', chance: 31, size: 1.2, shape: 'tall', pattern: 'sand', tail: 'fan' },
    { id: 3, name: 'Mirage Ray', value: 210, body: '#ffbe76', fin: '#f0932b', chance: 13, size: 1.55, shape: 'ray', pattern: 'sand', tail: 'whip' },
    { id: 4, name: 'Golden Oasis Fish', value: 700, body: '#feca57', fin: '#ff9f43', chance: 4, size: 1.85, shape: 'ray', pattern: 'gold', tail: 'whip', golden: true },
    { id: 5, name: 'Rainbow Oasis Fish', value: 3750, body: '#ffffff', fin: '#00cec9', chance: 1, size: 2.1, shape: 'ray', pattern: 'rainbow', tail: 'whip', rainbow: true, glow: true }
  ],
  moon: [
    { id: 1, name: 'Moon Minnow', value: 55, body: '#dcdde1', fin: '#7f8fa6', chance: 51, size: 1, shape: 'round', pattern: 'moon', tail: 'fork' },
    { id: 2, name: 'Lunar Eel', value: 120, body: '#9c88ff', fin: '#8c7ae6', chance: 31, size: 1.25, shape: 'eel', pattern: 'moon', tail: 'spike', glow: true },
    { id: 3, name: 'Star Bass', value: 280, body: '#273c75', fin: '#fbc531', chance: 13, size: 1.55, shape: 'tall', pattern: 'star', tail: 'fan' },
    { id: 4, name: 'Golden Moon Fish', value: 900, body: '#f9ca24', fin: '#f0932b', chance: 4, size: 1.85, shape: 'tall', pattern: 'gold', tail: 'fan', golden: true },
    { id: 5, name: 'Rainbow Moon Fish', value: 4500, body: '#ffffff', fin: '#9c88ff', chance: 1, size: 2.15, shape: 'eel', pattern: 'rainbow', tail: 'spike', rainbow: true, glow: true }
  ],
  void: [
    { id: 1, name: 'Void Minnow', value: 70, body: '#2c003e', fin: '#5f27cd', chance: 50, size: 1, shape: 'long', pattern: 'void', tail: 'spike' },
    { id: 2, name: 'Dark Matter Eel', value: 160, body: '#130f40', fin: '#341f97', chance: 31, size: 1.3, shape: 'eel', pattern: 'void', tail: 'spike', glow: true },
    { id: 3, name: 'Blackhole Shark', value: 380, body: '#000000', fin: '#6c5ce7', chance: 14, size: 1.7, shape: 'shark', pattern: 'star', tail: 'fork' },
    { id: 4, name: 'Golden Void Fish', value: 1200, body: '#feca57', fin: '#ff9f43', chance: 4, size: 1.9, shape: 'shark', pattern: 'gold', tail: 'fork', golden: true },
    { id: 5, name: 'Rainbow Void Fish', value: 6000, body: '#ffffff', fin: '#5f27cd', chance: 1, size: 2.2, shape: 'eel', pattern: 'rainbow', tail: 'spike', rainbow: true, glow: true }
  ],
  heaven: [
    { id: 1, name: 'Cloud Minnow', value: 100, body: '#ffffff', fin: '#74b9ff', chance: 50, size: 1, shape: 'round', pattern: 'cloud', tail: 'fan' },
    { id: 2, name: 'Angel Fish', value: 250, body: '#dff9fb', fin: '#f6e58d', chance: 31, size: 1.25, shape: 'tall', pattern: 'cloud', tail: 'fan', glow: true },
    { id: 3, name: 'Sky Whale', value: 500, body: '#7ed6df', fin: '#22a6b3', chance: 14, size: 1.8, shape: 'whale', pattern: 'wave', tail: 'whale' },
    { id: 4, name: 'Golden Heaven Fish', value: 2000, body: '#ffeaa7', fin: '#fdcb6e', chance: 4, size: 2, shape: 'whale', pattern: 'gold', tail: 'whale', golden: true },
    { id: 5, name: 'Rainbow Heaven Fish', value: 10000, body: '#ffffff', fin: '#ff9ff3', chance: 1, size: 2.25, shape: 'angel', pattern: 'rainbow', tail: 'fan', rainbow: true, glow: true }
  ],
  galaxy: [
    { id: 1, name: 'Galaxy Minnow', value: 150, body: '#6c5ce7', fin: '#a29bfe', chance: 50, size: 1, shape: 'round', pattern: 'star', tail: 'fork', glow: true },
    { id: 2, name: 'Nebula Eel', value: 300, body: '#e84393', fin: '#fd79a8', chance: 31, size: 1.3, shape: 'eel', pattern: 'galaxy', tail: 'spike', glow: true },
    { id: 3, name: 'Cosmic Shark', value: 650, body: '#0984e3', fin: '#00cec9', chance: 14, size: 1.8, shape: 'shark', pattern: 'star', tail: 'fork', glow: true },
    { id: 4, name: 'Golden Galaxy Fish', value: 2500, body: '#feca57', fin: '#ff9f43', chance: 4, size: 2, shape: 'shark', pattern: 'gold', tail: 'fork', golden: true },
    { id: 5, name: 'Rainbow Galaxy Fish', value: 12500, body: '#ffffff', fin: '#a29bfe', chance: 1, size: 2.35, shape: 'angel', pattern: 'rainbow', tail: 'fan', rainbow: true, glow: true }
  ]
};
