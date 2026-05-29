import { W, H } from './constants.js';
import { maps, rods, fishTypesByMap } from './data.js';
import { game, currentMap, save } from './state.js';
import { changeMap, msg } from './gameplay.js';
import { clamp, roundRect, text } from './utils.js';
import { traceFishBody, drawTailShape, drawFishPattern } from './render.js';

let ctx = null;
let hudBaseCanvas = null;
let hudBaseCtx = null;
let buttons = [];

class Button {
  constructor(x, y, w, h, label, fn) {
    Object.assign(this, { x, y, w, h, label, fn });
  }
  hit(mx, my) {
    return mx >= this.x && mx <= this.x + this.w && my >= this.y && my <= this.y + this.h;
  }
  draw(color = '#0984e3') {
    roundRect(ctx, this.x, this.y, this.w, this.h, 16, color, 'rgba(255,255,255,.65)', 3);
    text(ctx, this.label, this.x + this.w / 2, this.y + this.h / 2, 24, 'center');
  }
}

export function initUi(nextCtx) {
  ctx = nextCtx;
  hudBaseCanvas = document.createElement('canvas');
  hudBaseCanvas.width = W;
  hudBaseCanvas.height = H;
  hudBaseCtx = hudBaseCanvas.getContext('2d');
  renderHudBase();
}

function renderHudBase() {
  if (!hudBaseCtx) return;

  hudBaseCtx.clearRect(0, 0, W, H);

  roundRect(
    hudBaseCtx,
    14,
    14,
    470,
    150,
    20,
    'rgba(0,0,0,.38)',
    'rgba(255,255,255,.22)',
    2
  );

  const rightX = W - 330;
  const panelW = 300;
  roundRect(
    hudBaseCtx,
    rightX,
    14,
    panelW + 20,
    168,
    16,
    'rgba(0,0,0,.30)',
    'rgba(255,255,255,.12)',
    1.2
  );

  roundRect(
    hudBaseCtx,
    rightX + 12,
    44,
    panelW + 4,
    26,
    8,
    'rgba(255,255,255,.05)',
    'rgba(255,255,255,.10)',
    1
  );
}

export function resetButtons() {
  buttons = [];
}

export function getButtons() {
  return buttons;
}

function addButton(x, y, w, h, label, fn) {
  const b = new Button(x, y, w, h, label, fn);
  buttons.push(b);
  return b;
}

export function drawHUD() {
  resetButtons();

  ctx.drawImage(hudBaseCanvas, 0, 0);

  text(ctx, currentMap().name, 34, 42, 28, 'left', '#9effff');

  text(ctx, `Coins: ${Math.floor(game.coins)}`, 34, 78, 24);
  text(ctx, `Score: ${game.score}`, 34, 108, 22);
  text(ctx, `Gems: ${game.gems || 0}`, 34, 138, 22, 'left', '#74b9ff');

  text(ctx, `Caught: ${game.caught}`, 300, 78, 20, 'left', '#dfe6e9');
  text(ctx, `Combo: ${game.combo.toFixed(1)}x`, 300, 108, 22, 'left', '#fff16a');
  text(ctx, `Streak: ${game.streak}`, 300, 138, 20, 'left', '#feca57');

  const rightX = W - 330;
  const panelW = 300;

  const activePotions = Object.entries(game.potions)
    .filter(([_, v]) => v > 0)
    .map(([k, v]) => `${k} ${Math.ceil(v / 1000)}s`);

  if (game.hazards.surge > 0) {
    activePotions.push(`surge ${Math.ceil(game.hazards.surge / 1000)}s`);
  }

  text(ctx, 'Potions', rightX + 14, 34, 16, 'left', '#ffdd59');
  text(
    ctx,
    activePotions.length ? activePotions.join(' • ') : 'none',
    rightX + panelW / 2,
    62,
    13,
    'center',
    activePotions.length ? '#ffdd59' : '#777'
  );

  const gap = 8;
  const btnH = 32;
  const cols = 3;
  const innerW = panelW - 24;
  const btnW = (innerW - gap * (cols - 1)) / cols;
  const x0 = rightX + 12;
  const y1 = 92;

  addButton(x0 + (btnW + gap) * 0, y1, btnW, btnH, 'Shop', () => (game.panel = 'shop')).draw('#0fbcf9');
  addButton(x0 + (btnW + gap) * 1, y1, btnW, btnH, 'Maps', () => (game.panel = 'maps')).draw('#00cec9');
  addButton(x0 + (btnW + gap) * 2, y1, btnW, btnH, 'Quest', () => (game.panel = 'quests')).draw('#55efc4');

  const cols2 = 3;
  const btnW2 = (innerW - gap * (cols2 - 1)) / cols2;
  const y2 = 128;

  addButton(x0 + (btnW2 + gap) * 0, y2, btnW2, btnH, 'Bait', () => (game.panel = 'bait')).draw('#a29bfe');
  addButton(x0 + (btnW2 + gap) * 1, y2, btnW2, btnH, 'Rods', () => (game.panel = 'rods')).draw('#fdcb6e');
  addButton(x0 + (btnW2 + gap) * 2, y2, btnW2 + 20, btnH, 'Catches', () => (game.panel = 'collection')).draw('#e17055');
}

