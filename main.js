import { W, H } from './constants.js';
import { game, load, save, reset } from './state.js';
import { initRender, drawFish, drawTreasureChest, drawBackground, drawBoat, drawHarpoon, drawEffects, drawHazards, drawTransition } from './render.js';
import { initUi, drawHUD, drawPanel, getButtons } from './ui.js';
import { harpoon, spawnFish, spawnChests, update, updateHarpoon, launch } from './gameplay.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

initRender(ctx, canvas);
initUi(ctx);

load();
if (!game.fish || game.fish.length === 0) spawnFish();
if (!game.chests || game.chests.length === 0) spawnChests();

function canvasToGame(e) {
  const r = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - r.left) * (canvas.width / r.width),
    y: (e.clientY - r.top) * (canvas.height / r.height)
  };
}

canvas.addEventListener('mousemove', (e) => {
  const p = canvasToGame(e);
  game.mouseX = p.x;
  game.mouseY = p.y;
});

canvas.addEventListener('mousedown', (e) => {
  const p = canvasToGame(e);
  // Check all visible buttons first (HUD or panel)
  const buttons = getButtons();
  for (const b of buttons) {
    if (b.hit && b.hit(p.x, p.y)) {
      b.fn && b.fn();
      return;
    }
  }

  // If a panel is open and click didn't hit a button, close it
  if (game.panel) {
    game.panel = null;
    return;
  }

  // Otherwise, launch the harpoon as normal
  launch();
});

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    launch();
  }
  if (e.key === 'r' || e.key === 'R') reset();
});

canvas.addEventListener('wheel', (e) => {
  if (game.panel === 'maps') {
    game.mapScroll = (game.mapScroll || 0) + e.deltaY;
  }
  if (game.panel === 'collection') {
    game.collectionScroll = (game.collectionScroll || 0) + e.deltaY;
  }
});

function draw(dt) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground(dt);
  drawBoat();

  // draw chests and fish
  for (const c of game.chests) drawTreasureChest(c);
  for (const f of game.fish) drawFish(f);

  drawHarpoon(harpoon);
  drawEffects();
  drawHazards();
  drawHUD();
  drawPanel();
  drawTransition();
}

function loop(ts) {
  const dt = ts - (game.last || ts);
  game.last = ts;
  update(dt);
  updateHarpoon(dt);
  draw(dt);
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
