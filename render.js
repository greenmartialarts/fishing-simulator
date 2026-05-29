import { W, H } from './constants.js';
import { game, currentMap } from './state.js';
import { irand, clamp, roundRect, text } from './utils.js';

let ctx = null;
let canvas = null;

export function initRender(nextCtx, nextCanvas) {
  ctx = nextCtx;
  canvas = nextCanvas;
}

function fishGradient(f, w, h) {
  if (f.rainbow) {
    const g = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
    g.addColorStop(0, '#ff4757');
    g.addColorStop(0.2, '#ffa502');
    g.addColorStop(0.4, '#2ed573');
    g.addColorStop(0.6, '#1e90ff');
    g.addColorStop(0.8, '#a55eea');
    g.addColorStop(1, '#ff6b81');
    return g;
  }
  const g = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  g.addColorStop(0, 'white');
  g.addColorStop(0.2, f.body);
  g.addColorStop(1, f.fin);
  return g;
}

export function traceFishBody(shape, w, h) {
  ctx.beginPath();

  if (shape === 'long') {
    ctx.ellipse(0, 0, w * 0.5, h * 0.32, 0, 0, Math.PI * 2);
  } else if (shape === 'tall') {
    ctx.ellipse(-w * 0.03, 0, w * 0.4, h * 0.48, 0, 0, Math.PI * 2);
  } else if (shape === 'eel') {
    ctx.moveTo(-w * 0.5, -h * 0.18);
    ctx.quadraticCurveTo(-w * 0.15, -h * 0.35, w * 0.42, -h * 0.14);
    ctx.quadraticCurveTo(w * 0.56, 0, w * 0.42, h * 0.14);
    ctx.quadraticCurveTo(-w * 0.15, h * 0.35, -w * 0.5, h * 0.18);
    ctx.quadraticCurveTo(-w * 0.6, 0, -w * 0.5, -h * 0.18);
  } else if (shape === 'shark') {
    ctx.moveTo(-w * 0.48, 0);
    ctx.quadraticCurveTo(-w * 0.15, -h * 0.44, w * 0.25, -h * 0.22);
    ctx.lineTo(w * 0.52, -h * 0.05);
    ctx.lineTo(w * 0.56, 0);
    ctx.lineTo(w * 0.52, h * 0.05);
    ctx.lineTo(w * 0.25, h * 0.22);
    ctx.quadraticCurveTo(-w * 0.15, h * 0.44, -w * 0.48, 0);
  } else if (shape === 'ray') {
    ctx.moveTo(-w * 0.4, 0);
    ctx.quadraticCurveTo(-w * 0.15, -h * 0.5, w * 0.25, -h * 0.22);
    ctx.quadraticCurveTo(w * 0.4, 0, w * 0.25, h * 0.22);
    ctx.quadraticCurveTo(-w * 0.15, h * 0.5, -w * 0.4, 0);
  } else if (shape === 'whale') {
    ctx.ellipse(-w * 0.02, 0, w * 0.5, h * 0.38, 0, 0, Math.PI * 2);
  } else if (shape === 'angel') {
    ctx.moveTo(-w * 0.35, 0);
    ctx.quadraticCurveTo(-w * 0.15, -h * 0.55, w * 0.18, -h * 0.28);
    ctx.quadraticCurveTo(w * 0.45, 0, w * 0.18, h * 0.28);
    ctx.quadraticCurveTo(-w * 0.15, h * 0.55, -w * 0.35, 0);
  } else if (shape === 'spiky') {
    ctx.moveTo(-w * 0.45, 0);
    ctx.lineTo(-w * 0.2, -h * 0.42);
    ctx.lineTo(0, -h * 0.3);
    ctx.lineTo(w * 0.25, -h * 0.18);
    ctx.lineTo(w * 0.46, 0);
    ctx.lineTo(w * 0.25, h * 0.18);
    ctx.lineTo(0, h * 0.3);
    ctx.lineTo(-w * 0.2, h * 0.42);
    ctx.closePath();
  } else {
    ctx.ellipse(0, 0, w * 0.45, h * 0.42, 0, 0, Math.PI * 2);
  }
}

