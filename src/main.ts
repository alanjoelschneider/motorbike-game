import { TO_DEGREES, TWO_PI, lerp, map } from './utils';
import noise1 from './perlin';
import Motorbike from './Motorbike';

type Context = CanvasRenderingContext2D;

const DEBUG = 0;

const WIDTH = 800;
const HEIGHT = 600;

const canvas = document.createElement('canvas');
const ctx = <Context>canvas.getContext('2d');

canvas.width = WIDTH;
canvas.height = HEIGHT;
canvas.style.display = 'block';

document.body.appendChild(canvas);

const background = ctx.createLinearGradient(-WIDTH / 2, HEIGHT / 2, -WIDTH / 2, 0);
background.addColorStop(0, '#FF0');
background.addColorStop(1, '#F00');

const mouse = { x: 0, y: 0 };
const pressing: { [key: string]: number } = {
  ArrowUp: 0,
  ArrowDown: 0,
  ArrowRight: 0,
  ArrowLeft: 0,
};

const motorbikeImg = new Image();
motorbikeImg.src = './motorbike.svg';

const motorbike = new Motorbike(0, 0, 20, 0.01);
const camera = { x: motorbike.x, y: motorbike.y };

const NOISE_FRECUENCY = 0.001;
const NOISE_AMPLITUDE = HEIGHT;

function renderTerrain(ctx: Context, offsetX: number, frecuency: number, amplitude: number) {
  ctx.beginPath();
  ctx.moveTo(-WIDTH / 2, HEIGHT);
  for (let x = -WIDTH / 2; x <= WIDTH; x++) {
    ctx.lineTo(x, ~~(noise1((offsetX + x) * frecuency) * amplitude));
  }
  ctx.lineTo(WIDTH, HEIGHT);
  ctx.fillStyle = '#000';
  ctx.fill();
}

function update(dt: number, fps: number, elapsedTime?: number) {
  const direction = pressing['ArrowUp'] - pressing['ArrowDown'];
  const rotation = pressing['ArrowRight'] - pressing['ArrowLeft'];

  motorbike.applyAngularForce(rotation * Math.PI * 0.05);
  motorbike.applyForce(0, 9.8);
  motorbike.update(dt);

  const floor = noise1(motorbike.x * NOISE_FRECUENCY) * NOISE_AMPLITUDE;

  if (motorbike.y + motorbike.radius > floor) {
    motorbike.y = floor - motorbike.radius;

    motorbike.applyForce(direction * 25, 0);

    const vx = motorbike.getVx();
    const vy = motorbike.getVy();

    if (vx > 0) motorbike.rotation = Math.atan2(vy, vx);
    if (vx < 0) motorbike.rotation = Math.atan2(-vy, -vx);

    motorbike.rotation = motorbike.rotation % TWO_PI;
    motorbike.applyForce(map(motorbike.rotation, -Math.PI / 2, Math.PI / 2, -6, 6), 0);
  }

  camera.y = lerp(0.075, camera.y, motorbike.y);
  camera.y = Math.min(camera.y, HEIGHT / 2);
}

function render(dt: number, fps: number) {
  clear(ctx);

  ctx.fillStyle = background;
  ctx.fillRect(-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT);

  // Camera translation
  ctx.save();
  ctx.translate(-camera.x, -camera.y);

  motorbike.render(ctx, motorbikeImg, 0);

  renderTerrain(ctx, motorbike.x, NOISE_FRECUENCY, NOISE_AMPLITUDE);

  // End camera translation
  ctx.restore();

  if (DEBUG) {
    ctx.save();
    ctx.translate(-WIDTH / 2, -HEIGHT / 2);
    ctx.fillStyle = '#FFF';
    ctx.fillText('Fps: ' + fps.toString(), 2, 10);
    ctx.fillText('Delta time: ' + dt.toString(), 2, 20);
    ctx.fillText(`Mouse { x: ${mouse.x.toString()}, y: ${mouse.y.toString()} }`, 2, 30);
    ctx.fillText(`Player rotation: ${motorbike.rotation * TO_DEGREES}`, 2, 40);
    ctx.restore();
  }
}

console.log((Math.PI / 2) * TO_DEGREES, Math.PI * 1.75 * TO_DEGREES);

function clear(ctx: Context) {
  ctx.fillStyle = '#00D';
  ctx.fillRect(-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT);
}

startGameLoop();

function startGameLoop() {
  let lastUpdate = 0;
  let deltaTime = 0;
  let acumDelta = 0;
  let now = 0;
  let fpsCount = 0;
  let fps = 0;

  function onMouseMove(e: MouseEvent) {
    mouse.x = e.x - canvas.offsetLeft;
    mouse.y = e.y - canvas.offsetTop;
  }

  ctx.translate(WIDTH / 2, HEIGHT / 2);

  canvas.addEventListener('mousemove', onMouseMove, false);
  canvas.addEventListener('mouseup', onMouseMove, false);
  window.addEventListener('keydown', (e) => (pressing[e.key] = 1), false);
  window.addEventListener('keyup', (e) => (pressing[e.key] = 0), false);

  (function gameLoop(elapsedTime?: number) {
    now = window.performance.now();

    deltaTime = (now - lastUpdate) / 1000;
    if (deltaTime > 1) deltaTime = 0;

    lastUpdate = now;

    acumDelta += deltaTime;
    fpsCount++;

    if (acumDelta >= 1) {
      fps = fpsCount;
      acumDelta -= acumDelta;
      fpsCount = 0;
    }

    update(deltaTime, fps, elapsedTime);
    render(deltaTime, fps);

    window.requestAnimationFrame(gameLoop);
  })();
}
