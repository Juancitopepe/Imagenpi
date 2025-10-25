// Configuración básica
const WIDTH = 1000;
const HEIGHT = 1000;
const PIXELS = WIDTH * HEIGHT;
const ANIMATION_TIME = 5000; // ms
const PAUSE_TIME = 2000; // ms

const colorMap = {
  '0': '#ff0000',
  '1': '#00ff00',
  '2': '#0000ff',
  '3': '#100000',
  '4': '#001000',
  '5': '#000010',
  '6': '#050000',
  '7': '#000500',
  '8': '#000005',
  '9': '#000000'
};

const canvas = document.getElementById("piCanvas");
const ctx = canvas.getContext("2d");
const contador = document.getElementById("contador");

let worker = new Worker("piWorker.js");
let totalDigits = 0;
let nextBlock = null;

worker.onmessage = (e) => nextBlock = e.data;

async function start() {
  worker.postMessage(PIXELS);

  while (true) {
    while (!nextBlock) await sleep(100);
    const digits = nextBlock;
    nextBlock = null;
    worker.postMessage(PIXELS);

    totalDigits += digits.length;
    contador.textContent = `Dígitos: ${totalDigits.toLocaleString()}`;
    await animateDigits(digits);
    await sleep(PAUSE_TIME);
  }
}

async function animateDigits(digits) {
  const imgData = ctx.createImageData(WIDTH, HEIGHT);
  const totalFrames = ANIMATION_TIME / 16;
  const step = Math.ceil(digits.length / totalFrames);

  for (let i = 0; i < digits.length; i += step) {
    for (let j = 0; j < step && i + j < digits.length; j++) {
      const d = digits[i + j];
      const c = hexToRgb(colorMap[d]);
      const idx = (i + j) * 4;
      imgData.data[idx] = c.r;
      imgData.data[idx + 1] = c.g;
      imgData.data[idx + 2] = c.b;
      imgData.data[idx + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
    await new Promise(r => requestAnimationFrame(r));
  }
}

function hexToRgb(hex) {
  const v = parseInt(hex.slice(1), 16);
  return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
start();