export function drawTailShape(tail, w, h, color) {
  ctx.fillStyle = color;
  ctx.beginPath();

  if (tail === 'fork') {
    ctx.moveTo(-w * 0.48, 0);
    ctx.lineTo(-w * 0.78, -h * 0.32);
    ctx.lineTo(-w * 0.62, -h * 0.02);
    ctx.lineTo(-w * 0.78, h * 0.32);
    ctx.closePath();
  } else if (tail === 'fan') {
    ctx.moveTo(-w * 0.45, 0);
    ctx.lineTo(-w * 0.72, -h * 0.38);
    ctx.lineTo(-w * 0.75, h * 0.38);
    ctx.closePath();
  } else if (tail === 'round') {
    ctx.arc(-w * 0.58, 0, h * 0.22, 0, Math.PI * 2);
  } else if (tail === 'spike') {
    ctx.moveTo(-w * 0.46, 0);
    ctx.lineTo(-w * 0.82, -h * 0.18);
    ctx.lineTo(-w * 0.82, h * 0.18);
    ctx.closePath();
  } else if (tail === 'whip') {
    ctx.moveTo(-w * 0.38, 0);
    ctx.quadraticCurveTo(-w * 0.7, h * 0.06, -w * 0.95, h * 0.26);
    ctx.lineWidth = 6;
    ctx.strokeStyle = color;
    ctx.stroke();
    return;
  } else if (tail === 'whale') {
    ctx.moveTo(-w * 0.5, 0);
    ctx.lineTo(-w * 0.72, -h * 0.25);
    ctx.lineTo(-w * 0.8, -h * 0.02);
    ctx.lineTo(-w * 0.85, -h * 0.24);
    ctx.lineTo(-w * 0.95, 0);
    ctx.lineTo(-w * 0.85, h * 0.24);
    ctx.lineTo(-w * 0.8, h * 0.02);
    ctx.lineTo(-w * 0.72, h * 0.25);
    ctx.closePath();
  } else {
    ctx.moveTo(-w * 0.47, 0);
    ctx.lineTo(-w * 0.72, -h * 0.32);
    ctx.lineTo(-w * 0.72, h * 0.32);
    ctx.closePath();
  }

  ctx.fill();
}