export function drawPanel() {
  if (!game.panel) return;

  ctx.fillStyle = 'rgba(0,0,0,.45)';
  ctx.fillRect(0, 0, W, H);
  roundRect(ctx, 175, 95, 1160, 670, 30, '#102a43', 'rgba(255,255,255,.55)', 5);
  addButton(1250, 120, 58, 58, 'X', () => (game.panel = null)).draw('#ff4757');
  text(ctx, game.panel.toUpperCase(), W / 2, 145, 48, 'center');

  if (game.panel === 'shop') drawShopPanel();
  if (game.panel === 'maps') drawMapsPanel();
  if (game.panel === 'rods') drawRodsPanel();
  if (game.panel === 'bait') drawBaitPanel();
  if (game.panel === 'quests') drawQuestsPanel();
  if (game.panel === 'collection') drawCollectionPanel();
}

function buy(cost, fn) {
  if (game.coins >= cost) {
    game.coins -= cost;
    fn();
    save();
    return true;
  }
  msg('Not enough coins', W / 2, 100, '#ff7675');
  return false;
}

function buyGems(cost, fn) {
  if (game.gems >= cost) {
    game.gems -= cost;
    fn();
    save();
    return true;
  }
  msg('Not enough gems', W / 2, 100, '#9effff');
  return false;
}

function upgradeGemCost(lvl, max) {
  return Math.ceil(1 + lvl * (9 / Math.max(1, max - 1)));
}

function drawShopPanel() {
  text(ctx, 'Shop upgrades use gems now. Early upgrades are cheap; final upgrade costs 10 gems.', W / 2, 188, 19, 'center', '#9effff');

  const ups = [
    ['speed', 'Harpoon Speed', `Level ${game.upgrades.speed}/8`],
    ['rope', 'Longer Rope', `Level ${game.upgrades.rope}/6`],
    ['luck', 'Better Luck', `Level ${game.upgrades.luck}/7`],
    ['magnet', 'Coin Magnet', `Level ${game.upgrades.magnet}/5`]
  ];

  ups.forEach((u, i) => {
    const y = 225 + i * 105;
    const lvl = game.upgrades[u[0]];
    const max = u[0] === 'speed' ? 8 : u[0] === 'rope' ? 6 : u[0] === 'luck' ? 7 : 5;
    const cost = upgradeGemCost(lvl, max);

    roundRect(ctx, 255, y, 1000, 82, 18, 'rgba(255,255,255,.10)', 'rgba(255,255,255,.2)', 2);
    text(ctx, u[1], 285, y + 28, 28);
    text(ctx, lvl >= max ? 'MAX' : `${u[2]} • Cost ${cost} gem${cost === 1 ? '' : 's'}`, 285, y + 58, 20, 'left', '#dfe6e9');

    addButton(
      1040,
      y + 16,
      170,
      50,
      lvl >= max ? 'MAX' : 'Buy',
      () => {
        if (lvl < max) buyGems(cost, () => game.upgrades[u[0]]++);
      }
    ).draw(lvl >= max ? '#636e72' : '#2ed573');
  });
}