export function drawFishPattern(pattern, w, h) {
  if (pattern === 'none') return;

  if (pattern === 'stripe') {
    ctx.fillStyle = 'rgba(255,255,255,.20)';
    for (let i = -2; i <= 2; i++) ctx.fillRect(-w * 0.1 + i * 18, -h * 0.32, 8, h * 0.64);
  } else if (pattern === 'spot' || pattern === 'dot') {
    ctx.fillStyle = 'rgba(255,255,255,.25)';
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.arc(-w * 0.12 + (i % 3) * 22, -h * 0.12 + Math.floor(i / 3) * 24, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (pattern === 'finstripe') {
    ctx.strokeStyle = 'rgba(255,255,255,.28)';
    ctx.lineWidth = 3;
    for (let i = -1; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(-w * 0.12 + i * 18, -h * 0.26);
      ctx.lineTo(-w * 0.02 + i * 18, h * 0.26);
      ctx.stroke();
    }
  } else if (pattern === 'line') {
    ctx.strokeStyle = 'rgba(255,255,255,.25)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-w * 0.25, 0);
    ctx.lineTo(w * 0.28, 0);
    ctx.stroke();
  } else if (pattern === 'shadow') {
    ctx.fillStyle = 'rgba(0,0,0,.18)';
    ctx.fillRect(-w * 0.1, -h * 0.28, w * 0.35, h * 0.56);
  } else if (pattern === 'lava' || pattern === 'crack') {
    ctx.strokeStyle = 'rgba(255,220,120,.45)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(-w * 0.15 + i * 22, -h * 0.22);
      ctx.lineTo(-w * 0.05 + i * 22, -h * 0.02);
      ctx.lineTo(-w * 0.12 + i * 22, h * 0.2);
      ctx.stroke();
    }
  } else if (pattern === 'ice') {
    ctx.strokeStyle = 'rgba(255,255,255,.42)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-w * 0.2, -h * 0.12);
    ctx.lineTo(w * 0.1, h * 0.08);
    ctx.moveTo(-w * 0.08, -h * 0.24);
    ctx.lineTo(w * 0.18, 0);
    ctx.moveTo(-w * 0.12, h * 0.2);
    ctx.lineTo(w * 0.12, -h * 0.02);
    ctx.stroke();
  } else if (pattern === 'leaf') {
    ctx.strokeStyle = 'rgba(255,255,255,.24)';
    ctx.lineWidth = 3;
    for (let i = -1; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(-w * 0.18 + i * 18, 0);
      ctx.lineTo(-w * 0.06 + i * 18, -h * 0.18);
      ctx.stroke();
    }
  } else if (pattern === 'mud') {
    ctx.fillStyle = 'rgba(90,60,30,.22)';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(-w * 0.12 + i * 16, (i % 2 === 0 ? -1 : 1) * 10, 7, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (pattern === 'crystal') {
    ctx.strokeStyle = 'rgba(255,255,255,.45)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(-w * 0.12 + i * 18, -h * 0.18);
      ctx.lineTo(-w * 0.04 + i * 18, 0);
      ctx.lineTo(-w * 0.12 + i * 18, h * 0.18);
      ctx.stroke();
    }
  } else if (pattern === 'bolt') {
    ctx.strokeStyle = 'rgba(255,255,180,.55)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-w * 0.14, -h * 0.18);
    ctx.lineTo(-w * 0.02, -h * 0.02);
    ctx.lineTo(-w * 0.1, h * 0.02);
    ctx.lineTo(w * 0.06, h * 0.2);
    ctx.stroke();
  } else if (pattern === 'tiger') {
    ctx.strokeStyle = 'rgba(90,40,10,.45)';
    ctx.lineWidth = 4;
    for (let i = -1; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(-w * 0.16 + i * 18, -h * 0.24);
      ctx.lineTo(-w * 0.02 + i * 18, h * 0.18);
      ctx.stroke();
    }
  } else if (pattern === 'toxic') {
    ctx.fillStyle = 'rgba(255,255,140,.35)';
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.arc(-w * 0.12 + (i % 3) * 20, -h * 0.1 + Math.floor(i / 3) * 24, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (pattern === 'sand') {
    ctx.fillStyle = 'rgba(255,255,255,.18)';
    for (let i = 0; i < 12; i++) {
      ctx.fillRect(-w * 0.2 + i * 10, -h * 0.12 + (i % 2) * 10, 4, 4);
    }
  } else if (pattern === 'wave') {
    ctx.strokeStyle = 'rgba(255,255,255,.30)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 2; i++) {
      ctx.beginPath();
      for (let x = -w * 0.18; x <= w * 0.18; x += 10) {
        const y = Math.sin((x + i * 20) * 0.15) * 5 + (i === 0 ? -8 : 8);
        if (x === -w * 0.18) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  } else if (pattern === 'moon') {
    ctx.fillStyle = 'rgba(255,255,255,.22)';
    ctx.beginPath();
    ctx.arc(0, 0, h * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,.18)';
    ctx.beginPath();
    ctx.arc(h * 0.05, -h * 0.02, h * 0.1, 0, Math.PI * 2);
    ctx.fill();
  } else if (pattern === 'star') {
    ctx.fillStyle = 'rgba(255,255,255,.7)';
    for (let i = 0; i < 5; i++) {
      const sx = -w * 0.12 + i * 18;
      const sy = i % 2 === 0 ? -h * 0.08 : h * 0.08;
      ctx.fillRect(sx - 1, sy - 5, 2, 10);
      ctx.fillRect(sx - 5, sy - 1, 10, 2);
    }
  } else if (pattern === 'void') {
    ctx.fillStyle = 'rgba(140,100,255,.22)';
    ctx.beginPath();
    ctx.arc(0, 0, h * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,.28)';
    ctx.beginPath();
    ctx.arc(0, 0, h * 0.08, 0, Math.PI * 2);
    ctx.fill();
  } else if (pattern === 'cloud') {
    ctx.fillStyle = 'rgba(255,255,255,.30)';
    ctx.beginPath();
    ctx.arc(-10, 2, 9, 0, Math.PI * 2);
    ctx.arc(0, -4, 10, 0, Math.PI * 2);
    ctx.arc(12, 2, 8, 0, Math.PI * 2);
    ctx.fill();
  } else if (pattern === 'galaxy') {
    ctx.fillStyle = 'rgba(255,255,255,.65)';
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.arc(-w * 0.16 + i * 12, Math.sin(i) * 10, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (pattern === 'glowdot') {
    ctx.fillStyle = 'rgba(255,255,180,.65)';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(-w * 0.12 + i * 16, 0, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (pattern === 'gold') {
    ctx.strokeStyle = 'rgba(255,255,255,.35)';
    ctx.lineWidth = 3;
    for (let i = -1; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(-w * 0.14 + i * 18, -h * 0.2);
      ctx.lineTo(-w * 0.04 + i * 18, h * 0.2);
      ctx.stroke();
    }
  }
}

export function drawFish(fish) {
  const f = fish.type;
  const bob = Math.sin(fish.bob) * 4;

  ctx.save();
  ctx.translate(fish.x + fish.w / 2, fish.y + fish.h / 2 + bob);
  ctx.scale(fish.dir, 1);

  if (f.glow) {
    ctx.shadowColor = f.rainbow ? 'rgba(255,255,255,.85)' : f.fin;
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 0;
  } else {
    ctx.shadowColor = f.id >= 4 ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)';
    ctx.shadowBlur = f.id >= 4 ? 12 : 7;
    ctx.shadowOffsetY = 4;
  }

  drawTailShape(f.tail || 'triangle', fish.w, fish.h, f.fin);

  ctx.fillStyle = fishGradient(f, fish.w, fish.h);
  traceFishBody(f.shape || 'round', fish.w, fish.h);
  ctx.fill();

  ctx.save();
  traceFishBody(f.shape || 'round', fish.w, fish.h);
  ctx.clip();
  drawFishPattern(f.pattern || 'none', fish.w, fish.h);
  ctx.restore();

  ctx.shadowBlur = 0;

  ctx.fillStyle = f.fin;
  ctx.beginPath();
  ctx.moveTo(-fish.w * 0.02, -fish.h * 0.02);
  ctx.lineTo(-fish.w * 0.18, -fish.h * 0.46);
  ctx.lineTo(fish.w * 0.14, -fish.h * 0.12);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-fish.w * 0.02, fish.h * 0.1);
  ctx.lineTo(-fish.w * 0.16, fish.h * 0.42);
  ctx.lineTo(fish.w * 0.12, fish.h * 0.16);
  ctx.closePath();
  ctx.fill();

  if (f.shape === 'shark' || f.shape === 'spiky') {
    ctx.beginPath();
    ctx.moveTo(-fish.w * 0.08, -fish.h * 0.12);
    ctx.lineTo(0, -fish.h * 0.54);
    ctx.lineTo(fish.w * 0.08, -fish.h * 0.14);
    ctx.closePath();
    ctx.fill();
  }

  if (f.golden || f.rainbow) {
    ctx.strokeStyle = f.golden ? '#ffd32a' : '#ffffff';
    ctx.lineWidth = 5;
    traceFishBody(f.shape || 'round', fish.w, fish.h);
    ctx.stroke();
  }

  if (f.rainbow) {
    ctx.strokeStyle = 'rgba(255,255,255,.45)';
    ctx.lineWidth = 3;
    drawTailShape(f.tail || 'triangle', fish.w, fish.h, 'rgba(0,0,0,0)');
  }

  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(fish.w * 0.28, -fish.h * 0.1, Math.max(5, fish.h * 0.055), 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(fish.w * 0.3, -fish.h * 0.1, Math.max(2.5, fish.h * 0.027), 0, Math.PI * 2);
  ctx.fill();

  if (f.id >= 4) {
    ctx.save();
    ctx.scale(fish.dir, 1);
    text(ctx, f.name, 0, -fish.h * 0.75, 16, 'center', '#fff');
    ctx.restore();
  }

  ctx.restore();
}

export function drawTreasureChest(chest) {
  const bob = Math.sin(chest.bob) * 5;
  ctx.save();
  ctx.translate(chest.x + chest.w / 2, chest.y + chest.h / 2 + bob);
  ctx.shadowColor = 'rgba(255,215,0,.75)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  roundRect(ctx, -chest.w / 2, -chest.h / 2, chest.w, chest.h, 12, '#8b4513', '#3b1d08', 4);
  ctx.fillStyle = '#5c2f0e';
  ctx.fillRect(-chest.w / 2 + 5, -8, chest.w - 10, 14);
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(-8, -chest.h / 2, 16, chest.h);
  ctx.fillRect(-chest.w / 2, 0, chest.w, 8);
  roundRect(ctx, -14, -2, 28, 24, 5, '#ffdd59', '#5c4300', 3);
  ctx.shadowBlur = 0;
  text(ctx, '?', 0, -chest.h * 0.72, 22, 'center', '#fff16a');
  ctx.restore();
}

export function drawBackground(dt) {
  const map = currentMap();
  game.wave += dt * 0.035;
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, map.sky1);
  sky.addColorStop(0.45, map.sky2);
  sky.addColorStop(1, map.depth);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = map.id === 'lava' ? 'rgba(255,70,20,.9)' : 'rgba(255,240,150,.85)';
  ctx.beginPath();
  ctx.arc(1320, 80, 50, 0, Math.PI * 2);
  ctx.fill();
  if (map.id === 'ice') {
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = 'rgba(255,255,255,.75)';
      ctx.beginPath();
      ctx.moveTo(80 + i * 180, 215);
      ctx.lineTo(125 + i * 180, 170);
      ctx.lineTo(170 + i * 180, 215);
      ctx.fill();
    }
  }
  if (map.id === 'reef') {
    for (let i = 0; i < 12; i++) {
      ctx.fillStyle = i % 2 ? '#ff7675' : '#fd79a8';
      ctx.beginPath();
      ctx.arc(70 + i * 125, 760, irand(12, 28), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  if (map.id === 'lava') {
    ctx.fillStyle = 'rgba(70,30,20,.8)';
    ctx.beginPath();
    ctx.moveTo(80, 225);
    ctx.lineTo(230, 70);
    ctx.lineTo(390, 225);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,80,0,.8)';
    ctx.beginPath();
    ctx.moveTo(205, 95);
    ctx.lineTo(230, 68);
    ctx.lineTo(256, 95);
    ctx.fill();
  }
  drawWater(210, 'rgba(255,255,255,.28)', 16, 1);
  drawWater(310, 'rgba(0,150,240,.42)', 22, 1.15);
  drawWater(510, 'rgba(0,100,210,.48)', 28, 1.3);
  drawWater(700, 'rgba(0,60,160,.58)', 34, 1.5);
}

function drawWater(y, color, amp, spd) {
  ctx.fillStyle = color;

  ctx.beginPath();
  ctx.moveTo(0, H);
  ctx.lineTo(0, y - 20);

  for (let x = 0; x <= W + 40; x += 40) {
    ctx.lineTo(x, y - 20 + Math.sin((x + game.wave * spd) * 0.012) * amp);
  }

  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = 'rgba(255,255,255,.35)';
  ctx.lineWidth = 3;

  ctx.beginPath();
  for (let x = 0; x <= W + 40; x += 40) {
    const yy = y - 20 + Math.sin((x + game.wave * spd) * 0.012) * amp;
    if (x === 0) ctx.moveTo(x, yy);
    else ctx.lineTo(x, yy);
  }
  ctx.stroke();
}

export function drawBoat() {
  ctx.save();
  const tx = game.transition.active ? W / 2 + game.transition.boatX : W / 2;
  ctx.translate(tx, 105);
  ctx.shadowColor = 'rgba(0,0,0,.28)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = '#8b4513';
  ctx.beginPath();
  ctx.moveTo(-170, 35);
  ctx.lineTo(170, 35);
  ctx.lineTo(115, 105);
  ctx.lineTo(-115, 105);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#5c2f0e';
  ctx.fillRect(-110, 55, 220, 18);
  roundRect(ctx, -62, -25, 124, 65, 12, '#f7f1e3', '#8b4513', 5);
  roundRect(ctx, -42, -10, 35, 28, 6, '#54a0ff', '#2e86de', 3);
  roundRect(ctx, 10, -10, 35, 28, 6, '#54a0ff', '#2e86de', 3);
  ctx.fillStyle = '#3d2b1f';
  ctx.fillRect(-6, -85, 12, 70);
  ctx.fillStyle = '#ffdd59';
  ctx.beginPath();
  ctx.moveTo(8, -82);
  ctx.lineTo(76, -48);
  ctx.lineTo(8, -18);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawHarpoon(harpoon) {
  const sy = 160;
  ctx.strokeStyle = 'rgba(0,0,0,.8)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(harpoon.x, sy);
  ctx.lineTo(harpoon.tipX, harpoon.tipY);
  ctx.stroke();
  ctx.save();
  ctx.translate(harpoon.tipX, harpoon.tipY);
  ctx.fillStyle = '#2f3542';
  roundRect(ctx, -5, 0, 10, 60, 4, '#2f3542', '#111', 1);
  ctx.fillStyle = '#ced6e0';
  ctx.beginPath();
  ctx.moveTo(-13, 58);
  ctx.lineTo(0, 88);
  ctx.lineTo(13, 58);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  if (harpoon.status === 'still') {
    ctx.globalAlpha = 0.55;
    ctx.strokeStyle = 'rgba(255,255,255,.75)';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(harpoon.x, 235);
    ctx.lineTo(harpoon.x, H - 40);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }

  if (!game.transition?.active) {
    const boatX = W / 2;
    const boatY = 160;

    ctx.save();
    ctx.strokeStyle = 'rgba(0,0,0,0.85)';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(harpoon.x, 160);
    ctx.lineTo(boatX, boatY);
    ctx.stroke();
    ctx.restore();
  }
}

export function drawEffects() {
  for (const p of game.particles) {
    ctx.globalAlpha = clamp(p.life / 40, 0, 1);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  for (const m of game.messages) {
    ctx.globalAlpha = clamp(m.life / 45, 0, 1);
    text(ctx, m.text, m.x, m.y, 24, 'center', m.color);
    ctx.globalAlpha = 1;
  }
}

export function drawHazards() {
  const lightning = game.hazards.lightning;
  if (!lightning) return;

  const alpha = clamp(lightning.life / lightning.maxLife, 0, 1);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(lightning.x, 140);
  ctx.lineTo(lightning.x - 12, 260);
  ctx.lineTo(lightning.x + 10, 340);
  ctx.lineTo(lightning.x - 8, 450);
  ctx.lineTo(lightning.x + 6, 520);
  ctx.stroke();
  ctx.restore();
}

export function drawTransition() {
  if (!game.transition.active) return;

  const tr = game.transition;
  let alpha = 0;

  if (tr.phase === 'sailOut') {
    alpha = Math.min(1, tr.t / 1.2);
  } else if (tr.phase === 'black') {
    alpha = 1;
  } else if (tr.phase === 'sailIn') {
    alpha = Math.max(0, 1 - tr.t / 1.2);
  }

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = alpha;

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalAlpha = 1;

  if (tr.phase === 'black') {
    ctx.fillStyle = '#fff';
    ctx.font = '42px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Sailing to new waters...', canvas.width / 2, canvas.height / 2);
  }

  ctx.restore();
}