function drawMapsPanel() {
  const cardH = 100;
  const gap = 14;
  const panelX = 200;
  const panelY = 170;
  const panelW = 1160;
  const panelH = 590;
  const startX = 240;
  const startY = 190;

  const contentH = maps.length * (cardH + gap) - gap;
  const maxScroll = Math.max(0, contentH - panelH + 120);

  game.mapScroll = clamp(game.mapScroll || 0, 0, maxScroll);

  ctx.save();
  ctx.beginPath();
  ctx.rect(panelX, panelY, panelW, panelH);
  ctx.clip();

  maps.forEach((m, i) => {
    const y = startY + i * (cardH + gap) - game.mapScroll;
    if (y + cardH < panelY || y > panelY + panelH) return;

    const unlocked = game.unlockedMaps[m.id];
    const active = game.map === m.id;

    roundRect(
      ctx,
      startX,
      y,
      1040,
      cardH,
      18,
      active ? 'rgba(46,213,115,.20)' : 'rgba(255,255,255,.08)',
      'rgba(255,255,255,.18)',
      2
    );

    text(ctx, m.name, startX + 20, y + 38, 26);
    text(ctx, `${m.mult}x coins • ${m.desc}`, startX + 20, y + 70, 16, 'left', '#dfe6e9');

    const label = active ? 'Equipped' : unlocked ? 'Equip' : `Buy ${m.cost}`;

    addButton(
      startX + 880,
      y + 30,
      140,
      40,
      label,
      () => {
        if (unlocked) {
          changeMap(m.id);
          save();
        } else {
          buy(m.cost, () => {
            game.unlockedMaps[m.id] = true;
            changeMap(m.id);
            save();
          });
        }
      }
    ).draw(active ? '#636e72' : '#00cec9');
  });

  ctx.restore();

  if (maxScroll > 0) {
    const barX = panelX + panelW - 14;
    const barY = panelY + 20;
    const barH = panelH - 40;
    const thumbH = Math.max(40, barH * (panelH / contentH));
    const scrollRatio = game.mapScroll / maxScroll;
    const thumbY = barY + (barH - thumbH) * scrollRatio;

    roundRect(ctx, barX, barY, 6, barH, 3, 'rgba(255,255,255,.08)');
    roundRect(ctx, barX, thumbY, 6, thumbH, 3, '#00cec9');
  }
}

function drawRodsPanel() {
  rods.forEach((r, i) => {
    const y = 220 + i * 105;
    const unlocked = game.unlockedRods[r.id];
    const active = game.rod === r.id;

    roundRect(ctx, 270, y, 970, 82, 18, active ? 'rgba(253,203,110,.28)' : 'rgba(255,255,255,.10)', 'rgba(255,255,255,.2)', 2);
    text(ctx, r.name, 300, y + 28, 28);
    text(ctx, `${r.desc} • Power ${r.power}x`, 300, y + 58, 18, 'left', '#dfe6e9');

    const label = active ? 'Equipped' : unlocked ? 'Equip' : `Buy ${r.cost}`;
    addButton(1020, y + 16, 180, 50, label, () => {
      if (unlocked) {
        game.rod = r.id;
        save();
      } else {
        buy(r.cost, () => {
          game.unlockedRods[r.id] = true;
          game.rod = r.id;
        });
      }
    }).draw(active ? '#636e72' : '#fdcb6e');
  });
}

function drawBaitPanel() {
  text(ctx, 'Bait boosts rare fish for the next 30 seconds.', W / 2, 230, 26, 'center', '#dfe6e9');
  roundRect(ctx, 380, 295, 750, 170, 24, 'rgba(255,255,255,.10)', 'rgba(255,255,255,.25)', 2);
  text(ctx, 'Lucky Bait', W / 2, 340, 34, 'center');
  text(ctx, 'Cost: 350 coins • +rare fish chance', W / 2, 390, 22, 'center', '#dfe6e9');
  addButton(620, 420, 270, 58, game.baitActive ? 'Active' : 'Buy + Use', () => {
    if (!game.baitActive) buy(350, () => {
      game.baitActive = true;
      setTimeout(() => (game.baitActive = false), 30000);
    });
  }).draw(game.baitActive ? '#636e72' : '#a29bfe');
}

function drawQuestsPanel() {
  const boxH = 82;
  const gap = 14;
  const startY = 230;

  game.quests.forEach((q, i) => {
    const y = startY + i * (boxH + gap);

    roundRect(ctx, 300, y, 900, boxH, 18, q.done ? 'rgba(46,213,115,.25)' : 'rgba(255,255,255,.10)', 'rgba(255,255,255,.22)', 2);

    text(ctx, q.text, 330, y + 28, 28);
    text(ctx, q.done ? 'Completed • Reward claimed' : `Reward: ${q.reward} coins`, 330, y + 58, 20, 'left', '#dfe6e9');

    text(ctx, q.done ? 'DONE' : 'ACTIVE', 1110, y + 42, 24, 'center', q.done ? '#7bed9f' : '#fff16a');
  });
}

function drawCollectionPanel() {
  const cardW = 320;
  const cardH = 170;
  const gap = 18;
  const panelX = 175;
  const panelY = 160;
  const panelW = 1160;
  const panelH = 600;
  const startX = 240;
  const startY = 200;

  const grouped = {};
  for (const mapId in fishTypesByMap) {
    grouped[mapId] = fishTypesByMap[mapId];
  }

  const mapIds = Object.keys(grouped);

  let contentH = 0;
  for (const id of mapIds) {
    contentH += 60;
    contentH += Math.ceil(grouped[id].length / 3) * (cardH + gap);
  }

  const maxScroll = Math.max(0, contentH - panelH + 750);
  game.collectionScroll = clamp(game.collectionScroll || 0, 0, maxScroll);

  ctx.save();
  ctx.beginPath();
  ctx.rect(panelX, panelY, panelW, panelH);
  ctx.clip();

  let yOffset = startY - game.collectionScroll;

  for (const mapId of mapIds) {
    const mapFish = grouped[mapId];

    yOffset += 40;
    text(ctx, maps.find((m) => m.id === mapId)?.name || mapId.toUpperCase(), startX, yOffset, 28, 'left', '#81ecec');
    yOffset += 30;

    const cols = 3;

    mapFish.forEach((f, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * 360;
      const y = yOffset + row * (cardH + gap);
      const caught = game.collection[f.name];

      if (y + cardH < panelY || y > panelY + panelH) return;

      roundRect(ctx, x, y, cardW, cardH, 18, caught ? 'rgba(46,213,115,.18)' : 'rgba(255,255,255,.08)', 'rgba(255,255,255,.18)', 2);

      ctx.save();
      const fx = x + cardW / 2;
      const fy = y + 70;
      ctx.translate(fx, fy);

      if (caught) {
        const scale = 0.65;
        ctx.scale(scale, scale);
        ctx.fillStyle = f.body || '#fff';
        traceFishBody(f.shape || 'round', 220, 120);
        ctx.fill();
        drawTailShape(f.tail || 'fork', 220, 120, f.fin || '#fff');
        drawFishPattern(f.pattern || 'none', 220, 120);

        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(60, -20, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(62, -20, 3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = 'rgba(255,255,255,.25)';
        ctx.font = '44px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('???', 0, 0);
      }

      ctx.restore();

      text(ctx, caught ? f.name : 'Unknown Fish', x + 20, y + 140, 22, 'left', caught ? '#fff' : '#777');
      text(
        ctx,
        caught ? 'Caught' : 'Location: ' + (maps.find((m) => m.id === mapId)?.name || 'Unknown'),
        x + 20,
        y + 160,
        16,
        'left',
        caught ? '#7bed9f' : '#999'
      );
    });

    const rows = Math.ceil(mapFish.length / 3);
    yOffset += rows * (cardH + gap) + 40;
  }

  ctx.restore();

  if (maxScroll > 0) {
    const barX = panelX + panelW + 40;
    const barY = panelY + 20;
    const barH = panelH - 100;
    const thumbH = Math.max(40, barH * (panelH / contentH));
    const scrollRatio = game.collectionScroll / maxScroll;
    const thumbY = barY + (barH - thumbH) * scrollRatio;

    roundRect(ctx, barX, barY, 6, barH, 3, 'rgba(255,255,255,.08)');
    roundRect(ctx, barX, thumbY, 6, thumbH, 3, '#e17055');
  }
}
